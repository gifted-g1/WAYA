import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import Svg, {
  Path,
  Circle,
  Rect,
  Defs,
  LinearGradient,
  Stop,
  G,
} from 'react-native-svg';
import { Colors } from '../../theme/colors';
import { useSettingsStore } from '../../store/useSettingsStore';

interface RiderIllustrationProps {
  size?: number;
  isMoving?: boolean;
}

export const RiderIllustration: React.FC<RiderIllustrationProps> = ({
  size = 220,
  isMoving = true,
}) => {
  const { themeMode, isReducedMotion } = useSettingsStore();
  const isDark = themeMode === 'dark';
  const colors = isDark ? Colors.dark : Colors.light;

  const bounceAnim = useRef(new Animated.Value(0)).current;
  const wheelRotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isReducedMotion || !isMoving) return;

    // Gentle vertical bike suspension bounce
    Animated.loop(
      Animated.sequence([
        Animated.timing(bounceAnim, {
          toValue: -4,
          duration: 350,
          useNativeDriver: true,
        }),
        Animated.timing(bounceAnim, {
          toValue: 0,
          duration: 350,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Wheel rotation rhythm
    Animated.loop(
      Animated.timing(wheelRotateAnim, {
        toValue: 1,
        duration: 900,
        useNativeDriver: true,
      })
    ).start();
  }, [isReducedMotion, isMoving]);

  const wheelSpin = wheelRotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={[styles.container, { width: size, height: size * 0.75 }]}>
      <Animated.View
        style={[
          styles.inner,
          {
            transform: [{ translateY: bounceAnim }],
          },
        ]}
      >
        <Svg width={size} height={size * 0.75} viewBox="0 0 240 180">
          <Defs>
            <LinearGradient id="riderGrad" x1="0" y1="0" x2="1" y2="1">
              <Stop offset="0%" stopColor={colors.primary} />
              <Stop offset="100%" stopColor={colors.primaryDark} />
            </LinearGradient>
            <LinearGradient id="boxGrad" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0%" stopColor={colors.accent} />
              <Stop offset="100%" stopColor={colors.accentDark} />
            </LinearGradient>
            <LinearGradient id="goldHighlight" x1="0" y1="0" x2="1" y2="1">
              <Stop offset="0%" stopColor={colors.goldLight} />
              <Stop offset="100%" stopColor={colors.gold} />
            </LinearGradient>
          </Defs>

          {/* Speed / Road Motion Dust Ripples */}
          <Path
            d="M10 162 L50 162 M24 168 L70 168 M15 156 L38 156"
            stroke={colors.accentLight}
            strokeWidth="3"
            strokeLinecap="round"
            strokeOpacity="0.6"
          />

          {/* Rear Wheel */}
          <G>
            <Circle cx="55" cy="142" r="28" fill="#1A1F1D" />
            <Circle cx="55" cy="142" r="22" fill={colors.surface} />
            <Circle cx="55" cy="142" r="14" fill="#363F3B" />
            {/* African Geometric Star Rim */}
            <Path
              d="M55 120 L55 164 M33 142 L77 142 M40 127 L70 157 M40 157 L70 127"
              stroke={colors.gold}
              strokeWidth="2.5"
            />
            <Circle cx="55" cy="142" r="6" fill={colors.accent} />
          </G>

          {/* Front Wheel */}
          <G>
            <Circle cx="185" cy="142" r="28" fill="#1A1F1D" />
            <Circle cx="185" cy="142" r="22" fill={colors.surface} />
            <Circle cx="185" cy="142" r="14" fill="#363F3B" />
            <Path
              d="M185 120 L185 164 M163 142 L207 142 M170 127 L200 157 M170 157 L200 127"
              stroke={colors.gold}
              strokeWidth="2.5"
            />
            <Circle cx="185" cy="142" r="6" fill={colors.accent} />
          </G>

          {/* Motorcycle Chassis Frame */}
          <Path
            d="M55 142 L95 142 L135 110 L175 110 L185 142"
            fill="none"
            stroke="#2C3531"
            strokeWidth="7"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <Path
            d="M95 142 L115 105 L155 105"
            fill="none"
            stroke={colors.primary}
            strokeWidth="6"
            strokeLinecap="round"
          />

          {/* Exhaust Pipe & Engine Block */}
          <Path
            d="M100 144 L40 152"
            stroke="#5A6661"
            strokeWidth="5"
            strokeLinecap="round"
          />
          <Rect x="88" y="126" width="28" height="20" rx="4" fill="#3D4743" />

          {/* Fuel Tank with Waya Green & Gold Stripe */}
          <Path
            d="M125 102 C125 90, 160 90, 165 104 L130 108 Z"
            fill={colors.primary}
          />
          <Path
            d="M130 96 Q145 92 160 97"
            stroke={colors.gold}
            strokeWidth="2.5"
            fill="none"
          />

          {/* Headlight (Afro-Futuristic Neon Beam) */}
          <Path
            d="M192 108 L220 95 L220 125 Z"
            fill={colors.gold}
            fillOpacity="0.25"
          />
          <Circle cx="188" cy="108" r="7" fill={colors.gold} />

          {/* Waya Delivery Box on Rear Rack with African Geometric Trim */}
          <G>
            <Rect x="30" y="78" width="46" height="42" rx="7" fill="url(#boxGrad)" />
            {/* Box lock & trim */}
            <Rect x="28" y="76" width="50" height="8" rx="3" fill={colors.accentDark} />
            {/* Waya Logo glyph on delivery box */}
            <Circle cx="53" cy="98" r="11" fill={colors.surface} />
            <Path
              d="M48 93 L51 103 L53 96 L55 103 L58 93"
              fill="none"
              stroke={colors.primary}
              strokeWidth="1.8"
              strokeLinecap="round"
            />
            <Circle cx="53" cy="91" r="1.5" fill={colors.gold} />
          </G>

          {/* Dispatch Rider Body & Posture */}
          <G>
            {/* Torso in Waya Green Delivery Jacket */}
            <Path
              d="M102 85 L125 80 L140 108 L110 114 Z"
              fill={colors.primary}
            />
            {/* Jacket High-Visibility Terracotta Stripes */}
            <Path
              d="M108 92 L132 87"
              stroke={colors.accent}
              strokeWidth="3.5"
              strokeLinecap="round"
            />
            <Path
              d="M112 100 L136 95"
              stroke={colors.gold}
              strokeWidth="2.5"
              strokeLinecap="round"
            />

            {/* Arm & Handlebar Grip */}
            <Path
              d="M125 82 L155 96 L175 104"
              fill="none"
              stroke={colors.primary}
              strokeWidth="7"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Rider Helmet (Expressive, Modern Afro-tech styling) */}
            <Circle cx="126" cy="62" r="18" fill="url(#riderGrad)" />
            {/* Visor */}
            <Path
              d="M132 55 Q146 62 138 72 L128 70 Z"
              fill={colors.gold}
            />
            {/* Helmet Accent Stripe */}
            <Path
              d="M112 60 Q124 50 138 56"
              fill="none"
              stroke={colors.accent}
              strokeWidth="3.2"
              strokeLinecap="round"
            />
          </G>
        </Svg>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  inner: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
