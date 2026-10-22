import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Animated,
  Dimensions,
  Platform,
} from 'react-native';
import Svg, {
  Path,
  Rect,
  Circle,
  Line,
  Defs,
  LinearGradient,
  Stop,
  G,
  Text as SvgText,
} from 'react-native-svg';
import {
  Plus,
  Minus,
  LocateFixed,
  Layers,
  Compass,
  AlertTriangle,
} from 'lucide-react-native';
import { Colors } from '../../theme/colors';
import { useSettingsStore } from '../../store/useSettingsStore';
import { WayaMapMarker } from '../ui/WayaMapMarker';
import { LAGOS_SAMPLE_ROUTE } from '../../services/mockData';

interface InteractiveMapProps {
  riderLocation?: { latitude: number; longitude: number };
  pickupLocation?: { latitude: number; longitude: number; label?: string };
  destinationLocation?: { latitude: number; longitude: number; label?: string };
  routeIndex?: number; // 0 to LAGOS_SAMPLE_ROUTE.length - 1
  height?: number;
  interactive?: boolean;
}

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  riderLocation,
  pickupLocation,
  destinationLocation,
  routeIndex = 4,
  height = 360,
  interactive = true,
}) => {
  const { themeMode, isReducedMotion } = useSettingsStore();
  const isDark = themeMode === 'dark';
  const colors = isDark ? Colors.dark : Colors.light;

  const [zoomLevel, setZoomLevel] = useState(1);
  const [showTraffic, setShowTraffic] = useState(true);

  // Map coordinate conversion to SVG 400x350 viewport
  // Lagos bounds roughly: Lat 6.40 to 6.62, Lng 3.32 to 3.52
  const minLat = 6.41;
  const maxLat = 6.62;
  const minLng = 3.33;
  const maxLng = 3.52;

  const toSvgX = (lng: number) => {
    return ((lng - minLng) / (maxLng - minLng)) * 360 + 20;
  };

  const toSvgY = (lat: number) => {
    // Invert Y because latitude goes up north while SVG Y goes down
    return 340 - ((lat - minLat) / (maxLat - minLat)) * 310;
  };

  // Convert route polyline points
  const svgRoutePoints = LAGOS_SAMPLE_ROUTE.map((pt) => ({
    x: toSvgX(pt.longitude),
    y: toSvgY(pt.latitude),
  }));

  const routePathD = svgRoutePoints.reduce((acc, pt, idx) => {
    return idx === 0 ? `M ${pt.x} ${pt.y}` : `${acc} L ${pt.x} ${pt.y}`;
  }, '');

  // Calculate current rider marker SVG position
  const clampedIndex = Math.min(Math.max(0, routeIndex), LAGOS_SAMPLE_ROUTE.length - 1);
  const currentRiderCoord = riderLocation || LAGOS_SAMPLE_ROUTE[clampedIndex];
  const riderSvgX = toSvgX(currentRiderCoord.longitude);
  const riderSvgY = toSvgY(currentRiderCoord.latitude);

  // Calculate rider heading towards next point
  const nextPt = LAGOS_SAMPLE_ROUTE[Math.min(clampedIndex + 1, LAGOS_SAMPLE_ROUTE.length - 1)];
  const prevPt = LAGOS_SAMPLE_ROUTE[Math.max(0, clampedIndex - 1)];
  const angleRad = Math.atan2(toSvgY(nextPt.latitude) - toSvgY(prevPt.latitude), toSvgX(nextPt.longitude) - toSvgX(prevPt.longitude));
  const riderHeading = Math.round((angleRad * 180) / Math.PI) + 90;

  // Pickup and Destination SVG coordinates
  const pickupSvg = {
    x: toSvgX(LAGOS_SAMPLE_ROUTE[0].longitude),
    y: toSvgY(LAGOS_SAMPLE_ROUTE[0].latitude),
  };
  const destSvg = {
    x: toSvgX(LAGOS_SAMPLE_ROUTE[LAGOS_SAMPLE_ROUTE.length - 1].longitude),
    y: toSvgY(LAGOS_SAMPLE_ROUTE[LAGOS_SAMPLE_ROUTE.length - 1].latitude),
  };

  return (
    <View style={[styles.container, { height, backgroundColor: isDark ? '#0D1410' : '#EAF1ED' }]}>
      <Svg width="100%" height="100%" viewBox="0 0 400 350" preserveAspectRatio="xMidYMid slice">
        <Defs>
          <LinearGradient id="lagoonWater" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0%" stopColor={isDark ? '#081D26' : '#C7E4F2'} />
            <Stop offset="100%" stopColor={isDark ? '#06131A' : '#B3DAEE'} />
          </LinearGradient>
          <LinearGradient id="routeLineGrad" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0%" stopColor={colors.primary} />
            <Stop offset="50%" stopColor={colors.gold} />
            <Stop offset="100%" stopColor={colors.accent} />
          </LinearGradient>
        </Defs>

        {/* Map Background Base Grid */}
        <Rect x="0" y="0" width="400" height="350" fill={isDark ? '#0F1813' : '#F2ECE1'} />

        {/* Lagos Lagoon & Atlantic Coastline Geography */}
        <Path
          d="M 120 180 C 180 150, 240 220, 310 190 C 370 160, 400 180, 400 350 L 80 350 L 80 230 Z"
          fill="url(#lagoonWater)"
        />
        <Path
          d="M 0 320 C 100 300, 250 330, 400 310 L 400 350 L 0 350 Z"
          fill="url(#lagoonWater)"
        />

        {/* Major Lagos Arterial Highways / Road Network */}
        {/* Ikorodu Road */}
        <Path
          d="M 80 20 L 95 120 L 115 200 L 140 270"
          stroke={isDark ? '#1C2E25' : '#DED4C5'}
          strokeWidth="6"
          strokeLinecap="round"
        />
        {/* Third Mainland Bridge across the lagoon */}
        <Path
          d="M 115 200 C 160 210, 210 240, 250 270"
          stroke={isDark ? '#263E32' : '#C9BCAB'}
          strokeWidth="8"
          strokeLinecap="round"
        />
        {/* Lekki - Epe Expressway */}
        <Path
          d="M 230 275 L 290 285 L 380 295"
          stroke={isDark ? '#1C2E25' : '#DED4C5'}
          strokeWidth="7"
          strokeLinecap="round"
        />
        {/* Victoria Island Ring */}
        <Path
          d="M 210 275 C 240 260, 260 290, 230 310 Z"
          stroke={isDark ? '#1C2E25' : '#DED4C5'}
          strokeWidth="5"
        />

        {/* Real-time Traffic Overlay (Green, Yellow, Red Congestion) */}
        {showTraffic && (
          <G opacity="0.85">
            {/* Free flow on mainland span */}
            <Path
              d="M 115 200 C 145 208, 175 220, 195 230"
              stroke="#22C55E"
              strokeWidth="3.5"
              strokeLinecap="round"
            />
            {/* Moderate traffic around toll gate */}
            <Path
              d="M 195 230 C 215 242, 235 258, 250 270"
              stroke="#F59E0B"
              strokeWidth="3.5"
              strokeLinecap="round"
            />
            {/* Smooth flow on Admiralty Way */}
            <Path
              d="M 250 270 L 305 285"
              stroke="#22C55E"
              strokeWidth="3.5"
              strokeLinecap="round"
            />
          </G>
        )}

        {/* Prominent Lagos Landmarks */}
        <SvgText x="50" y="45" fill={colors.textMuted} fontSize="9" fontWeight="700">
          IKEJA GRA
        </SvgText>
        <SvgText x="60" y="195" fill={colors.textMuted} fontSize="9" fontWeight="700">
          YABA HUB
        </SvgText>
        <SvgText x="175" y="190" fill="#3B82F6" fontSize="8" fontWeight="600" opacity="0.7">
          LAGOS LAGOON
        </SvgText>
        <SvgText x="210" y="325" fill={colors.textMuted} fontSize="9" fontWeight="700">
          VICTORIA ISLAND
        </SvgText>
        <SvgText x="280" y="275" fill={colors.textMuted} fontSize="9" fontWeight="700">
          LEKKI PHASE 1
        </SvgText>

        {/* Route Polyline - Active Delivery Path */}
        {/* Glow halo */}
        <Path
          d={routePathD}
          fill="none"
          stroke={colors.primary}
          strokeWidth="10"
          strokeOpacity="0.25"
          strokeLinecap="round"
        />
        {/* Glowing vibrant route line */}
        <Path
          d={routePathD}
          fill="none"
          stroke="url(#routeLineGrad)"
          strokeWidth="4.5"
          strokeLinecap="round"
        />
        {/* Completed route trail behind rider */}
        <Path
          d={svgRoutePoints.slice(0, clampedIndex + 1).reduce((acc, pt, idx) => {
            return idx === 0 ? `M ${pt.x} ${pt.y}` : `${acc} L ${pt.x} ${pt.y}`;
          }, '')}
          fill="none"
          stroke={colors.primary}
          strokeWidth="4.5"
          strokeLinecap="round"
        />
      </Svg>

      {/* HTML / React Native Marker Overlays on top of SVG */}
      {/* 1. Pickup Marker (Ikeja/Yaba) */}
      <View
        style={[
          styles.markerAnchor,
          {
            left: `${(pickupSvg.x / 400) * 100}%`,
            top: `${(pickupSvg.y / 350) * 100}%`,
          },
        ]}
      >
        <WayaMapMarker type="pickup" title="Pickup" size={32} />
      </View>

      {/* 2. Destination Marker (Lekki) */}
      <View
        style={[
          styles.markerAnchor,
          {
            left: `${(destSvg.x / 400) * 100}%`,
            top: `${(destSvg.y / 350) * 100}%`,
          },
        ]}
      >
        <WayaMapMarker type="destination" title="Destination" size={32} />
      </View>

      {/* 3. Live Moving Dispatch Rider Marker */}
      <View
        style={[
          styles.markerAnchor,
          {
            left: `${(riderSvgX / 400) * 100}%`,
            top: `${(riderSvgY / 350) * 100}%`,
          },
        ]}
      >
        <WayaMapMarker type="rider" heading={riderHeading} size={38} />
      </View>

      {/* Map Control Buttons (Floating on top right) */}
      {interactive && (
        <View style={styles.controlsColumn}>
          {/* Zoom In */}
          <Pressable
            style={[styles.controlBtn, { backgroundColor: colors.surface, borderColor: colors.border }]}
            onPress={() => setZoomLevel((z) => Math.min(z + 0.2, 2))}
          >
            <Plus size={16} color={colors.textPrimary} />
          </Pressable>

          {/* Zoom Out */}
          <Pressable
            style={[styles.controlBtn, { backgroundColor: colors.surface, borderColor: colors.border }]}
            onPress={() => setZoomLevel((z) => Math.max(z - 0.2, 0.8))}
          >
            <Minus size={16} color={colors.textPrimary} />
          </Pressable>

          {/* Recenter on Rider */}
          <Pressable
            style={[styles.controlBtn, { backgroundColor: colors.surface, borderColor: colors.border }]}
            onPress={() => setZoomLevel(1)}
          >
            <LocateFixed size={16} color={colors.primary} />
          </Pressable>

          {/* Toggle Traffic */}
          <Pressable
            style={[
              styles.controlBtn,
              {
                backgroundColor: showTraffic ? colors.primaryContainer : colors.surface,
                borderColor: showTraffic ? colors.primary : colors.border,
              },
            ]}
            onPress={() => setShowTraffic(!showTraffic)}
          >
            <Layers size={16} color={showTraffic ? colors.primary : colors.textMuted} />
          </Pressable>
        </View>
      )}

      {/* Lagos City Badge */}
      <View style={[styles.cityBadge, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <View style={[styles.liveDot, { backgroundColor: colors.success }]} />
        <Text style={[styles.cityText, { color: colors.textPrimary }]}>Lagos GPS Live • 60 FPS</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    overflow: 'hidden',
    position: 'relative',
  },
  markerAnchor: {
    position: 'absolute',
    transform: [{ translateX: -18 }, { translateY: -18 }],
  },
  controlsColumn: {
    position: 'absolute',
    top: 14,
    right: 14,
    gap: 8,
  },
  controlBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cityBadge: {
    position: 'absolute',
    top: 14,
    left: 14,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1,
    gap: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  liveDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
  },
  cityText: {
    fontSize: 11,
    fontWeight: '700',
  },
});
