import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Pressable,
  Animated,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { ArrowRight, Check, Compass, ShieldCheck, Zap } from 'lucide-react-native';
import { Colors } from '../../theme/colors';
import { useSettingsStore } from '../../store/useSettingsStore';
import { WayaPatternBackground } from '../../components/cultural/WayaPatternBackground';
import { RiderIllustration } from '../../components/cultural/RiderIllustration';
import { AnimatedRouteLine } from '../../components/cultural/AnimatedRouteLine';
import { AfricanPatternDivider } from '../../components/cultural/AfricanPatternDivider';
import { WayaPrimaryButton } from '../../components/ui/WayaPrimaryButton';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface OnboardingScreenProps {
  onComplete: () => void;
}

const SLIDES = [
  {
    id: 'slide_1',
    headline: 'Send anything.\nMove with Waya.',
    subheadline:
      'Lagos traffic won’t slow your hustle. Dispatch documents, food, parcels, and heavy items in minutes.',
    badge: 'INSTANT DISPATCH 🚀',
    accentColor: 'primary',
  },
  {
    id: 'slide_2',
    headline: 'Track every move,\nlive on the map.',
    subheadline:
      'Watch your dispatch rider glide through the mainland and island with live 60 FPS GPS telemetry.',
    badge: 'AFRO-FUTURISTIC RADAR 📡',
    accentColor: 'accent',
  },
  {
    id: 'slide_3',
    headline: 'Know when it arrives.\nConfirmed by OTP.',
    subheadline:
      'Zero doubt, zero missing packages. Deliveries are unlocked only with your secure 4-digit Waya OTP.',
    badge: 'SECURE HANDSHAKE 🔐',
    accentColor: 'gold',
  },
];

