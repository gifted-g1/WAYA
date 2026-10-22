import React, { useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Animated,
  Image,
  Platform,
} from 'react-native';
import {
  Package,
  MapPin,
  Clock,
  ArrowRight,
  ChevronRight,
  ShieldCheck,
  Bike,
} from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { DeliveryOrder } from '../../types';
import { Colors } from '../../theme/colors';
import { useSettingsStore } from '../../store/useSettingsStore';

interface AnimatedDeliveryCardProps {
  order: DeliveryOrder;
  onPress: () => void;
  showRider?: boolean;
}

export const AnimatedDeliveryCard: React.FC<AnimatedDeliveryCardProps> = ({
  order,
  onPress,
  showRider = true,
}) => {
  const { themeMode, isReducedMotion } = useSettingsStore();
  const isDark = themeMode === 'dark';
  const colors = isDark ? Colors.dark : Colors.light;

  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    if (Platform.OS !== 'web') {
      try {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      } catch (e) {}
    }
    if (!isReducedMotion) {
      Animated.spring(scaleAnim, {
        toValue: 0.97,
        useNativeDriver: true,
        friction: 8,
      }).start();
    }
  };

  const handlePressOut = () => {
    if (!isReducedMotion) {
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        friction: 8,
      }).start();
    }
  };

  const getStatusBadge = () => {
    switch (order.status) {
      case 'IN_TRANSIT':
        return {
          label: 'In Transit',
          bg: isDark ? '#1C3825' : '#E8F5EE',
          text: colors.primary,
          dotColor: colors.gold,
        };
      case 'RIDER_ASSIGNED':
      case 'RIDER_ARRIVING':
        return {
          label: 'Rider Assigned',
          bg: isDark ? '#3D2F12' : '#FEF3C7',
          text: colors.warning,
          dotColor: colors.warning,
        };
      case 'DELIVERED':
        return {
          label: 'Delivered',
          bg: isDark ? '#143322' : '#EAF8F0',
          text: colors.success,
          dotColor: colors.success,
        };
      case 'CANCELLED':
        return {
          label: 'Cancelled',
          bg: isDark ? '#361111' : '#FDF2F2',
          text: colors.error,
          dotColor: colors.error,
        };
      case 'SEARCHING_FOR_RIDER':
      default:
        return {
          label: 'Finding Rider',
          bg: isDark ? '#382218' : '#FCEFEA',
          text: colors.accent,
          dotColor: colors.accent,
        };
    }
  };

  const badge = getStatusBadge();

  return (
    <Animated.View style={[{ transform: [{ scale: scaleAnim }] }, styles.wrapper]}>
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={[
          styles.card,
          {
            backgroundColor: colors.surface,
            borderColor: colors.border,
            shadowColor: colors.cardShadow,
          },
        ]}
      >
        {/* Top Header: Tracking Number + Status Badge */}
        <View style={styles.headerRow}>
          <View style={styles.trackingGroup}>
            <Package size={16} color={colors.primary} />
            <Text style={[styles.trackingNumber, { color: colors.textPrimary }]}>
              {order.trackingNumber}
            </Text>
            {order.isFragile && (
              <View style={[styles.fragilePill, { backgroundColor: colors.accentContainer }]}>
                <Text style={[styles.fragileText, { color: colors.accent }]}>Fragile</Text>
              </View>
            )}
          </View>

          <View style={[styles.statusBadge, { backgroundColor: badge.bg }]}>
            <View style={[styles.statusDot, { backgroundColor: badge.dotColor }]} />
            <Text style={[styles.statusText, { color: badge.text }]}>{badge.label}</Text>
          </View>
        </View>

        {/* Route Preview */}
        <View style={styles.routeContainer}>
          <View style={styles.routeNodes}>
            <View style={[styles.pickupDot, { backgroundColor: colors.primary }]} />
            <View style={[styles.routeDottedLine, { borderColor: colors.border }]} />
            <View style={[styles.destDot, { backgroundColor: colors.accent }]} />
          </View>

          <View style={styles.routeDetails}>
            <View style={styles.routeStop}>
              <Text style={[styles.stopTitle, { color: colors.textPrimary }]} numberOfLines={1}>
                {order.pickup.addressText}
              </Text>
              {order.pickup.landmark ? (
                <Text style={[styles.stopSub, { color: colors.textMuted }]} numberOfLines={1}>
                  {order.pickup.landmark}
                </Text>
              ) : null}
            </View>

            <View style={styles.routeStop}>
              <Text style={[styles.stopTitle, { color: colors.textPrimary }]} numberOfLines={1}>
                {order.destination.addressText}
              </Text>
              {order.destination.landmark ? (
                <Text style={[styles.stopSub, { color: colors.textMuted }]} numberOfLines={1}>
                  {order.destination.landmark}
                </Text>
              ) : null}
            </View>
          </View>
        </View>

        {/* Bottom Information Row: Price, ETA/Date, Rider Avatar */}
        <View style={[styles.footerRow, { borderTopColor: colors.divider }]}>
          <View style={styles.footerLeft}>
            <Text style={[styles.priceText, { color: colors.textPrimary }]}>
              ₦{order.price.totalNaira.toLocaleString('en-NG')}
            </Text>
            <View style={styles.etaRow}>
              <Clock size={12} color={colors.textMuted} />
              <Text style={[styles.etaText, { color: colors.textSecondary }]}>
                {order.status === 'DELIVERED'
                  ? 'Completed'
                  : `${order.price.estimatedMinutes} mins • ${order.price.distanceKm} km`}
              </Text>
            </View>
          </View>

          {showRider && order.rider ? (
            <View style={styles.riderSnippet}>
              <Image source={{ uri: order.rider.avatarUrl }} style={styles.riderAvatar} />
              <View style={styles.riderInfo}>
                <Text style={[styles.riderName, { color: colors.textPrimary }]} numberOfLines={1}>
                  {order.rider.name.split(' ')[0]}
                </Text>
                <Text style={[styles.riderPlate, { color: colors.textMuted }]}>
                  {order.rider.plateNumber.split(' ')[0]}
                </Text>
              </View>
              <ChevronRight size={16} color={colors.textMuted} />
            </View>
          ) : (
            <View style={styles.viewDetailsRow}>
              <Text style={[styles.viewDetailsText, { color: colors.primary }]}>View Details</Text>
              <ChevronRight size={16} color={colors.primary} />
            </View>
          )}
        </View>
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginVertical: 6,
  },
  card: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 16,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  trackingGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  trackingNumber: {
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  fragilePill: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  fragileText: {
    fontSize: 10,
    fontWeight: '700',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 6,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
  },
  routeContainer: {
    flexDirection: 'row',
    marginVertical: 6,
  },
  routeNodes: {
    alignItems: 'center',
    marginRight: 12,
    paddingVertical: 4,
  },
  pickupDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  routeDottedLine: {
    width: 1,
    height: 28,
    borderLeftWidth: 1.5,
    borderStyle: 'dashed',
    marginVertical: 3,
  },
  destDot: {
    width: 10,
    height: 10,
    borderRadius: 2,
  },
  routeDetails: {
    flex: 1,
    justifyContent: 'space-between',
  },
  routeStop: {
    marginBottom: 8,
  },
  stopTitle: {
    fontSize: 13,
    fontWeight: '600',
  },
  stopSub: {
    fontSize: 11,
    marginTop: 1,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    paddingTop: 12,
    marginTop: 4,
  },
  footerLeft: {
    justifyContent: 'center',
  },
  priceText: {
    fontSize: 17,
    fontWeight: '900',
    letterSpacing: 0.3,
  },
  etaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  etaText: {
    fontSize: 11,
    fontWeight: '500',
  },
  riderSnippet: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  riderAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  riderInfo: {
    alignItems: 'flex-start',
  },
  riderName: {
    fontSize: 12,
    fontWeight: '700',
  },
  riderPlate: {
    fontSize: 10,
  },
  viewDetailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  viewDetailsText: {
    fontSize: 12,
    fontWeight: '700',
  },
});
