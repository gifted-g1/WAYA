import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { Colors } from '../../theme/colors';
import { useSettingsStore } from '../../store/useSettingsStore';
import { WayaLogoAnimation } from '../../components/cultural/WayaLogoAnimation';
import { WayaPatternBackground } from '../../components/cultural/WayaPatternBackground';
import { AfricanPatternDivider } from '../../components/cultural/AfricanPatternDivider';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

interface SplashScreenProps {
  onFinish: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  const { themeMode } = useSettingsStore();
  const isDark = themeMode === 'dark';
  const colors = isDark ? Colors.dark : Colors.light;

  useEffect(() => {
    const timer = setTimeout(() => {
      onFinish();
    }, 2800);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <WayaPatternBackground variant="ankara" opacity={0.12} />

      <View style={styles.centerContent}>
        <WayaLogoAnimation size={130} showTagline={true} />

        <AfricanPatternDivider
          variant="kente-bars"
          height={8}
          style={{ width: 180, marginTop: 24 }}
        />
      </View>

      {/* Cultural Footer */}
      <View style={styles.footer}>
        <Text style={[styles.poweredBy, { color: colors.textMuted }]}>
          MADE WITH PRIDE FOR NIGERIA & AFRICA 🇳🇬
        </Text>
        <Text style={[styles.versionText, { color: colors.textMuted }]}>
          Version 1.0.0 • Afro-Futuristic Logistics
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  centerContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  footer: {
    position: 'absolute',
    bottom: 34,
    alignItems: 'center',
    gap: 4,
  },
  poweredBy: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.5,
  },
  versionText: {
    fontSize: 9,
    fontWeight: '500',
  },
});
