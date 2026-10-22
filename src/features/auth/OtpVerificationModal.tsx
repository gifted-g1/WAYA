import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TextInput,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import { ShieldCheck, X, RefreshCw } from 'lucide-react-native';
import { Colors } from '../../theme/colors';
import { useSettingsStore } from '../../store/useSettingsStore';
import { WayaPrimaryButton } from '../../components/ui/WayaPrimaryButton';

interface OtpVerificationModalProps {
  visible: boolean;
  phoneNumber: string;
  onVerify: (otp: string) => Promise<void>;
  onClose: () => void;
}

export const OtpVerificationModal: React.FC<OtpVerificationModalProps> = ({
  visible,
  phoneNumber,
  onVerify,
  onClose,
}) => {
  const { themeMode } = useSettingsStore();
  const isDark = themeMode === 'dark';
  const colors = isDark ? Colors.dark : Colors.light;

  const [otp, setOtp] = useState(['', '', '', '']);
  const [timer, setTimer] = useState(45);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!visible) return;
    setOtp(['', '', '', '']);
    setTimer(45);
    setError(null);

    const interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, [visible]);

  const handleDigitChange = (val: string, index: number) => {
    const updated = [...otp];
    updated[index] = val.slice(-1);
    setOtp(updated);
    setError(null);
  };

  const handleConfirm = async () => {
    const fullOtp = otp.join('');
    if (fullOtp.length < 4) {
      setError('Please enter all 4 digits of the OTP code sent to your phone.');
      return;
    }

    setLoading(true);
    try {
      await onVerify(fullOtp);
      setLoading(false);
      onClose();
    } catch (err: any) {
      setLoading(false);
      setError(err?.message || 'Invalid OTP code. Please try again or use demo code 1234.');
    }
  };

  const fillDemoCode = () => {
    setOtp(['1', '2', '3', '4']);
    setError(null);
  };

  if (!visible) return null;

  return (
    <Modal transparent visible={visible} animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <Pressable style={[StyleSheet.absoluteFill, { backgroundColor: colors.backdrop }]} onPress={onClose} />

        <View style={[styles.modalCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Pressable onPress={onClose} style={styles.closeBtn}>
            <X size={20} color={colors.textSecondary} />
          </Pressable>

          <View style={[styles.iconRing, { backgroundColor: colors.primaryContainer }]}>
            <ShieldCheck size={36} color={colors.primary} />
          </View>

          <Text style={[styles.title, { color: colors.textPrimary }]}>Verify Phone Number</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Enter the 4-digit verification code sent via SMS to{' '}
            <Text style={{ fontWeight: '700', color: colors.textPrimary }}>{phoneNumber}</Text>
          </Text>

          {/* 4 Digit Boxes */}
          <View style={styles.pinRow}>
            {otp.map((digit, idx) => (
              <TextInput
                key={idx}
                style={[
                  styles.pinBox,
                  {
                    backgroundColor: colors.surfaceSubtle,
                    borderColor: digit ? colors.primary : colors.border,
                    color: colors.textPrimary,
                  },
                ]}
                keyboardType="number-pad"
                maxLength={1}
                value={digit}
                onChangeText={(val) => handleDigitChange(val, idx)}
              />
            ))}
          </View>

          {error && <Text style={[styles.errorText, { color: colors.error }]}>{error}</Text>}

          {/* Quick Demo Fill Helper */}
          <Pressable onPress={fillDemoCode} style={styles.demoFillBtn}>
            <Text style={[styles.demoFillText, { color: colors.accent }]}>
              ⚡ Tap to auto-fill demo OTP (1234)
            </Text>
          </Pressable>

          <WayaPrimaryButton
            title="Verify & Continue"
            onPress={handleConfirm}
            loading={loading}
            variant="primary"
            style={{ width: '100%', marginTop: 12 }}
          />

          {/* Resend Timer */}
          <View style={styles.resendRow}>
            {timer > 0 ? (
              <Text style={[styles.timerText, { color: colors.textMuted }]}>
                Resend code in {timer}s
              </Text>
            ) : (
              <Pressable onPress={() => setTimer(45)} style={styles.resendBtn}>
                <RefreshCw size={14} color={colors.primary} />
                <Text style={[styles.resendText, { color: colors.primary }]}>Resend OTP SMS</Text>
              </Pressable>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  modalCard: {
    width: '100%',
    maxWidth: 380,
    borderRadius: 28,
    borderWidth: 1,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.16,
    shadowRadius: 20,
    elevation: 10,
    position: 'relative',
  },
  closeBtn: {
    position: 'absolute',
    top: 18,
    right: 18,
    padding: 6,
  },
  iconRing: {
    width: 68,
    height: 68,
    borderRadius: 34,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 6,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 13,
    lineHeight: 19,
    textAlign: 'center',
    marginBottom: 20,
  },
  pinRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 14,
  },
  pinBox: {
    width: 52,
    height: 60,
    borderRadius: 14,
    borderWidth: 2,
    fontSize: 24,
    fontWeight: '800',
    textAlign: 'center',
  },
  errorText: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 8,
  },
  demoFillBtn: {
    paddingVertical: 6,
    marginBottom: 4,
  },
  demoFillText: {
    fontSize: 12,
    fontWeight: '700',
  },
  resendRow: {
    marginTop: 16,
    alignItems: 'center',
  },
  timerText: {
    fontSize: 12,
  },
  resendBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  resendText: {
    fontSize: 13,
    fontWeight: '700',
  },
});
