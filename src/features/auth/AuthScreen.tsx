import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  ScrollView,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import {
  Phone,
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Sparkles,
  ShieldCheck,
  ArrowRight,
} from 'lucide-react-native';
import { Colors } from '../../theme/colors';
import { useSettingsStore } from '../../store/useSettingsStore';
import { useAuthStore } from '../../store/useAuthStore';
import { WayaPatternBackground } from '../../components/cultural/WayaPatternBackground';
import { AfricanPatternDivider } from '../../components/cultural/AfricanPatternDivider';
import { WayaPrimaryButton } from '../../components/ui/WayaPrimaryButton';
import { OtpVerificationModal } from './OtpVerificationModal';

interface AuthScreenProps {
  onSuccess: () => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ onSuccess }) => {
  const { themeMode } = useSettingsStore();
  const isDark = themeMode === 'dark';
  const colors = isDark ? Colors.dark : Colors.light;

  const { login, register, verifyOtp, quickDemoLogin, isLoading, error } = useAuthStore();

  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [phoneNumber, setPhoneNumber] = useState('08034567890');
  const [fullName, setFullName] = useState('Chidi Okafor');
  const [email, setEmail] = useState('chidi.okafor@lagosconnect.ng');
  const [password, setPassword] = useState('waya2025!');
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  // OTP Modal State
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [pendingPhone, setPendingPhone] = useState('');

  const formatNigerianPhone = (phone: string) => {
    let cleaned = phone.replace(/\D/g, '');
    if (cleaned.startsWith('0')) {
      cleaned = '234' + cleaned.substring(1);
    } else if (!cleaned.startsWith('234')) {
      cleaned = '234' + cleaned;
    }
    return '+' + cleaned;
  };

  const handleSubmit = async () => {
    setLocalError(null);
    if (!phoneNumber || phoneNumber.length < 10) {
      setLocalError('Please enter a valid Nigerian phone number (e.g. 0803 123 4567)');
      return;
    }

    const formatted = formatNigerianPhone(phoneNumber);

    if (mode === 'signup') {
      if (!fullName.trim()) {
        setLocalError('Please enter your full name');
        return;
      }
      try {
        const requiresOtp = await register({
          fullName,
          phoneNumber: formatted,
          email,
          password,
        });
        if (requiresOtp) {
          setPendingPhone(formatted);
          setShowOtpModal(true);
        } else {
          onSuccess();
        }
      } catch (err: any) {
        setLocalError(err.message || 'Registration failed');
      }
    } else {
      // Sign in
      try {
        await login({ phoneNumber: formatted, password });
        onSuccess();
      } catch (err: any) {
        setLocalError(err.message || 'Sign in failed');
      }
    }
  };

  const handleVerifyOtp = async (code: string) => {
    await verifyOtp({
      phoneNumber: pendingPhone || formatNigerianPhone(phoneNumber),
      otpCode: code,
    });
    onSuccess();
  };

  const handleDemoLogin = () => {
    quickDemoLogin();
    onSuccess();
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      <WayaPatternBackground variant="adire" opacity={0.08} />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Brand Header */}
        <View style={styles.header}>
          <Text style={[styles.brandTitle, { color: colors.primary }]}>
            WAYA<Text style={{ color: colors.accent }}>.</Text>
          </Text>
          <Text style={[styles.brandTagline, { color: colors.textSecondary }]}>
            Where You At? • Rapid Logistics Across Africa
          </Text>

          <AfricanPatternDivider variant="kente-bars" height={6} style={{ width: 140, marginTop: 12 }} />
        </View>

        {/* Auth Mode Tabs (Sign In vs Sign Up) */}
        <View style={[styles.tabBar, { backgroundColor: colors.surfaceSubtle, borderColor: colors.border }]}>
          <Pressable
            style={[
              styles.tabBtn,
              mode === 'signin' && [styles.activeTabBtn, { backgroundColor: colors.surface }],
            ]}
            onPress={() => setMode('signin')}
          >
            <Text
              style={[
                styles.tabText,
                { color: mode === 'signin' ? colors.primary : colors.textMuted },
                mode === 'signin' && styles.activeTabText,
              ]}
            >
              Sign In
            </Text>
          </Pressable>

          <Pressable
            style={[
              styles.tabBtn,
              mode === 'signup' && [styles.activeTabBtn, { backgroundColor: colors.surface }],
            ]}
            onPress={() => setMode('signup')}
          >
            <Text
              style={[
                styles.tabText,
                { color: mode === 'signup' ? colors.primary : colors.textMuted },
                mode === 'signup' && styles.activeTabText,
              ]}
            >
              Create Account
            </Text>
          </Pressable>
        </View>

        {/* Input Fields Card */}
        <View style={[styles.formCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          {mode === 'signup' && (
            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: colors.textPrimary }]}>Full Name</Text>
              <View style={[styles.inputRow, { backgroundColor: colors.surfaceSubtle, borderColor: colors.border }]}>
                <User size={18} color={colors.textMuted} />
                <TextInput
                  style={[styles.input, { color: colors.textPrimary }]}
                  placeholder="e.g. Chidi Okafor"
                  placeholderTextColor={colors.textMuted}
                  value={fullName}
                  onChangeText={setFullName}
                />
              </View>
            </View>
          )}

          {/* Phone Number Input with Nigerian Country Code */}
          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: colors.textPrimary }]}>Nigerian Mobile Number</Text>
            <View style={[styles.inputRow, { backgroundColor: colors.surfaceSubtle, borderColor: colors.border }]}>
              <View style={styles.countryFlagPill}>
                <Text style={styles.flagText}>🇳🇬 +234</Text>
              </View>
              <TextInput
                style={[styles.input, { color: colors.textPrimary }]}
                placeholder="803 123 4567"
                placeholderTextColor={colors.textMuted}
                keyboardType="phone-pad"
                value={phoneNumber}
                onChangeText={setPhoneNumber}
              />
            </View>
          </View>

          {mode === 'signup' && (
            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: colors.textPrimary }]}>Email Address</Text>
              <View style={[styles.inputRow, { backgroundColor: colors.surfaceSubtle, borderColor: colors.border }]}>
                <Mail size={18} color={colors.textMuted} />
                <TextInput
                  style={[styles.input, { color: colors.textPrimary }]}
                  placeholder="name@domain.com"
                  placeholderTextColor={colors.textMuted}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={email}
                  onChangeText={setEmail}
                />
              </View>
            </View>
          )}

          {/* Password */}
          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: colors.textPrimary }]}>Password</Text>
            <View style={[styles.inputRow, { backgroundColor: colors.surfaceSubtle, borderColor: colors.border }]}>
              <Lock size={18} color={colors.textMuted} />
              <TextInput
                style={[styles.input, { color: colors.textPrimary }]}
                placeholder="••••••••"
                placeholderTextColor={colors.textMuted}
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
              />
              <Pressable onPress={() => setShowPassword(!showPassword)} style={styles.eyeBtn}>
                {showPassword ? (
                  <EyeOff size={18} color={colors.textMuted} />
                ) : (
                  <Eye size={18} color={colors.textMuted} />
                )}
              </Pressable>
            </View>
          </View>

          {(localError || error) && (
            <Text style={[styles.errorMsg, { color: colors.error }]}>
              {localError || error}
            </Text>
          )}

          {/* Submit Action Button */}
          <WayaPrimaryButton
            title={mode === 'signin' ? 'Sign In to Waya' : 'Register & Verify Phone'}
            onPress={handleSubmit}
            loading={isLoading}
            variant="primary"
            icon={<ArrowRight size={18} color="#FFFFFF" />}
            iconPosition="right"
            style={{ width: '100%', marginTop: 8 }}
          />
        </View>

        {/* Quick Demo Access Card */}
        <View style={[styles.demoCard, { backgroundColor: colors.goldContainer, borderColor: colors.gold }]}>
          <View style={styles.demoHeader}>
            <Sparkles size={18} color={colors.goldDark} />
            <Text style={[styles.demoTitle, { color: colors.goldDark }]}>ONE-TAP DEMO ACCESS</Text>
          </View>
          <Text style={[styles.demoDesc, { color: colors.textSecondary }]}>
            Jump straight into the Waya mobile experience pre-authenticated as verified Lagos customer <Text style={{ fontWeight: '700' }}>Chidi Okafor</Text>.
          </Text>
          <WayaPrimaryButton
            title="Instant Demo Login (Chidi)"
            onPress={handleDemoLogin}
            variant="gold"
            size="md"
            style={{ marginTop: 10 }}
          />
        </View>
      </ScrollView>

      {/* OTP Verification Modal */}
      <OtpVerificationModal
        visible={showOtpModal}
        phoneNumber={pendingPhone || phoneNumber}
        onVerify={handleVerifyOtp}
        onClose={() => setShowOtpModal(false)}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  brandTitle: {
    fontSize: 34,
    fontWeight: '900',
    letterSpacing: 3,
  },
  brandTagline: {
    fontSize: 13,
    marginTop: 4,
    fontWeight: '500',
    textAlign: 'center',
  },
  tabBar: {
    flexDirection: 'row',
    padding: 4,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 18,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeTabBtn: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
  },
  activeTabText: {
    fontWeight: '800',
  },
  formCard: {
    padding: 20,
    borderRadius: 24,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 6,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    borderRadius: 14,
    borderWidth: 1,
    height: 50,
  },
  countryFlagPill: {
    paddingRight: 10,
    borderRightWidth: 1,
    borderRightColor: '#D5CDC0',
    marginRight: 10,
  },
  flagText: {
    fontSize: 14,
    fontWeight: '700',
  },
  input: {
    flex: 1,
    fontSize: 15,
    fontWeight: '500',
  },
  eyeBtn: {
    padding: 6,
  },
  errorMsg: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 12,
  },
  demoCard: {
    padding: 18,
    borderRadius: 20,
    borderWidth: 1.5,
  },
  demoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  demoTitle: {
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 1,
  },
  demoDesc: {
    fontSize: 13,
    lineHeight: 18,
  },
});
