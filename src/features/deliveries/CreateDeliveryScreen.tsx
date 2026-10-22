import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Pressable,
  Switch,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import {
  MapPin,
  ArrowRight,
  Package,
  FileText,
  Utensils,
  ShoppingBag,
  Zap,
  Clock,
  ShieldAlert,
  ChevronDown,
  Check,
  Wallet,
  CreditCard,
  Banknote,
  Sparkles,
} from 'lucide-react-native';
import { Colors } from '../../theme/colors';
import { useSettingsStore } from '../../store/useSettingsStore';
import { useAuthStore } from '../../store/useAuthStore';
import { useDeliveryStore } from '../../store/useDeliveryStore';
import { WayaPatternBackground } from '../../components/cultural/WayaPatternBackground';
import { AfricanPatternDivider } from '../../components/cultural/AfricanPatternDivider';
import { WayaPrimaryButton } from '../../components/ui/WayaPrimaryButton';
import { deliveryService } from '../../services/deliveryService';
import { POPULAR_LOCATIONS } from '../../services/mockData';
import {
  LocationPoint,
  PackageCategory,
  PackageSize,
  ServiceTier,
  DeliveryOrder,
} from '../../types';
import { RiderMatchingScreen } from './RiderMatchingScreen';

interface CreateDeliveryScreenProps {
  initialCategory?: PackageCategory;
  onOrderCompleted: (orderId: string) => void;
  onCancel: () => void;
}

const PACKAGE_SIZES: Array<{ id: PackageSize; label: string; desc: string; icon: string }> = [
  { id: 'envelope', label: 'Envelope / Letter', desc: 'Up to 0.5kg', icon: '✉️' },
  { id: 'small_box', label: 'Small Box', desc: 'Shoebox size, up to 3kg', icon: '📦' },
  { id: 'medium_box', label: 'Medium Box', desc: 'Microwave size, up to 10kg', icon: '🧳' },
  { id: 'large_box', label: 'Large / Bulky', desc: 'Multiple cartons, up to 25kg', icon: '🧺' },
];

const SERVICE_TIERS: Array<{
  id: ServiceTier;
  title: string;
  tag: string;
  time: string;
  badgeColor: string;
}> = [
  {
    id: 'waya_swift',
    title: 'Waya Swift Express',
    tag: 'FASTEST ⚡',
    time: '20 - 35 mins',
    badgeColor: '#0C3823',
  },
  {
    id: 'standard',
    title: 'Standard Dispatch',
    tag: 'POPULAR ⭐',
    time: '45 - 60 mins',
    badgeColor: '#C8522C',
  },
  {
    id: 'eco_saver',
    title: 'Eco Saver',
    tag: 'BUDGET 💰',
    time: 'Same-day Afternoon',
    badgeColor: '#13864D',
  },
];

