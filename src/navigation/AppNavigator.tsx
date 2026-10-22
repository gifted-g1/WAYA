import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useAuthStore } from '../store/useAuthStore';
import { useDeliveryStore } from '../store/useDeliveryStore';
import { useSettingsStore } from '../store/useSettingsStore';
import { Colors } from '../theme/colors';

// Screens
import { SplashScreen } from '../features/splash/SplashScreen';
import { OnboardingScreen } from '../features/onboarding/OnboardingScreen';
import { AuthScreen } from '../features/auth/AuthScreen';
import { HomeScreen } from '../features/home/HomeScreen';
import { CreateDeliveryScreen } from '../features/deliveries/CreateDeliveryScreen';
import { LiveTrackingScreen } from '../features/tracking/LiveTrackingScreen';
import { ActivityScreen } from '../features/activity/ActivityScreen';
import { NotificationsScreen } from '../features/notifications/NotificationsScreen';
import { ProfileScreen } from '../features/profile/ProfileScreen';

// Navigation Components
import { BottomTabBar, NavTab } from './BottomTabBar';
import { PackageCategory, DeliveryOrder } from '../types';

export const AppNavigator: React.FC = () => {
  const { isAuthenticated, logout } = useAuthStore();
  const { setActiveDeliveryId } = useDeliveryStore();
  const { themeMode } = useSettingsStore();
  const isDark = themeMode === 'dark';
  const colors = isDark ? Colors.dark : Colors.light;

  // App Lifecycle States
  const [showSplash, setShowSplash] = useState(true);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);
  const [currentTab, setCurrentTab] = useState<NavTab>('home');
  const [showNotifications, setShowNotifications] = useState(false);
  const [createDeliveryCategory, setCreateDeliveryCategory] = useState<PackageCategory | undefined>();

  // 1. Splash Screen
  if (showSplash) {
    return <SplashScreen onFinish={() => setShowSplash(false)} />;
  }

  // 2. Onboarding Screen
  if (!hasCompletedOnboarding) {
    return <OnboardingScreen onComplete={() => setHasCompletedOnboarding(true)} />;
  }

  // 3. Authentication Screen
  if (!isAuthenticated) {
    return <AuthScreen onSuccess={() => setCurrentTab('home')} />;
  }

  // 4. Notifications Screen
  if (showNotifications) {
    return (
      <NotificationsScreen
        onSelectDelivery={(deliveryId) => {
          setShowNotifications(false);
          setActiveDeliveryId(deliveryId);
          setCurrentTab('tracking');
        }}
        onBack={() => setShowNotifications(false)}
      />
    );
  }

  // 5. Main App Navigation Tabs
  const renderCurrentScreen = () => {
    switch (currentTab) {
      case 'home':
        return (
          <HomeScreen
            onNavigateToSend={(cat) => {
              setCreateDeliveryCategory(cat);
              setCurrentTab('deliveries');
            }}
            onNavigateToTracking={(orderId) => {
              if (orderId) setActiveDeliveryId(orderId);
              setCurrentTab('tracking');
            }}
            onNavigateToNotifications={() => setShowNotifications(true)}
          />
        );
      case 'deliveries':
        return (
          <CreateDeliveryScreen
            initialCategory={createDeliveryCategory}
            onOrderCompleted={(orderId) => {
              setActiveDeliveryId(orderId);
              setCurrentTab('tracking');
            }}
            onCancel={() => setCurrentTab('home')}
          />
        );
      case 'tracking':
        return (
          <LiveTrackingScreen
            onBackToHome={() => setCurrentTab('home')}
          />
        );
      case 'activity':
        return (
          <ActivityScreen
            onSelectDelivery={(orderId) => {
              setActiveDeliveryId(orderId);
              setCurrentTab('tracking');
            }}
            onReorder={(order: DeliveryOrder) => {
              setCreateDeliveryCategory(order.category);
              setCurrentTab('deliveries');
            }}
          />
        );
      case 'profile':
        return (
          <ProfileScreen
            onSignOut={async () => {
              await logout();
            }}
          />
        );
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.content}>{renderCurrentScreen()}</View>
      <BottomTabBar currentTab={currentTab} onTabChange={setCurrentTab} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
});
