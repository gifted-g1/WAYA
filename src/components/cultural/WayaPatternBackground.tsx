import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import Svg, { Path, Circle, Rect, Defs, Pattern, G } from 'react-native-svg';
import { Colors } from '../../theme/colors';
import { useSettingsStore } from '../../store/useSettingsStore';

interface WayaPatternBackgroundProps {
  variant?: 'adire' | 'ankara' | 'kente' | 'subtle-grid';
  opacity?: number;
  height?: number;
  style?: any;
}

export const WayaPatternBackground: React.FC<WayaPatternBackgroundProps> = ({
  variant = 'ankara',
  opacity = 0.08,
  height,
  style,
}) => {
  const { themeMode, isReducedMotion } = useSettingsStore();
  const isDark = themeMode === 'dark';
  const colors = isDark ? Colors.dark : Colors.light;

  const floatAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isReducedMotion) return;
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: 1,
          duration: 12000,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 12000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [isReducedMotion]);

  const translateY = floatAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -10],
  });

  return (
    <View style={[StyleSheet.absoluteFill, styles.container, { height }, style]} pointerEvents="none">
      <Animated.View style={[StyleSheet.absoluteFill, { transform: [{ translateY }] }]}>
        <Svg width="100%" height="100%" viewBox="0 0 400 400">
          <Defs>
            {/* Ankara / Kente Geometric Motif Pattern */}
            <Pattern id="ankaraTile" width="80" height="80" patternUnits="userSpaceOnUse">
              {/* Stepped chevron rhythm */}
              <Path
                d="M0 40 L40 0 L80 40 L40 80 Z"
                fill="none"
                stroke={colors.primary}
                strokeWidth="1.8"
                strokeOpacity={opacity * 1.5}
              />
              <Path
                d="M10 40 L40 10 L70 40 L40 70 Z"
                fill="none"
                stroke={colors.accent}
                strokeWidth="1.2"
                strokeOpacity={opacity * 1.8}
              />
              {/* Center sacred geometry diamond */}
              <Rect
                x="33"
                y="33"
                width="14"
                height="14"
                transform="rotate(45 40 40)"
                fill={colors.gold}
                fillOpacity={opacity * 2}
              />
              {/* Subtle cross hatch rhythm */}
              <Path
                d="M0 0 L15 15 M65 65 L80 80 M0 80 L15 65 M65 15 L80 0"
                stroke={colors.textSecondary}
                strokeWidth="1.2"
                strokeOpacity={opacity}
              />
              <Circle cx="0" cy="40" r="3" fill={colors.accent} fillOpacity={opacity * 2} />
              <Circle cx="80" cy="40" r="3" fill={colors.accent} fillOpacity={opacity * 2} />
              <Circle cx="40" cy="0" r="3" fill={colors.gold} fillOpacity={opacity * 2} />
              <Circle cx="40" cy="80" r="3" fill={colors.gold} fillOpacity={opacity * 2} />
            </Pattern>

            {/* Adire Eleko Spiral Ripple Pattern */}
            <Pattern id="adireTile" width="100" height="100" patternUnits="userSpaceOnUse">
              <Circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke={colors.primary}
                strokeWidth="1.4"
                strokeDasharray="4,4"
                strokeOpacity={opacity * 1.5}
              />
              <Circle
                cx="50"
                cy="50"
                r="28"
                fill="none"
                stroke={colors.accent}
                strokeWidth="1.2"
                strokeOpacity={opacity * 1.4}
              />
              <Circle
                cx="50"
                cy="50"
                r="16"
                fill="none"
                stroke={colors.gold}
                strokeWidth="1.6"
                strokeDasharray="2,3"
                strokeOpacity={opacity * 2}
              />
              <Circle cx="50" cy="50" r="5" fill={colors.primary} fillOpacity={opacity * 2} />
            </Pattern>
          </Defs>

          <Rect
            x="0"
            y="0"
            width="100%"
            height="100%"
            fill={variant === 'adire' ? 'url(#adireTile)' : 'url(#ankaraTile)'}
          />
        </Svg>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    zIndex: -1,
  },
});
