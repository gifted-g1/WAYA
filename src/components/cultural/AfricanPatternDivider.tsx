import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Rect, Path, G } from 'react-native-svg';
import { Colors } from '../../theme/colors';
import { useSettingsStore } from '../../store/useSettingsStore';

interface AfricanPatternDividerProps {
  height?: number;
  variant?: 'kente-bars' | 'chevron-zigzag';
  style?: any;
}

export const AfricanPatternDivider: React.FC<AfricanPatternDividerProps> = ({
  height = 8,
  variant = 'kente-bars',
  style,
}) => {
  const { themeMode } = useSettingsStore();
  const isDark = themeMode === 'dark';
  const colors = isDark ? Colors.dark : Colors.light;

  return (
    <View style={[styles.container, { height }, style]}>
      <Svg width="100%" height={height} viewBox="0 0 320 10" preserveAspectRatio="none">
        {variant === 'kente-bars' ? (
          <G>
            {/* Repeating rhythmic Kente motif blocks */}
            {Array.from({ length: 16 }).map((_, i) => {
              const x = i * 20;
              const fillColors = [colors.primary, colors.gold, colors.accent, colors.primaryLight];
              const fill = fillColors[i % fillColors.length];
              return (
                <G key={i}>
                  <Rect x={x} y="0" width="8" height="10" rx="1.5" fill={fill} />
                  <Rect x={x + 10} y="2" width="6" height="6" rx="1" fill={colors.border} />
                </G>
              );
            })}
          </G>
        ) : (
          <Path
            d="M0 5 L10 0 L20 10 L30 0 L40 10 L50 0 L60 10 L70 0 L80 10 L90 0 L100 10 L110 0 L120 10 L130 0 L140 10 L150 0 L160 10 L170 0 L180 10 L190 0 L200 10 L210 0 L220 10 L230 0 L240 10 L250 0 L260 10 L270 0 L280 10 L290 0 L300 10 L310 0 L320 10"
            fill="none"
            stroke={colors.accent}
            strokeWidth="2"
            strokeLinecap="round"
          />
        )}
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
