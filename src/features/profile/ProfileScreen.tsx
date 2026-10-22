import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Pressable,
  Switch,
  SafeAreaView,
  StatusBar,
  Modal,
  TextInput,
  Linking,
  Alert,
} from 'react-native';
import {
  User,
  MapPin,
  Moon,
  Sun,
  Eye,
  Sliders,
  Bell,
  MessageCircle,
  Shield,
  HelpCircle,
  FileText,
  LogOut,
  Wallet,
  Plus,
  CheckCircle,
  ChevronRight,
  Sparkles,
  ExternalLink,
  X,
} from 'lucide-react-native';
import { Colors } from '../../theme/colors';
import { useSettingsStore } from '../../store/useSettingsStore';
import { useAuthStore } from '../../store/useAuthStore';
import { WayaPatternBackground } from '../../components/cultural/WayaPatternBackground';
import { AfricanPatternDivider } from '../../components/cultural/AfricanPatternDivider';
import { WayaPrimaryButton } from '../../components/ui/WayaPrimaryButton';

interface ProfileScreenProps {
  onSignOut: () => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({ onSignOut }) => {
  const {
    themeMode,
    toggleThemeMode,
    isReducedMotion,
    toggleReducedMotion,
    pushNotificationsEnabled,
    setPushNotifications,
    whatsappUpdatesEnabled,
    setWhatsappUpdates,
  } = useSettingsStore();

  const isDark = themeMode === 'dark';
  const colors = isDark ? Colors.dark : Colors.light;

  const { user, isDemoMode, setDemoMode, savedAddresses, addSavedAddress, removeSavedAddress } =
    useAuthStore();

  const [showTopUpModal, setShowTopUpModal] = useState(false);
  const [topUpAmount, setTopUpAmount] = useState('5000');
  const [showAddAddressModal, setShowAddAddressModal] = useState(false);
  const [newAddrTitle, setNewAddrTitle] = useState('');
  const [newAddrText, setNewAddrText] = useState('');
  const [showTermsModal, setShowTermsModal] = useState(false);

  const handleTopUpSubmit = () => {
    const val = parseInt(topUpAmount, 10);
    if (!isNaN(val) && val > 0 && user) {
      useAuthStore.getState().updateUser({
        walletBalanceNaira: user.walletBalanceNaira + val,
      });
      setShowTopUpModal(false);
      Alert.alert('Wallet Top-Up', `₦${val.toLocaleString('en-NG')} successfully credited to your Waya Wallet!`);
    }
  };

  const handleAddAddressSubmit = () => {
    if (newAddrTitle.trim() && newAddrText.trim()) {
      addSavedAddress({
        title: newAddrTitle.trim(),
        addressText: newAddrText.trim(),
        city: 'Lagos',
        latitude: 6.45,
        longitude: 3.42,
      });
      setNewAddrTitle('');
      setNewAddrText('');
      setShowAddAddressModal(false);
    }
  };

  const handleWhatsAppSupport = () => {
    const msg = encodeURIComponent('Hello Waya Support, I need assistance with a delivery.');
    Linking.openURL(`whatsapp://send?phone=234800000WAYA&text=${msg}`).catch(() => {
      Alert.alert('Support Chat', 'Connecting to 24/7 WhatsApp concierge at +234 800 WAYA HELP.');
    });
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      <WayaPatternBackground variant="ankara" opacity={0.06} />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <View style={styles.header}>
          <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>Account & Settings</Text>
        </View>

        {/* User Profile Card */}
        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={styles.userTopRow}>
            <Image
              source={{ uri: user?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200' }}
              style={[styles.avatar, { borderColor: colors.primary }]}
            />
            <View style={styles.userInfo}>
              <View style={styles.nameBadgeRow}>
                <Text style={[styles.userName, { color: colors.textPrimary }]}>
                  {user?.fullName || 'Chidi Okafor'}
                </Text>
                <View style={[styles.verifiedPill, { backgroundColor: colors.primaryContainer }]}>
                  <Text style={[styles.verifiedText, { color: colors.primary }]}>🇳🇬 VERIFIED</Text>
                </View>
              </View>
              <Text style={[styles.userContact, { color: colors.textSecondary }]}>
                {user?.phoneNumber}
              </Text>
              <Text style={[styles.userEmail, { color: colors.textMuted }]}>{user?.email}</Text>
            </View>
          </View>
        </View>

        {/* Waya Wallet Card */}
        <View style={[styles.walletCard, { backgroundColor: colors.primary }]}>
          <View style={styles.walletTop}>
            <View style={styles.walletHeaderLeft}>
              <Wallet size={20} color={colors.gold} />
              <Text style={styles.walletLabel}>WAYA WALLET</Text>
            </View>
            <View style={[styles.cashbackBadge, { backgroundColor: colors.goldContainer }]}>
              <Sparkles size={12} color={colors.goldDark} />
              <Text style={[styles.cashbackText, { color: colors.goldDark }]}>2% Cashback on All Rides</Text>
            </View>
          </View>

          <Text style={styles.walletBalance}>
            ₦{(user?.walletBalanceNaira || 28500).toLocaleString('en-NG')}
          </Text>

          <View style={styles.walletBottom}>
            <Text style={styles.walletSub}>Instant zero-fee checkout for deliveries</Text>
            <Pressable
              style={[styles.topUpBtn, { backgroundColor: colors.gold }]}
              onPress={() => setShowTopUpModal(true)}
            >
              <Plus size={16} color="#151917" strokeWidth={3} />
              <Text style={styles.topUpText}>Top-Up</Text>
            </Pressable>
          </View>
        </View>

        {/* Saved Addresses Manager */}
        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={styles.sectionTitleRow}>
            <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Saved Addresses</Text>
            <Pressable onPress={() => setShowAddAddressModal(true)} style={styles.addAddrLink}>
              <Plus size={16} color={colors.primary} />
              <Text style={[styles.addAddrText, { color: colors.primary }]}>Add New</Text>
            </Pressable>
          </View>

          {savedAddresses.map((addr) => (
            <View key={addr.id} style={[styles.addrItem, { borderBottomColor: colors.divider }]}>
              <View style={styles.addrLeft}>
                <MapPin size={18} color={colors.accent} />
                <View>
                  <Text style={[styles.addrTitle, { color: colors.textPrimary }]}>{addr.title}</Text>
                  <Text style={[styles.addrText, { color: colors.textMuted }]} numberOfLines={1}>
                    {addr.addressText}
                  </Text>
                </View>
              </View>
              <Pressable onPress={() => removeSavedAddress(addr.id)} style={styles.delBtn}>
                <Text style={{ color: colors.textMuted, fontSize: 11 }}>Remove</Text>
              </Pressable>
            </View>
          ))}
        </View>

        {/* App Preferences & Motion Accessibility */}
        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary, marginBottom: 12 }]}>
            Experience & Accessibility
          </Text>

          {/* Dark Mode Switch */}
          <View style={styles.prefRow}>
            <View style={styles.prefLeft}>
              {isDark ? <Moon size={20} color={colors.primary} /> : <Sun size={20} color={colors.goldDark} />}
              <View>
                <Text style={[styles.prefTitle, { color: colors.textPrimary }]}>Dark Mode</Text>
                <Text style={[styles.prefSub, { color: colors.textMuted }]}>
                  Afro-futuristic obsidian night theme
                </Text>
              </View>
            </View>
            <Switch
              value={isDark}
              onValueChange={toggleThemeMode}
              trackColor={{ false: '#D1D5DB', true: colors.primary }}
              thumbColor="#FFFFFF"
            />
          </View>

          {/* Reduced Motion Toggle (A11y requirement) */}
          <View style={[styles.prefRow, { borderTopWidth: 1, borderTopColor: colors.divider, paddingTop: 12 }]}>
            <View style={styles.prefLeft}>
              <Eye size={20} color={colors.accent} />
              <View>
                <Text style={[styles.prefTitle, { color: colors.textPrimary }]}>Reduced Motion</Text>
                <Text style={[styles.prefSub, { color: colors.textMuted }]}>
                  Minimize animations for comfort & battery
                </Text>
              </View>
            </View>
            <Switch
              value={isReducedMotion}
              onValueChange={toggleReducedMotion}
              trackColor={{ false: '#D1D5DB', true: colors.accent }}
              thumbColor="#FFFFFF"
            />
          </View>

          {/* Push Notifications Toggle */}
          <View style={[styles.prefRow, { borderTopWidth: 1, borderTopColor: colors.divider, paddingTop: 12 }]}>
            <View style={styles.prefLeft}>
              <Bell size={20} color={colors.primary} />
              <View>
                <Text style={[styles.prefTitle, { color: colors.textPrimary }]}>Push Notifications</Text>
                <Text style={[styles.prefSub, { color: colors.textMuted }]}>
                  Rider updates & arrival chime
                </Text>
              </View>
            </View>
            <Switch
              value={pushNotificationsEnabled}
              onValueChange={setPushNotifications}
              trackColor={{ false: '#D1D5DB', true: colors.primary }}
              thumbColor="#FFFFFF"
            />
          </View>

          {/* WhatsApp Tracking Updates Toggle */}
          <View style={[styles.prefRow, { borderTopWidth: 1, borderTopColor: colors.divider, paddingTop: 12 }]}>
            <View style={styles.prefLeft}>
              <MessageCircle size={20} color="#128C7E" />
              <View>
                <Text style={[styles.prefTitle, { color: colors.textPrimary }]}>WhatsApp Updates</Text>
                <Text style={[styles.prefSub, { color: colors.textMuted }]}>
                  Instant WhatsApp dispatch status alerts
                </Text>
              </View>
            </View>
            <Switch
              value={whatsappUpdatesEnabled}
              onValueChange={setWhatsappUpdates}
              trackColor={{ false: '#D1D5DB', true: '#128C7E' }}
              thumbColor="#FFFFFF"
            />
          </View>

          {/* Controlled Demo Mode Toggle */}
          <View style={[styles.prefRow, { borderTopWidth: 1, borderTopColor: colors.divider, paddingTop: 12 }]}>
            <View style={styles.prefLeft}>
              <Sliders size={20} color={colors.goldDark} />
              <View>
                <Text style={[styles.prefTitle, { color: colors.textPrimary }]}>Controlled Demo Mode</Text>
                <Text style={[styles.prefSub, { color: colors.textMuted }]}>
                  Use realistic offline simulation vs live API
                </Text>
              </View>
            </View>
            <Switch
              value={isDemoMode}
              onValueChange={setDemoMode}
              trackColor={{ false: '#D1D5DB', true: colors.gold }}
              thumbColor="#FFFFFF"
            />
          </View>
        </View>

        {/* Support, Legal & Sign Out */}
        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Pressable style={styles.menuRow} onPress={handleWhatsAppSupport}>
            <View style={styles.menuRowLeft}>
              <MessageCircle size={18} color="#128C7E" />
              <Text style={[styles.menuTitle, { color: colors.textPrimary }]}>WhatsApp 24/7 Support Concierge</Text>
            </View>
            <ExternalLink size={16} color={colors.textMuted} />
          </Pressable>

          <Pressable
            style={[styles.menuRow, { borderTopWidth: 1, borderTopColor: colors.divider }]}
            onPress={() => setShowTermsModal(true)}
          >
            <View style={styles.menuRowLeft}>
              <FileText size={18} color={colors.textSecondary} />
              <Text style={[styles.menuTitle, { color: colors.textPrimary }]}>Terms & Privacy Policy</Text>
            </View>
            <ChevronRight size={18} color={colors.textMuted} />
          </Pressable>

          <Pressable
            style={[styles.menuRow, { borderTopWidth: 1, borderTopColor: colors.divider }]}
            onPress={onSignOut}
          >
            <View style={styles.menuRowLeft}>
              <LogOut size={18} color={colors.error} />
              <Text style={[styles.menuTitle, { color: colors.error }]}>Sign Out of Waya</Text>
            </View>
            <ChevronRight size={18} color={colors.error} />
          </Pressable>
        </View>

        <AfricanPatternDivider variant="kente-bars" height={6} style={{ width: '100%', marginVertical: 14 }} />

        <Text style={[styles.footerText, { color: colors.textMuted }]}>
          WAYA LOGISTICS AFRICA LTD • NIGERIAN PATENT #NG-2024-LOG
        </Text>
      </ScrollView>

      {/* Wallet Top-Up Modal */}
      <Modal visible={showTopUpModal} transparent animationType="fade" onRequestClose={() => setShowTopUpModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalBox, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Wallet size={36} color={colors.primary} />
            <Text style={[styles.modalTitle, { color: colors.textPrimary }]}>Top-Up Waya Wallet</Text>
            <Text style={[styles.modalSubtitle, { color: colors.textSecondary }]}>
              Add funds via Paystack, Flutterwave or direct Nigerian bank transfer.
            </Text>

            <TextInput
              style={[styles.modalInput, { backgroundColor: colors.surfaceSubtle, borderColor: colors.border, color: colors.textPrimary }]}
              value={topUpAmount}
              onChangeText={setTopUpAmount}
              keyboardType="number-pad"
              placeholder="Amount in Naira (e.g. 5000)"
            />

            <View style={styles.quickAmountsRow}>
              {['2000', '5000', '10000', '25000'].map((amt) => (
                <Pressable
                  key={amt}
                  style={[styles.quickAmtPill, { backgroundColor: colors.surfaceSubtle, borderColor: colors.border }]}
                  onPress={() => setTopUpAmount(amt)}
                >
                  <Text style={[styles.quickAmtText, { color: colors.primary }]}>₦{parseInt(amt).toLocaleString()}</Text>
                </Pressable>
              ))}
            </View>

            <View style={styles.modalButtonsRow}>
              <Pressable onPress={() => setShowTopUpModal(false)} style={[styles.modalCancelBtn, { borderColor: colors.border }]}>
                <Text style={{ color: colors.textSecondary, fontWeight: '700' }}>Cancel</Text>
              </Pressable>
              <Pressable onPress={handleTopUpSubmit} style={[styles.modalConfirmBtn, { backgroundColor: colors.primary }]}>
                <Text style={{ color: '#FFFFFF', fontWeight: '800' }}>Confirm Top-Up</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {/* Add Address Modal */}
      <Modal visible={showAddAddressModal} transparent animationType="fade" onRequestClose={() => setShowAddAddressModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalBox, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <MapPin size={36} color={colors.accent} />
            <Text style={[styles.modalTitle, { color: colors.textPrimary }]}>Add Saved Address</Text>
            <TextInput
              style={[styles.modalInput, { backgroundColor: colors.surfaceSubtle, borderColor: colors.border, color: colors.textPrimary }]}
              value={newAddrTitle}
              onChangeText={setNewAddrTitle}
              placeholder="Title (e.g. Grandma's House, Lekki Branch)"
            />
            <TextInput
              style={[styles.modalInput, { backgroundColor: colors.surfaceSubtle, borderColor: colors.border, color: colors.textPrimary }]}
              value={newAddrText}
              onChangeText={setNewAddrText}
              placeholder="Full address (e.g. 14 Isaac John St, Ikeja)"
            />
            <View style={styles.modalButtonsRow}>
              <Pressable onPress={() => setShowAddAddressModal(false)} style={[styles.modalCancelBtn, { borderColor: colors.border }]}>
                <Text style={{ color: colors.textSecondary, fontWeight: '700' }}>Cancel</Text>
              </Pressable>
              <Pressable onPress={handleAddAddressSubmit} style={[styles.modalConfirmBtn, { backgroundColor: colors.primary }]}>
                <Text style={{ color: '#FFFFFF', fontWeight: '800' }}>Save Address</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {/* Terms & Privacy Modal */}
      <Modal visible={showTermsModal} transparent animationType="slide" onRequestClose={() => setShowTermsModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalBox, { backgroundColor: colors.surface, borderColor: colors.border, maxHeight: '80%' }]}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
              <Text style={[styles.modalTitle, { color: colors.textPrimary }]}>Terms & Privacy</Text>
              <Pressable onPress={() => setShowTermsModal(false)}>
                <X size={20} color={colors.textPrimary} />
              </Pressable>
            </View>
            <ScrollView style={{ marginVertical: 14 }}>
              <Text style={{ color: colors.textSecondary, fontSize: 13, lineHeight: 20 }}>
                Waya Logistics ("Where You At?") provides premier on-demand dispatch, package routing, and rider matching across Nigeria and Africa. Deliveries are protected with end-to-end OTP verification. All payments processed via verified Nigerian fintech rails (Paystack / Flutterwave) and Waya Wallet escrow.
              </Text>
            </ScrollView>
            <WayaPrimaryButton title="Close" onPress={() => setShowTermsModal(false)} variant="primary" style={{ width: '100%' }} />
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
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 40,
    gap: 16,
  },
  header: {
    marginBottom: 4,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '900',
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
  userTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
  },
  userInfo: {
    flex: 1,
  },
  nameBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  userName: {
    fontSize: 18,
    fontWeight: '800',
  },
  verifiedPill: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  verifiedText: {
    fontSize: 9,
    fontWeight: '900',
  },
  userContact: {
    fontSize: 13,
    marginTop: 2,
    fontWeight: '600',
  },
  userEmail: {
    fontSize: 11,
    marginTop: 1,
  },
  walletCard: {
    borderRadius: 24,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.16,
    shadowRadius: 12,
    elevation: 6,
  },
  walletTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  walletHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  walletLabel: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 1,
  },
  cashbackBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  cashbackText: {
    fontSize: 10,
    fontWeight: '800',
  },
  walletBalance: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: '900',
    letterSpacing: 0.5,
    marginVertical: 12,
  },
  walletBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  walletSub: {
    color: '#D4E5DC',
    fontSize: 11,
    maxWidth: 190,
  },
  topUpBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 14,
  },
  topUpText: {
    color: '#151917',
    fontSize: 13,
    fontWeight: '800',
  },
  sectionTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
  },
  addAddrLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  addAddrText: {
    fontSize: 12,
    fontWeight: '700',
  },
  addrItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  addrLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  addrTitle: {
    fontSize: 13,
    fontWeight: '700',
  },
  addrText: {
    fontSize: 11,
    marginTop: 1,
    maxWidth: 220,
  },
  delBtn: {
    padding: 6,
  },
  prefRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  prefLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  prefTitle: {
    fontSize: 14,
    fontWeight: '700',
  },
  prefSub: {
    fontSize: 11,
    marginTop: 1,
  },
  menuRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
  },
  menuRowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  menuTitle: {
    fontSize: 14,
    fontWeight: '700',
  },
  footerText: {
    fontSize: 10,
    fontWeight: '700',
    textAlign: 'center',
    letterSpacing: 0.8,
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
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '900',
    marginTop: 10,
  },
  modalSubtitle: {
    fontSize: 13,
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 16,
  },
  modalInput: {
    width: '100%',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    fontSize: 14,
    marginBottom: 10,
  },
  quickAmountsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  quickAmtPill: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 1,
  },
  quickAmtText: {
    fontSize: 11,
    fontWeight: '700',
  },
  modalButtonsRow: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  modalCancelBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: 'center',
  },
  modalConfirmBtn: {
    flex: 1.5,
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: 'center',
  },
});
