import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  SafeAreaView,
  StatusBar,
  Dimensions,
} from 'react-native';
import { Compass, ShieldCheck, XCircle, Bike, CheckCircle2 } from 'lucide-react-native';
import { Colors } from '../../theme/colors';
import { useSettingsStore } from '../../store/useSettingsStore';
import { useDeliveryStore } from '../../store/useDeliveryStore';
import { WayaPatternBackground } from '../../components/cultural/WayaPatternBackground';
import { AfricanPatternDivider } from '../../components/cultural/AfricanPatternDivider';
import { WayaPrimaryButton } from '../../components/ui/WayaPrimaryButton';
import { InteractiveMap } from '../../components/map/InteractiveMap';
import { DeliveryOrder } from '../../types';

interface RiderMatchingScreenProps {
  order: DeliveryOrder;
  onMatched: () => void;
  onCancel: () => void;
}

export const RiderMatchingScreen: React.FC<RiderMatchingScreenProps> = ({
  order,
  onMatched,
  onCancel,
}) => {
  const { themeMode, isReducedMotion } = useSettingsStore();
  const isDark = themeMode === 'dark';
  const colors = isDark ? Colors.dark : Colors.light;

  const { isMatchingRider, matchingProgress, matchingMessage, startMatchingSimulation } =
    useDeliveryStore();

  const pulseScale = useRef(new Animated.Value(1)).current;
  const pulseOpacity = useRef(new Animated.Value(0.7)).current;
  const sweepRotate = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    startMatchingSimulation(order.id);

    if (!isReducedMotion) {
      Animated.loop(
        Animated.parallel([
          Animated.timing(pulseScale, {
            toValue: 2.2,
            duration: 1600,
            useNativeDriver: true,
          }),
          Animated.timing(pulseOpacity, {
            toValue: 0,
            duration: 1600,
            useNativeDriver: true,
          }),
        ])
      ).start();

      Animated.loop(
        Animated.timing(sweepRotate, {
          toValue: 1,
          duration: 3000,
          useNativeDriver: true,
        })
      ).start();
    }
  }, [order.id, isReducedMotion]);

  useEffect(() => {
    if (matchingProgress >= 100) {
      const timer = setTimeout(() => {
        onMatched();
      }, 900);
      return () => clearTimeout(timer);
    }
  }, [matchingProgress]);

  const radarSpin = sweepRotate.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      <WayaPatternBackground variant="ankara" opacity={0.08} />

      {/* Top Header */}
      <View style={styles.header}>
        <View style={[styles.badge, { backgroundColor: colors.primaryContainer }]}>
          <Text style={[styles.badgeText, { color: colors.primary }]}>ORDER {order.trackingNumber}</Text>
        </View>
        <Text style={[styles.title, { color: colors.textPrimary }]}>Finding Your Waya Rider</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Matching with top-rated dispatch riders near {order.pickup.addressText.split(',')[0]}
        </Text>
      </View>

      {/* Sonar Radar Arena */}
      <View style={styles.radarArena}>
        {/* Pulsing Sonar Waves */}
        <Animated.View
          style={[
            styles.pulseWave,
            {
              borderColor: colors.gold,
              transform: [{ scale: pulseScale }],
              opacity: pulseOpacity,
            },
          ]}
        />
        <Animated.View
          style={[
            styles.pulseWaveSecondary,
            {
              borderColor: colors.accent,
              transform: [{ scale: pulseScale }],
              opacity: pulseOpacity,
            },
          ]}
        />

        {/* Central Radar Node */}
        <View style={[styles.centerNode, { backgroundColor: colors.surface, borderColor: colors.primary }]}>
          <Animated.View style={{ transform: [{ rotate: radarSpin }] }}>
            <Compass size={44} color={colors.primary} />
          </Animated.View>
        </View>

        {/* Simulated Surrounding Rider Dots */}
        <View style={[styles.riderDot, { top: 40, left: 70, backgroundColor: colors.accent }]}>
          <Bike size={12} color="#FFFFFF" />
        </View>
        <View style={[styles.riderDot, { bottom: 50, right: 60, backgroundColor: colors.gold }]}>
          <Bike size={12} color="#151917" />
        </View>
        <View style={[styles.riderDot, { top: 80, right: 80, backgroundColor: colors.primary }]}>
          <Bike size={12} color="#FFFFFF" />
        </View>
      </View>

      {/* Live Map Preview */}
      <View style={[styles.mapCard, { borderColor: colors.border }]}>
        <InteractiveMap height={160} interactive={false} routeIndex={1} />
      </View>

      {/* Status Progress Card */}
      <View style={[styles.progressCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <View style={styles.progressHeader}>
          <View style={styles.progressTitleRow}>
            {matchingProgress >= 100 ? (
              <CheckCircle2 size={18} color={colors.success} />
            ) : (
              <View style={[styles.statusIndicatorDot, { backgroundColor: colors.gold }]} />
            )}
            <Text style={[styles.progressTitle, { color: colors.textPrimary }]}>
              {matchingProgress >= 100 ? 'Rider Assigned!' : 'Dispatch Radar Scanning'}
            </Text>
          </View>
          <Text style={[styles.progressPercent, { color: colors.primary }]}>{matchingProgress}%</Text>
        </View>

        {/* Progress Bar */}
        <View style={[styles.progressBarTrack, { backgroundColor: colors.surfaceSubtle }]}>
          <View
            style={[
              styles.progressBarFill,
              { width: `${matchingProgress}%`, backgroundColor: colors.primary },
            ]}
          />
        </View>

        <Text style={[styles.messageText, { color: colors.textSecondary }]}>
          {matchingMessage}
        </Text>

        <AfricanPatternDivider variant="kente-bars" height={6} style={{ width: '100%', marginVertical: 12 }} />

        {/* Cancel Button */}
        <WayaPrimaryButton
          title="Cancel Search"
          onPress={onCancel}
          variant="outline"
          size="md"
          icon={<XCircle size={18} color={colors.primary} />}
          style={{ width: '100%' }}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: 'space-between',
    paddingBottom: 24,
  },
  header: {
    alignItems: 'center',
    paddingTop: 16,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 8,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  title: {
    fontSize: 22,
    fontWeight: '900',
    marginBottom: 4,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 13,
    textAlign: 'center',
    paddingHorizontal: 16,
  },
  radarArena: {
    width: 220,
    height: 220,
    borderRadius: 110,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginVertical: 10,
  },
  pulseWave: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 2,
  },
  pulseWaveSecondary: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 90,
    borderWidth: 1.5,
  },
  centerNode: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 6,
  },
  riderDot: {
    position: 'absolute',
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  mapCard: {
    borderRadius: 20,
    borderWidth: 1,
    overflow: 'hidden',
    marginVertical: 6,
  },
  progressCard: {
    padding: 18,
    borderRadius: 24,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 4,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusIndicatorDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  progressTitle: {
    fontSize: 14,
    fontWeight: '800',
  },
  progressPercent: {
    fontSize: 14,
    fontWeight: '900',
  },
  progressBarTrack: {
    width: '100%',
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  messageText: {
    fontSize: 12,
    fontWeight: '600',
    lineHeight: 18,
  },
});
