import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Image,
  SafeAreaView,
  StatusBar,
  TextInput,
} from 'react-native';
import {
  Send,
  Search,
  MapPin,
  Clock,
  FileText,
  Utensils,
  ShoppingBag,
  Package,
  Zap,
  Shield,
  ChevronRight,
  Bell,
  Sparkles,
  ArrowUpRight,
  Plus,
} from 'lucide-react-native';
import { Colors } from '../../theme/colors';
import { useSettingsStore } from '../../store/useSettingsStore';
import { useAuthStore } from '../../store/useAuthStore';
import { useDeliveryStore } from '../../store/useDeliveryStore';
import { useNotificationStore } from '../../store/useNotificationStore';
import { WayaPatternBackground } from '../../components/cultural/WayaPatternBackground';
import { AfricanPatternDivider } from '../../components/cultural/AfricanPatternDivider';
import { AnimatedDeliveryCard } from '../../components/ui/AnimatedDeliveryCard';
import { InteractiveMap } from '../../components/map/InteractiveMap';
import { PackageCategory } from '../../types';

interface HomeScreenProps {
  onNavigateToSend: (category?: PackageCategory) => void;
  onNavigateToTracking: (orderId?: string) => void;
  onNavigateToNotifications: () => void;
}

const CATEGORIES: Array<{
  id: PackageCategory;
  label: string;
  icon: any;
  color: string;
  time: string;
  priceStart: string;
}> = [
  {
    id: 'packages',
    label: 'Parcels & Boxes',
    icon: Package,
    color: '#0C3823',
    time: '25-45 mins',
    priceStart: 'from ₦1,200',
  },
  {
    id: 'documents',
    label: 'Documents',
    icon: FileText,
    color: '#C8522C',
    time: '20-35 mins',
    priceStart: 'from ₦900',
  },
  {
    id: 'food',
    label: 'Hot Food & Meals',
    icon: Utensils,
    color: '#F5B731',
    time: '15-30 mins',
    priceStart: 'from ₦800',
  },
  {
    id: 'groceries',
    label: 'Market & Groceries',
    icon: ShoppingBag,
    color: '#13864D',
    time: '35-50 mins',
    priceStart: 'from ₦1,400',
  },
];

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onNavigateToSend,
  onNavigateToTracking,
  onNavigateToNotifications,
}) => {
  const { themeMode } = useSettingsStore();
  const isDark = themeMode === 'dark';
  const colors = isDark ? Colors.dark : Colors.light;

  const { user, savedAddresses } = useAuthStore();
  const { deliveries, activeDeliveryId, setActiveDeliveryId } = useDeliveryStore();
  const { unreadCount } = useNotificationStore();

  const [quickTrackCode, setQuickTrackCode] = useState('');

  const activeOrder = deliveries.find((d) => d.status === 'IN_TRANSIT' || d.status === 'RIDER_ASSIGNED');

  const handleQuickTrack = () => {
    if (quickTrackCode.trim()) {
      const match = deliveries.find(
        (d) =>
          d.trackingNumber.toLowerCase().includes(quickTrackCode.toLowerCase().trim()) ||
          d.id.toLowerCase().includes(quickTrackCode.toLowerCase().trim())
      );
      if (match) {
        setActiveDeliveryId(match.id);
        onNavigateToTracking(match.id);
      } else {
        onNavigateToTracking();
      }
    } else {
      onNavigateToTracking();
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      <WayaPatternBackground variant="adire" opacity={0.06} />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Top App Bar: User Greeting + Location Pill + Notification Bell */}
        <View style={styles.topBar}>
          <View style={styles.userSection}>
            <Image
              source={{ uri: user?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200' }}
              style={[styles.avatar, { borderColor: colors.primary }]}
            />
            <View style={styles.greetingGroup}>
              <Text style={[styles.greetingSub, { color: colors.textSecondary }]}>
                Ẹ n lẹ o / Ńdēwó / Sannu 👋
              </Text>
              <Text style={[styles.userName, { color: colors.textPrimary }]}>
                {user?.fullName?.split(' ')[0] || 'Chidi'}
              </Text>
            </View>
          </View>

          <Pressable
            style={[styles.notifBtn, { backgroundColor: colors.surface, borderColor: colors.border }]}
            onPress={onNavigateToNotifications}
          >
            <Bell size={20} color={colors.textPrimary} />
            {unreadCount > 0 && (
              <View style={[styles.notifBadge, { backgroundColor: colors.accent }]}>
                <Text style={styles.notifBadgeText}>{unreadCount}</Text>
              </View>
            )}
          </Pressable>
        </View>

        {/* Current Location Pill Bar */}
        <View style={[styles.locationBar, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={styles.locationLeft}>
            <MapPin size={16} color={colors.accent} />
            <Text style={[styles.locationLabel, { color: colors.textMuted }]}>Delivering to:</Text>
            <Text style={[styles.locationValue, { color: colors.textPrimary }]} numberOfLines={1}>
              {user?.homeAddress || 'Admiralty Way, Lekki Phase 1, Lagos'}
            </Text>
          </View>
          <ChevronRight size={16} color={colors.textMuted} />
        </View>

        {/* Active Delivery Alert Banner (If order in transit) */}
        {activeOrder && (
          <Pressable
            style={[styles.activeOrderBanner, { backgroundColor: colors.primary, shadowColor: colors.primary }]}
            onPress={() => {
              setActiveDeliveryId(activeOrder.id);
              onNavigateToTracking(activeOrder.id);
            }}
          >
            <View style={styles.activeBannerLeft}>
              <View style={styles.activeBannerPulse}>
                <View style={[styles.liveDot, { backgroundColor: colors.gold }]} />
              </View>
              <View>
                <View style={styles.activeOrderTopRow}>
                  <Text style={styles.activeOrderTag}>LIVE DELIVERY IN PROGRESS</Text>
                  <Text style={styles.activeOrderCode}>{activeOrder.trackingNumber}</Text>
                </View>
                <Text style={styles.activeOrderDesc} numberOfLines={1}>
                  Rider Babajide is {activeOrder.price.estimatedMinutes} mins away •{' '}
                  {activeOrder.destination.addressText.split(',')[0]}
                </Text>
              </View>
            </View>
            <ArrowUpRight size={20} color="#FFFFFF" />
          </Pressable>
        )}

        {/* Hero Actions: "Send a Package" + "Quick Track Delivery" */}
        <View style={styles.heroRow}>
          {/* Main "Send a Package" Card */}
          <Pressable
            style={[styles.sendHeroCard, { backgroundColor: colors.primary }]}
            onPress={() => onNavigateToSend('packages')}
          >
            <View style={styles.sendHeroTop}>
              <View style={[styles.sendIconPill, { backgroundColor: colors.gold }]}>
                <Send size={22} color="#151917" />
              </View>
              <View style={styles.swiftPill}>
                <Zap size={12} color="#FFFFFF" />
                <Text style={styles.swiftText}>FAST DISPATCH</Text>
              </View>
            </View>

            <View style={styles.sendHeroBottom}>
              <Text style={styles.sendHeroTitle}>Send a Package</Text>
              <Text style={styles.sendHeroSub}>Instant bike dispatch across Lagos & Abuja</Text>
            </View>
          </Pressable>

          {/* Quick Track Input Card */}
          <View style={[styles.trackHeroCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <View style={styles.trackCardHeader}>
              <Search size={16} color={colors.accent} />
              <Text style={[styles.trackCardTitle, { color: colors.textPrimary }]}>Track By Code</Text>
            </View>
            <TextInput
              style={[styles.trackInput, { backgroundColor: colors.surfaceSubtle, color: colors.textPrimary }]}
              placeholder="e.g. WY-8492"
              placeholderTextColor={colors.textMuted}
              value={quickTrackCode}
              onChangeText={setQuickTrackCode}
            />
            <Pressable
              style={[styles.trackActionBtn, { backgroundColor: colors.accent }]}
              onPress={handleQuickTrack}
            >
              <Text style={styles.trackActionText}>Track Now</Text>
            </Pressable>
          </View>
        </View>

        {/* Live Lagos Interactive Radar Map Preview */}
        <View style={styles.sectionHeader}>
          <View style={styles.sectionTitleRow}>
            <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Live City Dispatch Radar</Text>
            <View style={[styles.activeRidersPill, { backgroundColor: colors.primaryContainer }]}>
              <Text style={[styles.activeRidersText, { color: colors.primary }]}>14 Riders Online</Text>
            </View>
          </View>
          <Pressable onPress={() => onNavigateToTracking()}>
            <Text style={[styles.sectionLink, { color: colors.accent }]}>View Full Map</Text>
          </Pressable>
        </View>

        <View style={[styles.mapPreviewCard, { borderColor: colors.border }]}>
          <InteractiveMap height={200} interactive={false} routeIndex={4} />
          <Pressable
            style={[styles.mapOverlayTap, { backgroundColor: 'rgba(0,0,0,0.1)' }]}
            onPress={() => onNavigateToTracking()}
          >
            <View style={[styles.mapOverlayBadge, { backgroundColor: colors.surface }]}>
              <Text style={[styles.mapOverlayText, { color: colors.primary }]}>
                Tap to enter Live 60 FPS Tracking
              </Text>
            </View>
          </Pressable>
        </View>

        {/* Delivery Categories Grid */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Delivery Categories</Text>
          <Text style={[styles.sectionSub, { color: colors.textMuted }]}>Choose package type</Text>
        </View>

        <View style={styles.categoryGrid}>
          {CATEGORIES.map((cat) => {
            const IconComp = cat.icon;
            return (
              <Pressable
                key={cat.id}
                style={[
                  styles.categoryCard,
                  { backgroundColor: colors.surface, borderColor: colors.border },
                ]}
                onPress={() => onNavigateToSend(cat.id)}
              >
                <View style={[styles.categoryIconCircle, { backgroundColor: colors.surfaceSubtle }]}>
                  <IconComp size={24} color={cat.color} />
                </View>
                <Text style={[styles.categoryLabel, { color: colors.textPrimary }]}>{cat.label}</Text>
                <Text style={[styles.categoryTime, { color: colors.textMuted }]}>{cat.time}</Text>
                <Text style={[styles.categoryPrice, { color: colors.primary }]}>{cat.priceStart}</Text>
              </Pressable>
            );
          })}
        </View>

        {/* Saved Addresses Shortcuts */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Saved Addresses</Text>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.savedScroll}>
          {savedAddresses.map((addr) => (
            <Pressable
              key={addr.id}
              style={[
                styles.savedAddressCard,
                { backgroundColor: colors.surface, borderColor: colors.border },
              ]}
              onPress={() => onNavigateToSend('packages')}
            >
              <View style={[styles.savedIconBox, { backgroundColor: colors.primaryContainer }]}>
                <MapPin size={16} color={colors.primary} />
              </View>
              <View style={styles.savedTextBox}>
                <Text style={[styles.savedTitle, { color: colors.textPrimary }]}>{addr.title}</Text>
                <Text style={[styles.savedDesc, { color: colors.textMuted }]} numberOfLines={1}>
                  {addr.addressText}
                </Text>
              </View>
            </Pressable>
          ))}
        </ScrollView>

        {/* Promotional Banner */}
        <View style={[styles.promoBanner, { backgroundColor: colors.surfaceSubtle, borderColor: colors.border }]}>
          <View style={styles.promoLeft}>
            <Sparkles size={24} color={colors.goldDark} />
            <View>
              <Text style={[styles.promoTitle, { color: colors.textPrimary }]}>
                First 3 Deliveries Get 20% Off!
              </Text>
              <Text style={[styles.promoSub, { color: colors.textSecondary }]}>
                Use promo code <Text style={{ fontWeight: '800', color: colors.accent }}>WAYAFIRST</Text> at checkout.
              </Text>
            </View>
          </View>
        </View>

        {/* Recent Deliveries */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Recent Deliveries</Text>
          <Pressable onPress={() => onNavigateToTracking()}>
            <Text style={[styles.sectionLink, { color: colors.primary }]}>See All</Text>
          </Pressable>
        </View>

        {deliveries.slice(0, 2).map((ord) => (
          <AnimatedDeliveryCard
            key={ord.id}
            order={ord}
            onPress={() => {
              setActiveDeliveryId(ord.id);
              onNavigateToTracking(ord.id);
            }}
          />
        ))}
      </ScrollView>

      {/* Floating Action Button for Instant Delivery */}
      <Pressable
        style={[styles.fab, { backgroundColor: colors.primary, shadowColor: colors.primary }]}
        onPress={() => onNavigateToSend('packages')}
      >
        <Plus size={24} color="#FFFFFF" strokeWidth={3} />
        <Text style={styles.fabText}>New Order</Text>
      </Pressable>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 90,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  userSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    borderWidth: 2,
  },
  greetingGroup: {
    justifyContent: 'center',
  },
  greetingSub: {
    fontSize: 12,
    fontWeight: '500',
  },
  userName: {
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: 0.3,
  },
  notifBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  notifBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notifBadgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '800',
  },
  locationBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 16,
  },
  locationLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flex: 1,
    marginRight: 8,
  },
  locationLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
  locationValue: {
    fontSize: 12,
    fontWeight: '700',
    flex: 1,
  },
  activeOrderBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
    borderRadius: 18,
    marginBottom: 16,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 4,
  },
  activeBannerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  activeBannerPulse: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  liveDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  activeOrderTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  activeOrderTag: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  activeOrderCode: {
    color: '#F5B731',
    fontSize: 11,
    fontWeight: '900',
  },
  activeOrderDesc: {
    color: '#E0EDE6',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 2,
  },
  heroRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  sendHeroCard: {
    flex: 1.3,
    padding: 18,
    borderRadius: 24,
    justifyContent: 'space-between',
    minHeight: 160,
  },
  sendHeroTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sendIconPill: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  swiftPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  swiftText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '800',
  },
  sendHeroBottom: {
    marginTop: 18,
  },
  sendHeroTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '900',
  },
  sendHeroSub: {
    color: '#D2E3DA',
    fontSize: 11,
    marginTop: 4,
  },
  trackHeroCard: {
    flex: 1,
    padding: 14,
    borderRadius: 24,
    borderWidth: 1,
    justifyContent: 'space-between',
  },
  trackCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  trackCardTitle: {
    fontSize: 13,
    fontWeight: '800',
  },
  trackInput: {
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 12,
    fontSize: 13,
    fontWeight: '700',
    textAlign: 'center',
    marginVertical: 8,
  },
  trackActionBtn: {
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  trackActionText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    marginBottom: 10,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '800',
  },
  sectionSub: {
    fontSize: 12,
  },
  sectionLink: {
    fontSize: 13,
    fontWeight: '700',
  },
  activeRidersPill: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  activeRidersText: {
    fontSize: 10,
    fontWeight: '800',
  },
  mapPreviewCard: {
    borderRadius: 22,
    borderWidth: 1,
    overflow: 'hidden',
    position: 'relative',
    marginBottom: 18,
  },
  mapOverlayTap: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapOverlayBadge: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  mapOverlayText: {
    fontSize: 12,
    fontWeight: '800',
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 18,
  },
  categoryCard: {
    width: '48%',
    padding: 14,
    borderRadius: 18,
    borderWidth: 1,
    alignItems: 'flex-start',
  },
  categoryIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  categoryLabel: {
    fontSize: 13,
    fontWeight: '700',
  },
  categoryTime: {
    fontSize: 11,
    marginTop: 2,
  },
  categoryPrice: {
    fontSize: 12,
    fontWeight: '800',
    marginTop: 6,
  },
  savedScroll: {
    gap: 12,
    paddingRight: 20,
    marginBottom: 18,
  },
  savedAddressCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
    width: 220,
    gap: 10,
  },
  savedIconBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  savedTextBox: {
    flex: 1,
  },
  savedTitle: {
    fontSize: 13,
    fontWeight: '700',
  },
  savedDesc: {
    fontSize: 11,
    marginTop: 1,
  },
  promoBanner: {
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    marginBottom: 18,
  },
  promoLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  promoTitle: {
    fontSize: 14,
    fontWeight: '800',
  },
  promoSub: {
    fontSize: 12,
    marginTop: 2,
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 30,
    gap: 8,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 8,
  },
  fabText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
});
