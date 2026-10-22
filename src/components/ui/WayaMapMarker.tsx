import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { Package, MapPin, Bike, Navigation } from 'lucide-react-native';
import { Colors } from '../../theme/colors';
import { useSettingsStore } from '../../store/useSettingsStore';

interface WayaMapMarkerProps {
  type: 'pickup' | 'destination' | 'rider';
  title?: string;
  heading?: number;
  size?: number;
}

export const WayaMapMarker: React.FC<WayaMapMarkerProps> = ({
  type,
  title,
  heading = 0,
  size = 46,
}) => {
  const { themeMode, isReducedMotion } = useSettingsStore();
  const isDark = themeMode === 'dark';
  const colors = isDark ? Colors.dark : Colors.light;

  const pulseScale = useRef(new Animated.Value(1)).current;
  const pulseOpacity = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    if (isReducedMotion) return;

    Animated.loop(
      Animated.parallel([
        Animated.timing(pulseScale, {
          toValue: 2.1,
          duration: 1800,
          useNativeDriver: true,
        }),
        Animated.timing(pulseOpacity, {
          toValue: 0,
          duration: 1800,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [isReducedMotion]);

  const getMarkerColor = () => {
    switch (type) {
      case 'pickup':
        return colors.primary;
      case 'destination':
        return colors.accent;
      case 'rider':
        return colors.gold;
    }
  };

  const markerColor = getMarkerColor();

  return (
    <View style={styles.container}>
      {/* Radiating pulse wave */}
      <Animated.View
        style={[
          styles.pulseRing,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            backgroundColor: markerColor,
            opacity: pulseOpacity,
            transform: [{ scale: pulseScale }],
          },
        ]}
      />

      {/* Main marker bubble */}
      <View
        style={[
          styles.bubble,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            backgroundColor: markerColor,
            borderColor: colors.surface,
          },
        ]}
      >
        {type === 'pickup' && <Package size={size * 0.48} color="#FFFFFF" />}
        {type === 'destination' && <MapPin size={size * 0.48} color="#FFFFFF" />}
        {type === 'rider' && (
          <View style={{ transform: [{ rotate: `${heading}deg` }] }}>
            <Bike size={size * 0.52} color="#151917" />
          </View>
        )}
      </View>

      {/* Heading Pointer for Rider */}
      {type === 'rider' && (
        <View
          style={[
            styles.riderPointer,
            {
              transform: [{ rotate: `${heading}deg` }],
              top: -8,
            },
          ]}
        >
          <Navigation size={14} color={colors.goldDark} fill={colors.goldDark} />
        </View>
      )}

      {/* Bottom Anchor Needle for Pin */}
      {type !== 'rider' && (
        <View
          style={[
            styles.needle,
            {
              borderTopColor: markerColor,
            },
          ]}
        />
      )}

      {title && (
        <View style={[styles.labelBadge, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.labelText, { color: colors.textPrimary }]}>{title}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  pulseRing: {
    position: 'absolute',
  },
  bubble: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2.5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 6,
  },
  needle: {
    width: 0,
    height: 0,
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderTopWidth: 8,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    marginTop: -2,
  },
  riderPointer: {
    position: 'absolute',
  },
  labelBadge: {
    position: 'absolute',
    bottom: -22,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  labelText: {
    fontSize: 10,
    fontWeight: '700',
  },
});
