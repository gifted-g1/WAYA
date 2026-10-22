import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import Svg, { Path, Circle, Defs, LinearGradient, Stop } from 'react-native-svg';
import { Colors } from '../../theme/colors';
import { useSettingsStore } from '../../store/useSettingsStore';

interface WayaLogoAnimationProps {
  size?: number;
  showTagline?: boolean;
  onAnimationComplete?: () => void;
}

export const WayaLogoAnimation: React.FC<WayaLogoAnimationProps> = ({
  size = 110,
  showTagline = true,
  onAnimationComplete,
}) => {
  const { themeMode, isReducedMotion } = useSettingsStore();
  const isDark = themeMode === 'dark';
  const colors = isDark ? Colors.dark : Colors.light;

  const scaleAnim = useRef(new Animated.Value(isReducedMotion ? 1 : 0.4)).current;
  const opacityAnim = useRef(new Animated.Value(isReducedMotion ? 1 : 0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const textTranslateY = useRef(new Animated.Value(isReducedMotion ? 0 : 16)).current;
  const textOpacity = useRef(new Animated.Value(isReducedMotion ? 1 : 0)).current;

  useEffect(() => {
    if (isReducedMotion) {
      if (onAnimationComplete) onAnimationComplete();
      return;
    }

    Animated.sequence([
      // Step 1: Logo spring in
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 6,
          tension: 70,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
      ]),
      // Step 2: Text reveal
      Animated.parallel([
        Animated.timing(textTranslateY, {
          toValue: 0,
          duration: 500,
          easing: Easing.out(Easing.back(1.5)),
          useNativeDriver: true,
        }),
        Animated.timing(textOpacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ]),
    ]).start(() => {
      // Step 3: Gentle continuous pulse on the location dot
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.15,
            duration: 1400,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1400,
            useNativeDriver: true,
          }),
        ])
      ).start();

      if (onAnimationComplete) {
        onAnimationComplete();
      }
    });
  }, [isReducedMotion]);

  const viewSize = size;

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.logoWrapper,
          {
            transform: [{ scale: scaleAnim }],
            opacity: opacityAnim,
          },
        ]}
      >
        <Svg width={viewSize} height={viewSize} viewBox="0 0 120 120">
          <Defs>
            <LinearGradient id="wayaGrad" x1="0" y1="0" x2="1" y2="1">
              <Stop offset="0%" stopColor={colors.primary} />
              <Stop offset="50%" stopColor={colors.accent} />
              <Stop offset="100%" stopColor={colors.gold} />
            </LinearGradient>
            <LinearGradient id="goldGlow" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0%" stopColor={colors.goldLight} />
              <Stop offset="100%" stopColor={colors.goldDark} />
            </LinearGradient>
          </Defs>

          {/* Outer Afro-Futuristic Hexagonal Shield Motif */}
          <Path
            d="M60 6 L108 32 L108 88 L60 114 L12 88 L12 32 Z"
            fill="none"
            stroke="url(#wayaGrad)"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* African Textile Weave "W" Glyph */}
          <Path
            d="M32 40 L45 82 L60 52 L75 82 L88 40"
            fill="none"
            stroke={colors.primary}
            strokeWidth="6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Golden Terracotta Inner Chevron */}
          <Path
            d="M42 46 L50 68 L60 48 L70 68 L78 46"
            fill="none"
            stroke={colors.accent}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* The "Where You At?" Geolocation Pin Head */}
          <Circle cx="60" cy="24" r="7" fill="url(#goldGlow)" />
          <Circle cx="60" cy="24" r="3.5" fill={colors.surface} />
        </Svg>
      </Animated.View>

      {showTagline && (
        <Animated.View
          style={[
            styles.textContainer,
            {
              opacity: textOpacity,
              transform: [{ translateY: textTranslateY }],
            },
          ]}
        >
          <Text style={[styles.brandTitle, { color: colors.textPrimary }]}>
            WAYA<Text style={{ color: colors.accent }}>.</Text>
          </Text>
          <View style={styles.taglineRow}>
            <View style={[styles.dot, { backgroundColor: colors.gold }]} />
            <Text style={[styles.tagline, { color: colors.textSecondary }]}>
              Where You At?
            </Text>
            <View style={[styles.dot, { backgroundColor: colors.gold }]} />
          </View>
        </Animated.View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContainer: {
    alignItems: 'center',
    marginTop: 14,
  },
  brandTitle: {
    fontSize: 32,
    fontWeight: '900',
    letterSpacing: 3,
    textAlign: 'center',
  },
  taglineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    gap: 8,
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
  },
  tagline: {
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
});
