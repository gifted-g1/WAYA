import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { Check, Clock, Bike, PackageCheck, MapPin } from 'lucide-react-native';
import { DeliveryStatus } from '../../types';
import { Colors } from '../../theme/colors';
import { useSettingsStore } from '../../store/useSettingsStore';

interface DeliveryStatusTimelineProps {
  status: DeliveryStatus;
}

const STAGES: Array<{ key: DeliveryStatus; label: string; icon: string }> = [
  { key: 'CREATED', label: 'Order Placed', icon: 'clock' },
  { key: 'RIDER_ASSIGNED', label: 'Rider Found', icon: 'bike' },
  { key: 'PICKED_UP', label: 'Package Picked', icon: 'package' },
  { key: 'IN_TRANSIT', label: 'On The Way', icon: 'pin' },
  { key: 'DELIVERED', label: 'Delivered', icon: 'check' },
];

export const DeliveryStatusTimeline: React.FC<DeliveryStatusTimelineProps> = ({ status }) => {
  const { themeMode, isReducedMotion } = useSettingsStore();
  const isDark = themeMode === 'dark';
  const colors = isDark ? Colors.dark : Colors.light;

  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (isReducedMotion) return;
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.25,
          duration: 900,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 900,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [isReducedMotion]);

  const getStageIndex = (current: DeliveryStatus): number => {
    switch (current) {
      case 'CREATED':
      case 'SEARCHING_FOR_RIDER':
        return 0;
      case 'RIDER_ASSIGNED':
      case 'RIDER_ARRIVING':
        return 1;
      case 'PICKED_UP':
        return 2;
      case 'IN_TRANSIT':
      case 'ARRIVED':
        return 3;
      case 'DELIVERED':
        return 4;
      case 'CANCELLED':
        return -1;
    }
  };

  const activeIndex = getStageIndex(status);

  if (status === 'CANCELLED') {
    return (
      <View style={[styles.cancelledBox, { backgroundColor: colors.errorBg, borderColor: colors.error }]}>
        <Text style={[styles.cancelledText, { color: colors.error }]}>
          Order Cancelled • Funds Refunded to Waya Wallet
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {STAGES.map((stage, i) => {
        const isPassed = i < activeIndex;
        const isCurrent = i === activeIndex;
        const isPending = i > activeIndex;

        return (
          <View key={stage.key} style={styles.stageItem}>
            {/* Horizontal Line connector */}
            {i > 0 && (
              <View
                style={[
                  styles.connectorLine,
                  {
                    backgroundColor: isPassed || isCurrent ? colors.primary : colors.border,
                  },
                ]}
              />
            )}

            {/* Stage Icon Node */}
            <View style={styles.nodeWrapper}>
              {isCurrent && (
                <Animated.View
                  style={[
                    styles.currentPulseRing,
                    {
                      borderColor: colors.gold,
                      transform: [{ scale: pulseAnim }],
                    },
                  ]}
                />
              )}
              <View
                style={[
                  styles.node,
                  {
                    backgroundColor: isPassed
                      ? colors.primary
                      : isCurrent
                      ? colors.gold
                      : colors.surfaceSubtle,
                    borderColor: isPassed || isCurrent ? colors.primary : colors.border,
                  },
                ]}
              >
                {isPassed ? (
                  <Check size={14} color="#FFFFFF" strokeWidth={3} />
                ) : isCurrent ? (
                  <View style={[styles.innerActiveDot, { backgroundColor: '#141716' }]} />
                ) : (
                  <View style={[styles.innerPendingDot, { backgroundColor: colors.textMuted }]} />
                )}
              </View>
            </View>

            {/* Stage Title */}
            <Text
              style={[
                styles.stageLabel,
                {
                  color: isCurrent
                    ? colors.textPrimary
                    : isPassed
                    ? colors.textSecondary
                    : colors.textMuted,
                  fontWeight: isCurrent ? '700' : '500',
                },
              ]}
              numberOfLines={2}
            >
              {stage.label}
            </Text>
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 8,
  },
  stageItem: {
    flex: 1,
    alignItems: 'center',
    position: 'relative',
  },
  connectorLine: {
    position: 'absolute',
    top: 14,
    right: '50%',
    width: '100%',
    height: 3,
    zIndex: -1,
  },
  nodeWrapper: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  node: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  currentPulseRing: {
    position: 'absolute',
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 2,
    opacity: 0.6,
    zIndex: 1,
  },
  innerActiveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  innerPendingDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  stageLabel: {
    fontSize: 10,
    textAlign: 'center',
    marginTop: 2,
  },
  cancelledBox: {
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    marginVertical: 8,
  },
  cancelledText: {
    fontSize: 13,
    fontWeight: '700',
  },
});