export const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ onComplete }) => {
  const { themeMode, isReducedMotion } = useSettingsStore();
  const isDark = themeMode === 'dark';
  const colors = isDark ? Colors.dark : Colors.light;

  const [currentIndex, setCurrentIndex] = useState(0);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const handleNext = () => {
    if (currentIndex < SLIDES.length - 1) {
      if (!isReducedMotion) {
        Animated.sequence([
          Animated.timing(fadeAnim, { toValue: 0.3, duration: 150, useNativeDriver: true }),
          Animated.timing(fadeAnim, { toValue: 1, duration: 250, useNativeDriver: true }),
        ]).start();
      }
      setCurrentIndex((prev) => prev + 1);
    } else {
      onComplete();
    }
  };

  const handleSkip = () => {
    onComplete();
  };

  const slide = SLIDES[currentIndex];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      <WayaPatternBackground variant="ankara" opacity={0.09} />

      {/* Top Header: Brand Wordmark + Skip Button */}
      <View style={styles.topNav}>
        <View style={styles.brandBadge}>
          <Text style={[styles.brandText, { color: colors.primary }]}>
            WAYA<Text style={{ color: colors.accent }}>.</Text>
          </Text>
        </View>

        {currentIndex < SLIDES.length - 1 && (
          <Pressable onPress={handleSkip} style={styles.skipButton}>
            <Text style={[styles.skipText, { color: colors.textSecondary }]}>Skip</Text>
          </Pressable>
        )}
      </View>

      {/* Animated Visual Stage */}
      <Animated.View style={[styles.visualStage, { opacity: fadeAnim }]}>
        {currentIndex === 0 && (
          <View style={styles.illustrationWrapper}>
            <RiderIllustration size={SCREEN_WIDTH * 0.78} isMoving={true} />
            <AnimatedRouteLine width={SCREEN_WIDTH * 0.85} height={70} />
          </View>
        )}

        {currentIndex === 1 && (
          <View style={styles.radarCard}>
            <View style={[styles.radarCircleOuter, { borderColor: colors.gold, backgroundColor: colors.surface }]}>
              <View style={[styles.radarCircleInner, { borderColor: colors.accent }]}>
                <Compass size={48} color={colors.primary} />
              </View>
            </View>
            <View style={[styles.tagPill, { backgroundColor: colors.goldContainer, borderColor: colors.gold }]}>
              <Text style={[styles.tagText, { color: colors.goldDark }]}>Live Lagos Radar • 3.2km away</Text>
            </View>
            <AnimatedRouteLine width={SCREEN_WIDTH * 0.8} height={60} />
          </View>
        )}

        {currentIndex === 2 && (
          <View style={styles.securityCard}>
            <View style={[styles.otpDisplayCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <ShieldCheck size={44} color={colors.success} />
              <Text style={[styles.otpLabel, { color: colors.textSecondary }]}>SECURE DELIVERY PIN</Text>
              <View style={styles.pinBoxesRow}>
                {['W', 'Y', '8', '4'].map((char, idx) => (
                  <View key={idx} style={[styles.pinBox, { backgroundColor: colors.surfaceSubtle, borderColor: colors.primary }]}>
                    <Text style={[styles.pinChar, { color: colors.primary }]}>{char}</Text>
                  </View>
                ))}
              </View>
              <Text style={[styles.otpSubtext, { color: colors.textMuted }]}>
                Give to rider only upon package arrival
              </Text>
            </View>
          </View>
        )}
      </Animated.View>

      {/* Content Section: Headline + Copy + Page Indicators */}
      <View style={[styles.bottomCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <View style={[styles.badgeContainer, { backgroundColor: colors.primaryContainer }]}>
          <Text style={[styles.badgeText, { color: colors.primary }]}>{slide.badge}</Text>
        </View>

        <Text style={[styles.headline, { color: colors.textPrimary }]}>{slide.headline}</Text>
        <Text style={[styles.subheadline, { color: colors.textSecondary }]}>{slide.subheadline}</Text>

        <AfricanPatternDivider variant="kente-bars" height={6} style={{ width: '100%', marginVertical: 14 }} />

        {/* Step Indicators & CTA Row */}
        <View style={styles.controlsRow}>
          {/* Animated Page Indicators */}
          <View style={styles.dotsRow}>
            {SLIDES.map((_, idx) => {
              const isActive = idx === currentIndex;
              return (
                <View
                  key={idx}
                  style={[
                    styles.dot,
                    {
                      width: isActive ? 28 : 8,
                      backgroundColor: isActive ? colors.accent : colors.border,
                    },
                  ]}
                />
              );
            })}
          </View>

          {/* Next / Get Started Action */}
          <WayaPrimaryButton
            title={currentIndex === SLIDES.length - 1 ? 'Get Started' : 'Continue'}
            onPress={handleNext}
            variant="primary"
            size="md"
            icon={<ArrowRight size={18} color="#FFFFFF" />}
            iconPosition="right"
            style={{ minWidth: 150 }}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
  topNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 8,
  },
  brandBadge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  brandText: {
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: 2,
  },
  skipButton: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
  },
  skipText: {
    fontSize: 14,
    fontWeight: '600',
  },
  visualStage: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  illustrationWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  radarCard: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  radarCircleOuter: {
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  radarCircleInner: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tagPill: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
  },
  tagText: {
    fontSize: 12,
    fontWeight: '700',
  },
  securityCard: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  otpDisplayCard: {
    width: '88%',
    padding: 24,
    borderRadius: 24,
    borderWidth: 1,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 14,
    elevation: 4,
  },
  otpLabel: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.2,
    marginTop: 12,
    marginBottom: 12,
  },
  pinBoxesRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 12,
  },
  pinBox: {
    width: 44,
    height: 50,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pinChar: {
    fontSize: 22,
    fontWeight: '900',
  },
  otpSubtext: {
    fontSize: 11,
    textAlign: 'center',
  },
  bottomCard: {
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    borderTopWidth: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 28,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 8,
  },
  badgeContainer: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 10,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  headline: {
    fontSize: 26,
    fontWeight: '900',
    lineHeight: 32,
    marginBottom: 8,
  },
  subheadline: {
    fontSize: 14,
    lineHeight: 20,
  },
  controlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  dotsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dot: {
    height: 8,
    borderRadius: 4,
  },
});
