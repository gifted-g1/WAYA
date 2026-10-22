import { create } from 'zustand';

export type ThemeMode = 'light' | 'dark' | 'system';

interface SettingsStoreState {
  themeMode: ThemeMode;
  isReducedMotion: boolean;
  pushNotificationsEnabled: boolean;
  smsAlertsEnabled: boolean;
  whatsappUpdatesEnabled: boolean;

  setThemeMode: (mode: ThemeMode) => void;
  toggleThemeMode: () => void;
  setReducedMotion: (enabled: boolean) => void;
  toggleReducedMotion: () => void;
  setPushNotifications: (enabled: boolean) => void;
  setSmsAlerts: (enabled: boolean) => void;
  setWhatsappUpdates: (enabled: boolean) => void;
}

export const useSettingsStore = create<SettingsStoreState>((set) => ({
  themeMode: 'light',
  isReducedMotion: false,
  pushNotificationsEnabled: true,
  smsAlertsEnabled: true,
  whatsappUpdatesEnabled: true,

  setThemeMode: (mode) => set({ themeMode: mode }),
  toggleThemeMode: () =>
    set((state) => ({ themeMode: state.themeMode === 'dark' ? 'light' : 'dark' })),
  setReducedMotion: (enabled) => set({ isReducedMotion: enabled }),
  toggleReducedMotion: () => set((state) => ({ isReducedMotion: !state.isReducedMotion })),
  setPushNotifications: (enabled) => set({ pushNotificationsEnabled: enabled }),
  setSmsAlerts: (enabled) => set({ smsAlertsEnabled: enabled }),
  setWhatsappUpdates: (enabled) => set({ whatsappUpdatesEnabled: enabled }),
}));
