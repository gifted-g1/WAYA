import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import Svg, { Path, Defs, LinearGradient, Stop } from 'react-native-svg';
import { Colors } from '../../theme/colors';
import { useSettingsStore } from '../../store/useSettingsStore';

interface AnimatedRouteLineProps {
  width?: number;
  height?: number;
  d?: string;
  isCompleted?: boolean;
}

export const AnimatedRouteLine: React.FC<AnimatedRouteLineProps> = ({
  width = 320,
  height = 90,
  d = 'M20 70 Q90 10, 160 50 T300 25',
  isCompleted = false,
}) => {
  const { themeMode, isReducedMotion } = useSettingsStore();
  const isDark = themeMode === 'dark';
  const colors = isDark ? Colors.dark : Colors.light;

  const pulseAnim = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    if (isReducedMotion) return;
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0.4,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [isReducedMotion]);

  return (
    <View style={[styles.container, { width, height }]}>
      <Svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
        <Defs>
          <LinearGradient id="routeGlowGrad" x1="0" y1="0" x2="1" y2="0">
            <Stop offset="0%" stopColor={colors.primary} />
            <Stop offset="60%" stopColor={colors.gold} />
            <Stop offset="100%" stopColor={colors.accent} />
          </LinearGradient>
        </Defs>

        {/* Outer subtle glow line */}
        <Path
          d={d}
          fill="none"
          stroke={colors.gold}
          strokeWidth="8"
          strokeOpacity="0.25"
          strokeLinecap="round"
        />

        {/* Main route path */}
        <Path
          d={d}
          fill="none"
          stroke="url(#routeGlowGrad)"
          strokeWidth="4"
          strokeDasharray={isCompleted ? undefined : '8, 6'}
          strokeLinecap="round"
        />
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
});
