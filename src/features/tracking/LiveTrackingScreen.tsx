import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Pressable,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Linking,
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import {
  Phone,
  MessageCircle,
  ShieldCheck,
  Clock,
  MapPin,
  ChevronRight,
  Package,
  RotateCcw,
  CheckCircle,
  Play,
  FastForward,
  Copy,
  AlertCircle,
  Check,
} from 'lucide-react-native';
import { Colors } from '../../theme/colors';
import { useSettingsStore } from '../../store/useSettingsStore';
import { useDeliveryStore } from '../../store/useDeliveryStore';
import { WayaPatternBackground } from '../../components/cultural/WayaPatternBackground';
import { AfricanPatternDivider } from '../../components/cultural/AfricanPatternDivider';
import { DeliveryStatusTimeline } from '../../components/ui/DeliveryStatusTimeline';
import { InteractiveMap } from '../../components/map/InteractiveMap';
import { WayaPrimaryButton } from '../../components/ui/WayaPrimaryButton';

interface LiveTrackingScreenProps {
  orderId?: string;
  onBackToHome?: () => void;
}

export const LiveTrackingScreen: React.FC<LiveTrackingScreenProps> = ({
  orderId,
  onBackToHome,
}) => {
  const { themeMode } = useSettingsStore();
  const isDark = themeMode === 'dark';
  const colors = isDark ? Colors.dark : Colors.light;

  const {
    getActiveDelivery,
    trackingRouteIndex,
    advanceTrackingSimulation,
    verifyDeliveryOtp,
    cancelOrder,
  } = useDeliveryStore();

  const activeOrder = getActiveDelivery();

  const [copiedOtp, setCopiedOtp] = useState(false);
  const [showOtpConfirmModal, setShowOtpConfirmModal] = useState(false);
  const [enteredOtp, setEnteredOtp] = useState('');
  const [otpVerifyError, setOtpVerifyError] = useState<string | null>(null);
  const [otpVerifySuccess, setOtpVerifySuccess] = useState(false);

  if (!activeOrder) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.emptyContainer}>
          <Package size={56} color={colors.textMuted} />
          <Text style={[styles.emptyTitle, { color: colors.textPrimary }]}>No Order Selected</Text>
          <Text style={[styles.emptySub, { color: colors.textSecondary }]}>
            Select an order from history or book a new delivery.
          </Text>
          {onBackToHome && (
            <WayaPrimaryButton
              title="Return to Home"
              onPress={onBackToHome}
              style={{ marginTop: 16 }}
            />
          )}
        </View>
      </SafeAreaView>
    );
  }

  const rider = activeOrder.rider;

  const handleCallRider = () => {
    if (rider?.phone) {
      Linking.openURL(`tel:${rider.phone}`).catch(() => {
        Alert.alert('Call Rider', `Calling ${rider.name} at ${rider.phone}`);
      });
    }
  };

  const handleWhatsAppRider = () => {
    if (rider?.phone) {
      const cleanPhone = rider.phone.replace(/\D/g, '');
      const msg = encodeURIComponent(
        `Hello ${rider.name}, I am tracking order ${activeOrder.trackingNumber} on Waya. Where you at?`
      );
      Linking.openURL(`whatsapp://send?phone=${cleanPhone}&text=${msg}`).catch(() => {
        Alert.alert(
          'WhatsApp Chat',
          `Opening WhatsApp conversation with ${rider.name} (${rider.phone}).`
        );
      });
    }
  };

  const handleCopyOtp = () => {
    setCopiedOtp(true);
    setTimeout(() => setCopiedOtp(false), 2000);
  };

  const handleVerifyOtpSubmit = async () => {
    setOtpVerifyError(null);
    const success = await verifyDeliveryOtp(activeOrder.id, enteredOtp);
    if (success) {
      setOtpVerifySuccess(true);
      setTimeout(() => {
        setShowOtpConfirmModal(false);
        setOtpVerifySuccess(false);
      }, 1500);
    } else {
      setOtpVerifyError('Invalid OTP code. Please enter the 4-digit code shown on screen.');
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

      {/* Live Map Header Stage */}
      <View style={styles.mapStage}>
        <InteractiveMap
          height={320}
          riderLocation={rider?.currentLocation}
          routeIndex={trackingRouteIndex}
        />

        {/* Floating ETA Pill */}
        <View style={[styles.etaFloatingCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Clock size={18} color={colors.accent} />
          <View>
            <Text style={[styles.etaMainText, { color: colors.textPrimary }]}>
              {activeOrder.status === 'DELIVERED'
                ? 'Package Delivered 🎉'
                : `Arriving in ${rider?.estimatedArrivalMinutes || 12} mins`}
            </Text>
            <Text style={[styles.etaSubText, { color: colors.textMuted }]}>
              {activeOrder.status === 'DELIVERED'
                ? 'Handshake completed'
                : `${rider?.distanceKm || 3.2} km remaining • Third Mainland Corridor`}
            </Text>
          </View>
        </View>
      </View>

      {/* Bottom Tracking Details Scroll */}
      <ScrollView contentContainerStyle={styles.bottomSheetContent} showsVerticalScrollIndicator={false}>
        {/* Status Timeline Stepper */}
        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={styles.cardTopRow}>
            <Text style={[styles.trackingNumberText, { color: colors.textPrimary }]}>
              {activeOrder.trackingNumber}
            </Text>
            <View style={[styles.tierPill, { backgroundColor: colors.primaryContainer }]}>
              <Text style={[styles.tierText, { color: colors.primary }]}>WAYA SWIFT ⚡</Text>
            </View>
          </View>

          <DeliveryStatusTimeline status={activeOrder.status} />
        </View>

        {/* Secure OTP Handshake Box */}
        <View style={[styles.otpCard, { backgroundColor: colors.goldContainer, borderColor: colors.gold }]}>
          <View style={styles.otpLeft}>
            <ShieldCheck size={28} color={colors.goldDark} />
            <View>
              <Text style={[styles.otpCardTitle, { color: colors.goldDark }]}>DELIVERY CONFIRMATION OTP</Text>
              <Text style={[styles.otpCardCode, { color: colors.textPrimary }]}>
                {activeOrder.deliveryOtp}
              </Text>
              <Text style={[styles.otpCardInstruction, { color: colors.textSecondary }]}>
                Share with rider only when you physically receive your package.
              </Text>
            </View>
          </View>

          <Pressable onPress={handleCopyOtp} style={[styles.copyBtn, { backgroundColor: colors.surface }]}>
            {copiedOtp ? (
              <Check size={16} color={colors.success} />
            ) : (
              <Copy size={16} color={colors.textPrimary} />
            )}
            <Text style={[styles.copyBtnText, { color: colors.textPrimary }]}>
              {copiedOtp ? 'Copied' : 'Copy'}
            </Text>
          </Pressable>
        </View>

        {/* Rider Profile Card */}
        {rider && (
          <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <View style={styles.riderRow}>
              <Image source={{ uri: rider.avatarUrl }} style={[styles.riderAvatar, { borderColor: colors.primary }]} />
              <View style={styles.riderMainInfo}>
                <View style={styles.riderNameRow}>
                  <Text style={[styles.riderName, { color: colors.textPrimary }]}>{rider.name}</Text>
                  <View style={[styles.ratingPill, { backgroundColor: colors.goldContainer }]}>
                    <Text style={[styles.ratingText, { color: colors.goldDark }]}>★ {rider.rating}</Text>
                  </View>
                </View>
                <Text style={[styles.riderVehicle, { color: colors.textSecondary }]}>
                  {rider.vehicleType} • <Text style={{ fontWeight: '800' }}>{rider.plateNumber}</Text>
                </Text>
                <Text style={[styles.riderStats, { color: colors.textMuted }]}>
                  {rider.totalTrips.toLocaleString()} trips completed
                </Text>
              </View>
            </View>

            {/* Quick Contact Buttons: Call & WhatsApp */}
            <View style={styles.contactButtonsRow}>
              <Pressable
                style={[styles.contactBtn, { backgroundColor: colors.primaryContainer }]}
                onPress={handleCallRider}
              >
                <Phone size={18} color={colors.primary} />
                <Text style={[styles.contactBtnText, { color: colors.primary }]}>Direct Call</Text>
              </Pressable>

              <Pressable
                style={[styles.contactBtn, { backgroundColor: '#E7F7ED' }]}
                onPress={handleWhatsAppRider}
              >
                <MessageCircle size={18} color="#128C7E" />
                <Text style={[styles.contactBtnText, { color: '#128C7E' }]}>WhatsApp Chat</Text>
              </Pressable>
            </View>
          </View>
        )}

        {/* Live Simulation Control Panel for Interactive Testing */}
        <View style={[styles.simCard, { backgroundColor: colors.surfaceSubtle, borderColor: colors.border }]}>
          <Text style={[styles.simTitle, { color: colors.textPrimary }]}>
            🎮 LIVE SIMULATION CONTROLS
          </Text>
          <Text style={[styles.simDesc, { color: colors.textMuted }]}>
            Fast-forward GPS telemetry and test real-time state transitions on Nigerian urban routes.
          </Text>

          <View style={styles.simActionsRow}>
            <Pressable
              style={[styles.simBtn, { backgroundColor: colors.primary }]}
              onPress={advanceTrackingSimulation}
            >
              <FastForward size={16} color="#FFFFFF" />
              <Text style={styles.simBtnText}>Step Rider GPS</Text>
            </Pressable>

            <Pressable
              style={[styles.simBtn, { backgroundColor: colors.accent }]}
              onPress={() => setShowOtpConfirmModal(true)}
            >
              <CheckCircle size={16} color="#FFFFFF" />
              <Text style={styles.simBtnText}>Verify OTP & Complete</Text>
            </Pressable>
          </View>
        </View>

        {/* Order Details & Summary */}
        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.orderHeaderTitle, { color: colors.textPrimary }]}>Delivery Route</Text>

          <View style={styles.addressNode}>
            <MapPin size={16} color={colors.primary} />
            <View style={styles.addressNodeText}>
              <Text style={[styles.addressNodeLabel, { color: colors.textMuted }]}>PICKUP</Text>
              <Text style={[styles.addressNodeVal, { color: colors.textPrimary }]}>
                {activeOrder.pickup.addressText}
              </Text>
              {activeOrder.pickup.landmark && (
                <Text style={[styles.addressNodeSub, { color: colors.textSecondary }]}>
                  {activeOrder.pickup.landmark}
                </Text>
              )}
            </View>
          </View>

          <View style={styles.addressNode}>
            <MapPin size={16} color={colors.accent} />
            <View style={styles.addressNodeText}>
              <Text style={[styles.addressNodeLabel, { color: colors.textMuted }]}>DROP-OFF</Text>
              <Text style={[styles.addressNodeVal, { color: colors.textPrimary }]}>
                {activeOrder.destination.addressText}
              </Text>
              <Text style={[styles.addressNodeSub, { color: colors.textSecondary }]}>
                Recipient: {activeOrder.destination.contactName} ({activeOrder.destination.contactPhone})
              </Text>
            </View>
          </View>

          <AfricanPatternDivider variant="kente-bars" height={6} style={{ width: '100%', marginVertical: 12 }} />

          <View style={styles.receiptRow}>
            <Text style={[styles.receiptLabel, { color: colors.textSecondary }]}>Payment Method</Text>
            <Text style={[styles.receiptVal, { color: colors.textPrimary }]}>{activeOrder.paymentMethod}</Text>
          </View>
          <View style={styles.receiptRow}>
            <Text style={[styles.receiptLabel, { color: colors.textSecondary }]}>Total Fare</Text>
            <Text style={[styles.receiptValTotal, { color: colors.primary }]}>
              ₦{activeOrder.price.totalNaira.toLocaleString('en-NG')}
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* OTP Delivery Confirmation Modal */}
      <Modal visible={showOtpConfirmModal} transparent animationType="fade" onRequestClose={() => setShowOtpConfirmModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalBox, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <ShieldCheck size={40} color={colors.primary} />
            <Text style={[styles.modalTitle, { color: colors.textPrimary }]}>Confirm Delivery Delivery OTP</Text>
            <Text style={[styles.modalSubtitle, { color: colors.textSecondary }]}>
              Rider will enter the recipient's OTP code to verify and release the parcel.
            </Text>

            <TextInput
              style={[
                styles.modalOtpInput,
                {
                  backgroundColor: colors.surfaceSubtle,
                  borderColor: colors.primary,
                  color: colors.textPrimary,
                },
              ]}
              value={enteredOtp}
              onChangeText={setEnteredOtp}
              placeholder="e.g. WY-7842"
              placeholderTextColor={colors.textMuted}
              autoCapitalize="characters"
            />

            {otpVerifyError && <Text style={[styles.modalError, { color: colors.error }]}>{otpVerifyError}</Text>}
            {otpVerifySuccess && (
              <Text style={[styles.modalSuccess, { color: colors.success }]}>
                Delivery confirmed successfully! 🎉
              </Text>
            )}

            <Pressable
              onPress={() => setEnteredOtp(activeOrder.deliveryOtp)}
              style={styles.modalQuickFill}
            >
              <Text style={[styles.modalQuickFillText, { color: colors.accent }]}>
                ⚡ Auto-fill customer OTP ({activeOrder.deliveryOtp})
              </Text>
            </Pressable>

            <View style={styles.modalButtonsRow}>
              <Pressable
                onPress={() => setShowOtpConfirmModal(false)}
                style={[styles.modalCancelBtn, { borderColor: colors.border }]}
              >
                <Text style={{ color: colors.textSecondary, fontWeight: '700' }}>Cancel</Text>
              </Pressable>

              <Pressable
                onPress={handleVerifyOtpSubmit}
                style={[styles.modalConfirmBtn, { backgroundColor: colors.primary }]}
              >
                <Text style={{ color: '#FFFFFF', fontWeight: '800' }}>Verify Delivery</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '800',
    marginTop: 16,
  },
  emptySub: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 6,
  },
  mapStage: {
    position: 'relative',
  },
  etaFloatingCard: {
    position: 'absolute',
    bottom: 14,
    left: 20,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 20,
    borderWidth: 1,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.14,
    shadowRadius: 10,
    elevation: 6,
  },
  etaMainText: {
    fontSize: 15,
    fontWeight: '800',
  },
  etaSubText: {
    fontSize: 11,
    marginTop: 1,
  },
  bottomSheetContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 40,
    gap: 14,
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
  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  trackingNumberText: {
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  tierPill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  tierText: {
    fontSize: 10,
    fontWeight: '800',
  },
  otpCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 22,
    borderWidth: 1.5,
  },
  otpLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  otpCardTitle: {
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.8,
  },
  otpCardCode: {
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: 2,
    marginVertical: 2,
  },
  otpCardInstruction: {
    fontSize: 10,
    maxWidth: 200,
  },
  copyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 12,
  },
  copyBtnText: {
    fontSize: 12,
    fontWeight: '700',
  },
  riderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  riderAvatar: {
    width: 54,
    height: 54,
    borderRadius: 27,
    borderWidth: 2,
  },
  riderMainInfo: {
    flex: 1,
  },
  riderNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  riderName: {
    fontSize: 16,
    fontWeight: '800',
  },
  ratingPill: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  ratingText: {
    fontSize: 11,
    fontWeight: '800',
  },
  riderVehicle: {
    fontSize: 13,
    marginTop: 2,
  },
  riderStats: {
    fontSize: 11,
    marginTop: 2,
  },
  contactButtonsRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#EEE7DC',
  },
  contactBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 14,
    gap: 8,
  },
  contactBtnText: {
    fontSize: 13,
    fontWeight: '700',
  },
  simCard: {
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
  },
  simTitle: {
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 0.8,
  },
  simDesc: {
    fontSize: 11,
    marginTop: 2,
    marginBottom: 10,
  },
  simActionsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  simBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 12,
    gap: 6,
  },
  simBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },
  orderHeaderTitle: {
    fontSize: 15,
    fontWeight: '800',
    marginBottom: 12,
  },
  addressNode: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    marginBottom: 10,
  },
  addressNodeText: {
    flex: 1,
  },
  addressNodeLabel: {
    fontSize: 10,
    fontWeight: '800',
  },
  addressNodeVal: {
    fontSize: 13,
    fontWeight: '600',
    marginTop: 1,
  },
  addressNodeSub: {
    fontSize: 11,
    marginTop: 1,
  },
  receiptRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 4,
  },
  receiptLabel: {
    fontSize: 13,
  },
  receiptVal: {
    fontSize: 13,
    fontWeight: '600',
  },
  receiptValTotal: {
    fontSize: 16,
    fontWeight: '900',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.65)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  modalBox: {
    width: '100%',
    padding: 24,
    borderRadius: 28,
    borderWidth: 1,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 14,
    elevation: 8,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '900',
    marginTop: 12,
    textAlign: 'center',
  },
  modalSubtitle: {
    fontSize: 13,
    textAlign: 'center',
    marginTop: 6,
    marginBottom: 16,
  },
  modalOtpInput: {
    width: '80%',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 14,
    borderWidth: 2,
    fontSize: 22,
    fontWeight: '900',
    textAlign: 'center',
    letterSpacing: 3,
  },
  modalError: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 8,
    textAlign: 'center',
  },
  modalSuccess: {
    fontSize: 13,
    fontWeight: '700',
    marginTop: 8,
    textAlign: 'center',
  },
  modalQuickFill: {
    paddingVertical: 8,
    marginTop: 6,
  },
  modalQuickFillText: {
    fontSize: 12,
    fontWeight: '700',
  },
  modalButtonsRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
    width: '100%',
  },
  modalCancelBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalConfirmBtn: {
    flex: 1.5,
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
