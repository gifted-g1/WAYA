import React, { useRef } from 'react';
import { View, Text, StyleSheet, Pressable, Animated, Platform } from 'react-native';
import { Home, PackagePlus, Clock, User, Compass } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { Colors } from '../theme/colors';
import { useSettingsStore } from '../store/useSettingsStore';

export type NavTab = 'home' | 'deliveries' | 'tracking' | 'activity' | 'profile';

interface BottomTabBarProps {
  currentTab: NavTab;
  onTabChange: (tab: NavTab) => void;
}

const TABS: Array<{ id: NavTab; label: string; icon: any }> = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'deliveries', label: 'Deliver', icon: PackagePlus },
  { id: 'tracking', label: 'Live Map', icon: Compass },
  { id: 'activity', label: 'Activity', icon: Clock },
  { id: 'profile', label: 'Profile', icon: User },
];

export const BottomTabBar: React.FC<BottomTabBarProps> = ({ currentTab, onTabChange }) => {
  const { themeMode, isReducedMotion } = useSettingsStore();
  const isDark = themeMode === 'dark';
  const colors = isDark ? Colors.dark : Colors.light;

  const handleTabPress = (tab: NavTab) => {
    if (Platform.OS !== 'web') {
      try {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      } catch (e) {}
    }
    onTabChange(tab);
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
          shadowColor: colors.cardShadow,
        },
      ]}
    >
      {TABS.map((tab) => {
        const isSelected = currentTab === tab.id;
        const IconComponent = tab.icon;

        return (
          <Pressable
            key={tab.id}
            style={styles.tabItem}
            onPress={() => handleTabPress(tab.id)}
          >
            <View
              style={[
                styles.iconWrapper,
                isSelected && {
                  backgroundColor: colors.primaryContainer,
                  borderRadius: 16,
                  paddingHorizontal: 12,
                  paddingVertical: 4,
                },
              ]}
            >
              <IconComponent
                size={22}
                color={isSelected ? colors.primary : colors.textMuted}
                strokeWidth={isSelected ? 2.5 : 2}
              />
            </View>

            <Text
              style={[
                styles.tabLabel,
                {
                  color: isSelected ? colors.primary : colors.textMuted,
                  fontWeight: isSelected ? '800' : '500',
                },
              ]}
            >
              {tab.label}
            </Text>

            {/* African Gold Indicator Dot for active tab */}
            {isSelected && (
              <View style={[styles.activeDot, { backgroundColor: colors.gold }]} />
            )}
          </Pressable>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: 70,
    borderTopWidth: 1,
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 10,
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 8,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    position: 'relative',
  },
  iconWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 32,
  },
  tabLabel: {
    fontSize: 10,
    marginTop: 2,
    letterSpacing: 0.2,
  },
  activeDot: {
    position: 'absolute',
    bottom: 4,
    width: 4,
    height: 4,
    borderRadius: 2,
  },
});