export const CreateDeliveryScreen: React.FC<CreateDeliveryScreenProps> = ({
  initialCategory = 'packages',
  onOrderCompleted,
  onCancel,
}) => {
  const { themeMode } = useSettingsStore();
  const isDark = themeMode === 'dark';
  const colors = isDark ? Colors.dark : Colors.light;

  const { user, savedAddresses } = useAuthStore();
  const { createOrder } = useDeliveryStore();

  // Form State
  const [pickup, setPickup] = useState<LocationPoint>({
    latitude: 6.5095,
    longitude: 3.3711,
    addressText: '58 Commercial Ave, Sabo Yaba, Lagos',
    landmark: 'Tech Hub Building',
    contactName: user?.fullName || 'Chidi Okafor',
    contactPhone: user?.phoneNumber || '+234 803 456 7890',
  });

  const [destination, setDestination] = useState<LocationPoint>({
    latitude: 6.4474,
    longitude: 3.4731,
    addressText: 'Plot 14, Admiralty Way, Lekki Phase 1, Lagos',
    landmark: 'Opposite Ebeano Supermarket',
    contactName: 'Amaka Eze',
    contactPhone: '+234 802 119 4488',
  });

  const [category, setCategory] = useState<PackageCategory>(initialCategory);
  const [packageSize, setPackageSize] = useState<PackageSize>('medium_box');
  const [description, setDescription] = useState('Ankara fabrics & fashion delivery');
  const [instructions, setInstructions] = useState('Call recipient upon arrival at Lekki Phase 1 gate.');
  const [isFragile, setIsFragile] = useState(false);
  const [serviceTier, setServiceTier] = useState<ServiceTier>('waya_swift');
  const [paymentMethod, setPaymentMethod] = useState<
    'Waya Wallet' | 'Debit Card (Paystack/Flutterwave)' | 'Pay on Pickup'
  >('Waya Wallet');

  const [createdOrder, setCreatedOrder] = useState<DeliveryOrder | null>(null);
  const [isMatching, setIsMatching] = useState(false);
  const [loading, setLoading] = useState(false);

  // Live Fare Calculation
  const priceEstimate = deliveryService.calculateFare(
    pickup,
    destination,
    category,
    packageSize,
    serviceTier
  );

  const handleSelectSavedPickup = (loc: (typeof POPULAR_LOCATIONS)[0]) => {
    setPickup({
      latitude: loc.latitude,
      longitude: loc.longitude,
      addressText: loc.addressText,
      landmark: loc.landmark,
      contactName: user?.fullName || 'Chidi Okafor',
      contactPhone: user?.phoneNumber || '+234 803 456 7890',
    });
  };

  const handleSelectSavedDestination = (loc: (typeof POPULAR_LOCATIONS)[0]) => {
    setDestination({
      latitude: loc.latitude,
      longitude: loc.longitude,
      addressText: loc.addressText,
      landmark: loc.landmark,
      contactName: loc.recipientName || 'Recipient',
      contactPhone: loc.recipientPhone || '+234 800 000 0000',
    });
  };

  const handleConfirmOrder = async () => {
    setLoading(true);
    try {
      const order = await createOrder({
        pickup,
        destination,
        category,
        packageSize,
        packageDescription: description,
        serviceTier,
        paymentMethod,
        deliveryInstructions: instructions,
        isFragile,
      });
      setCreatedOrder(order);
      setIsMatching(true);
      setLoading(false);
    } catch (err) {
      setLoading(false);
    }
  };

  if (isMatching && createdOrder) {
    return (
      <RiderMatchingScreen
        order={createdOrder}
        onMatched={() => {
          setIsMatching(false);
          onOrderCompleted(createdOrder.id);
        }}
        onCancel={() => {
          setIsMatching(false);
          onCancel();
        }}
      />
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      <WayaPatternBackground variant="ankara" opacity={0.06} />

      {/* Screen Header */}
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>Book a Delivery</Text>
        <Pressable onPress={onCancel} style={styles.cancelLink}>
          <Text style={[styles.cancelText, { color: colors.accent }]}>Cancel</Text>
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Step 1: Locations Card */}
        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={styles.cardHeader}>
            <Text style={[styles.stepNumber, { color: colors.primary }]}>STEP 1</Text>
            <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>Pickup & Drop-off</Text>
          </View>

          {/* Pickup Address */}
          <View style={styles.locationGroup}>
            <View style={styles.fieldLabelRow}>
              <View style={[styles.dot, { backgroundColor: colors.primary }]} />
              <Text style={[styles.fieldLabel, { color: colors.textPrimary }]}>Pickup Location</Text>
            </View>
            <TextInput
              style={[styles.input, { backgroundColor: colors.surfaceSubtle, color: colors.textPrimary, borderColor: colors.border }]}
              value={pickup.addressText}
              onChangeText={(txt) => setPickup({ ...pickup, addressText: txt })}
              placeholder="Enter pickup address in Lagos/Abuja"
              placeholderTextColor={colors.textMuted}
            />
            <TextInput
              style={[styles.inputSub, { backgroundColor: colors.surfaceSubtle, color: colors.textPrimary, borderColor: colors.border }]}
              value={pickup.landmark}
              onChangeText={(txt) => setPickup({ ...pickup, landmark: txt })}
              placeholder="Landmark (e.g. Beside Zenith Bank)"
              placeholderTextColor={colors.textMuted}
            />
          </View>

          {/* Destination Address */}
          <View style={[styles.locationGroup, { marginTop: 14 }]}>
            <View style={styles.fieldLabelRow}>
              <View style={[styles.dot, { backgroundColor: colors.accent }]} />
              <Text style={[styles.fieldLabel, { color: colors.textPrimary }]}>Drop-off Location</Text>
            </View>
            <TextInput
              style={[styles.input, { backgroundColor: colors.surfaceSubtle, color: colors.textPrimary, borderColor: colors.border }]}
              value={destination.addressText}
              onChangeText={(txt) => setDestination({ ...destination, addressText: txt })}
              placeholder="Enter recipient address"
              placeholderTextColor={colors.textMuted}
            />
            <View style={styles.contactRow}>
              <TextInput
                style={[styles.inputHalf, { backgroundColor: colors.surfaceSubtle, color: colors.textPrimary, borderColor: colors.border }]}
                value={destination.contactName}
                onChangeText={(txt) => setDestination({ ...destination, contactName: txt })}
                placeholder="Recipient Name"
                placeholderTextColor={colors.textMuted}
              />
              <TextInput
                style={[styles.inputHalf, { backgroundColor: colors.surfaceSubtle, color: colors.textPrimary, borderColor: colors.border }]}
                value={destination.contactPhone}
                onChangeText={(txt) => setDestination({ ...destination, contactPhone: txt })}
                placeholder="Recipient Phone"
                placeholderTextColor={colors.textMuted}
              />
            </View>
          </View>

          {/* Quick-Pick Popular Landmarks */}
          <Text style={[styles.quickPickLabel, { color: colors.textMuted }]}>Quick Pick Nigerian Landmarks:</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.quickPickScroll}>
            {POPULAR_LOCATIONS.map((loc) => (
              <Pressable
                key={loc.id}
                style={[styles.quickPickPill, { backgroundColor: colors.surfaceSubtle, borderColor: colors.border }]}
                onPress={() => handleSelectSavedDestination(loc)}
              >
                <Text style={[styles.quickPickText, { color: colors.primary }]}>{loc.title}</Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        {/* Step 2: Package Details */}
        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={styles.cardHeader}>
            <Text style={[styles.stepNumber, { color: colors.primary }]}>STEP 2</Text>
            <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>Package Details</Text>
          </View>

          {/* Package Size Cards */}
          <Text style={[styles.subLabel, { color: colors.textPrimary }]}>Package Size</Text>
          <View style={styles.sizeGrid}>
            {PACKAGE_SIZES.map((size) => {
              const isSelected = packageSize === size.id;
              return (
                <Pressable
                  key={size.id}
                  style={[
                    styles.sizeCard,
                    {
                      backgroundColor: isSelected ? colors.primaryContainer : colors.surfaceSubtle,
                      borderColor: isSelected ? colors.primary : colors.border,
                    },
                  ]}
                  onPress={() => setPackageSize(size.id)}
                >
                  <Text style={styles.sizeIcon}>{size.icon}</Text>
                  <Text style={[styles.sizeLabel, { color: isSelected ? colors.primary : colors.textPrimary }]}>
                    {size.label}
                  </Text>
                  <Text style={[styles.sizeDesc, { color: colors.textMuted }]}>{size.desc}</Text>
                </Pressable>
              );
            })}
          </View>

          {/* Description & Fragile Toggle */}
          <View style={styles.inputGroup}>
            <Text style={[styles.subLabel, { color: colors.textPrimary }]}>Package Description</Text>
            <TextInput
              style={[styles.input, { backgroundColor: colors.surfaceSubtle, color: colors.textPrimary, borderColor: colors.border }]}
              value={description}
              onChangeText={setDescription}
              placeholder="e.g. Legal documents, clothings, food cooler"
              placeholderTextColor={colors.textMuted}
            />
          </View>

          <View style={[styles.fragileRow, { backgroundColor: colors.surfaceSubtle, borderColor: colors.border }]}>
            <View style={styles.fragileLeft}>
              <ShieldAlert size={20} color={colors.accent} />
              <View>
                <Text style={[styles.fragileTitle, { color: colors.textPrimary }]}>Handle With Care / Fragile</Text>
                <Text style={[styles.fragileSub, { color: colors.textMuted }]}>Glassware, ceramics, delicate electronics</Text>
              </View>
            </View>
            <Switch
              value={isFragile}
              onValueChange={setIsFragile}
              trackColor={{ false: '#D1D5DB', true: colors.accent }}
              thumbColor="#FFFFFF"
            />
          </View>
        </View>

        {/* Step 3: Service Tier Selection */}
        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={styles.cardHeader}>
            <Text style={[styles.stepNumber, { color: colors.primary }]}>STEP 3</Text>
            <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>Select Speed & Service</Text>
          </View>

          <View style={styles.tiersList}>
            {SERVICE_TIERS.map((tier) => {
              const isSelected = serviceTier === tier.id;
              return (
                <Pressable
                  key={tier.id}
                  style={[
                    styles.tierCard,
                    {
                      backgroundColor: isSelected ? colors.primaryContainer : colors.surfaceSubtle,
                      borderColor: isSelected ? colors.primary : colors.border,
                    },
                  ]}
                  onPress={() => setServiceTier(tier.id)}
                >
                  <View style={styles.tierTop}>
                    <View style={styles.tierTitleGroup}>
                      <Text style={[styles.tierTitle, { color: colors.textPrimary }]}>{tier.title}</Text>
                      <View style={[styles.tierTagPill, { backgroundColor: tier.badgeColor }]}>
                        <Text style={styles.tierTagText}>{tier.tag}</Text>
                      </View>
                    </View>
                    <View style={[styles.radioCircle, { borderColor: isSelected ? colors.primary : colors.textMuted }]}>
                      {isSelected && <View style={[styles.radioInner, { backgroundColor: colors.primary }]} />}
                    </View>
                  </View>
                  <View style={styles.tierTimeRow}>
                    <Clock size={14} color={colors.textMuted} />
                    <Text style={[styles.tierTimeText, { color: colors.textSecondary }]}>{tier.time}</Text>
                  </View>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Step 4: Live Visual Fare Summary & Payment */}
        <View style={[styles.fareCard, { backgroundColor: colors.surface, borderColor: colors.primary }]}>
          <View style={styles.fareHeader}>
            <Text style={[styles.fareTitle, { color: colors.textPrimary }]}>Fare Breakdown</Text>
            <Text style={[styles.fareDistance, { color: colors.accent }]}>
              {priceEstimate.distanceKm} km • ~{priceEstimate.estimatedMinutes} mins
            </Text>
          </View>

          <View style={styles.fareRow}>
            <Text style={[styles.fareLabel, { color: colors.textSecondary }]}>Base Fare</Text>
            <Text style={[styles.fareValue, { color: colors.textPrimary }]}>₦{priceEstimate.baseFareNaira}</Text>
          </View>
          <View style={styles.fareRow}>
            <Text style={[styles.fareLabel, { color: colors.textSecondary }]}>Distance Toll ({priceEstimate.distanceKm} km)</Text>
            <Text style={[styles.fareValue, { color: colors.textPrimary }]}>₦{priceEstimate.distanceFareNaira}</Text>
          </View>
          <View style={styles.fareRow}>
            <Text style={[styles.fareLabel, { color: colors.textSecondary }]}>Weight / Size Surcharge</Text>
            <Text style={[styles.fareValue, { color: colors.textPrimary }]}>₦{priceEstimate.weightSurgeNaira}</Text>
          </View>
          <View style={styles.fareRow}>
            <Text style={[styles.fareLabel, { color: colors.textSecondary }]}>Service & Insurance Fee</Text>
            <Text style={[styles.fareValue, { color: colors.textPrimary }]}>₦{priceEstimate.serviceFeeNaira}</Text>
          </View>

          <View style={[styles.totalRow, { borderTopColor: colors.divider }]}>
            <Text style={[styles.totalLabel, { color: colors.textPrimary }]}>Total Amount</Text>
            <Text style={[styles.totalAmount, { color: colors.primary }]}>
              ₦{priceEstimate.totalNaira.toLocaleString('en-NG')}
            </Text>
          </View>

          {/* Payment Method Selector */}
          <View style={styles.paymentSelector}>
            <Text style={[styles.paymentTitle, { color: colors.textMuted }]}>Payment Method:</Text>
            <View style={styles.paymentMethodsRow}>
              {(['Waya Wallet', 'Debit Card (Paystack/Flutterwave)', 'Pay on Pickup'] as const).map((method) => {
                const isSelected = paymentMethod === method;
                return (
                  <Pressable
                    key={method}
                    style={[
                      styles.paymentPill,
                      {
                        backgroundColor: isSelected ? colors.primary : colors.surfaceSubtle,
                        borderColor: isSelected ? colors.primary : colors.border,
                      },
                    ]}
                    onPress={() => setPaymentMethod(method)}
                  >
                    <Text style={[styles.paymentPillText, { color: isSelected ? '#FFFFFF' : colors.textPrimary }]}>
                      {method === 'Waya Wallet' ? '💳 Wallet (₦28.5k)' : method === 'Debit Card (Paystack/Flutterwave)' ? 'Bank Card' : 'Cash'}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          <AfricanPatternDivider variant="kente-bars" height={6} style={{ width: '100%', marginVertical: 14 }} />

          {/* Confirm & Request Rider Button */}
          <WayaPrimaryButton
            title={`Confirm & Request Rider • ₦${priceEstimate.totalNaira.toLocaleString('en-NG')}`}
            onPress={handleConfirmOrder}
            loading={loading}
            variant="primary"
            icon={<ArrowRight size={20} color="#FFFFFF" />}
            iconPosition="right"
            style={{ width: '100%' }}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 10,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '900',
  },
  cancelLink: {
    padding: 6,
  },
  cancelText: {
    fontSize: 14,
    fontWeight: '700',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    gap: 16,
  },
  card: {
    borderRadius: 24,
    borderWidth: 1,
    padding: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 14,
  },
  stepNumber: {
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '800',
  },
  locationGroup: {
    gap: 6,
  },
  fieldLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: '700',
  },
  input: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    fontSize: 14,
  },
  inputSub: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    fontSize: 12,
  },
  contactRow: {
    flexDirection: 'row',
    gap: 8,
  },
  inputHalf: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    fontSize: 12,
  },
  quickPickLabel: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 12,
    marginBottom: 6,
  },
  quickPickScroll: {
    gap: 8,
  },
  quickPickPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    borderWidth: 1,
  },
  quickPickText: {
    fontSize: 12,
    fontWeight: '700',
  },
  subLabel: {
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 8,
  },
  sizeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 14,
  },
  sizeCard: {
    width: '48%',
    padding: 10,
    borderRadius: 14,
    borderWidth: 1.5,
    alignItems: 'flex-start',
  },
  sizeIcon: {
    fontSize: 20,
    marginBottom: 4,
  },
  sizeLabel: {
    fontSize: 12,
    fontWeight: '800',
  },
  sizeDesc: {
    fontSize: 10,
    marginTop: 2,
  },
  inputGroup: {
    marginBottom: 12,
  },
  fragileRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
  },
  fragileLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  fragileTitle: {
    fontSize: 13,
    fontWeight: '700',
  },
  fragileSub: {
    fontSize: 11,
  },
  tiersList: {
    gap: 10,
  },
  tierCard: {
    padding: 12,
    borderRadius: 16,
    borderWidth: 1.5,
  },
  tierTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tierTitleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  tierTitle: {
    fontSize: 14,
    fontWeight: '800',
  },
  tierTagPill: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  tierTagText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '800',
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  tierTimeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 6,
  },
  tierTimeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  fareCard: {
    borderRadius: 24,
    borderWidth: 1.5,
    padding: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
  },
  fareHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  fareTitle: {
    fontSize: 16,
    fontWeight: '900',
  },
  fareDistance: {
    fontSize: 12,
    fontWeight: '700',
  },
  fareRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 3,
  },
  fareLabel: {
    fontSize: 13,
  },
  fareValue: {
    fontSize: 13,
    fontWeight: '600',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    paddingTop: 12,
    marginTop: 8,
  },
  totalLabel: {
    fontSize: 15,
    fontWeight: '800',
  },
  totalAmount: {
    fontSize: 22,
    fontWeight: '900',
  },
  paymentSelector: {
    marginTop: 14,
  },
  paymentTitle: {
    fontSize: 11,
    fontWeight: '700',
    marginBottom: 6,
    textTransform: 'uppercase',
  },
  paymentMethodsRow: {
    flexDirection: 'row',
    gap: 6,
  },
  paymentPill: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
  },
  paymentPillText: {
    fontSize: 11,
    fontWeight: '700',
  },
});
