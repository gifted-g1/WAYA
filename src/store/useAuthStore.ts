import { create } from 'zustand';
import { UserProfile, SavedAddress } from '../types';
import { DEMO_USER, POPULAR_LOCATIONS } from '../services/mockData';
import { authService, LoginParams, RegisterParams, VerifyOtpParams } from '../services/authService';
import { apiClient } from '../services/apiClient';

interface AuthStoreState {
  user: UserProfile | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  savedAddresses: SavedAddress[];
  isDemoMode: boolean;

  // Actions
  login: (params: LoginParams) => Promise<void>;
  register: (params: RegisterParams) => Promise<boolean>;
  verifyOtp: (params: VerifyOtpParams) => Promise<void>;
  logout: () => Promise<void>;
  quickDemoLogin: () => void;
  updateUser: (updates: Partial<UserProfile>) => void;
  addSavedAddress: (address: Omit<SavedAddress, 'id'>) => void;
  removeSavedAddress: (id: string) => void;
  setDemoMode: (enabled: boolean) => void;
}

export const useAuthStore = create<AuthStoreState>((set, get) => ({
  user: DEMO_USER, // Preload demo user for immediate frictionless interaction
  token: 'waya_token_demo_authenticated',
  isAuthenticated: true,
  isLoading: false,
  error: null,
  savedAddresses: POPULAR_LOCATIONS,
  isDemoMode: true,

  login: async (params: LoginParams) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authService.login(params);
      apiClient.setToken(response.token);
      set({
        user: response.user,
        token: response.token,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (err: any) {
      set({ error: err.message || 'Login failed', isLoading: false });
      throw err;
    }
  },

  register: async (params: RegisterParams) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authService.register(params);
      apiClient.setToken(response.token);
      set({
        user: response.user,
        token: response.token,
        isAuthenticated: !response.requiresOtp,
        isLoading: false,
      });
      return response.requiresOtp;
    } catch (err: any) {
      set({ error: err.message || 'Registration failed', isLoading: false });
      throw err;
    }
  },

  verifyOtp: async (params: VerifyOtpParams) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authService.verifyOtp(params);
      apiClient.setToken(response.token);
      set({
        user: response.user,
        token: response.token,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (err: any) {
      set({ error: err.message || 'OTP verification failed', isLoading: false });
      throw err;
    }
  },

  logout: async () => {
    await authService.logout();
    set({
      user: null,
      token: null,
      isAuthenticated: false,
    });
  },

  quickDemoLogin: () => {
    apiClient.setToken('waya_token_demo_authenticated');
    set({
      user: DEMO_USER,
      token: 'waya_token_demo_authenticated',
      isAuthenticated: true,
      error: null,
    });
  },

  updateUser: (updates) => {
    set((state) => ({
      user: state.user ? { ...state.user, ...updates } : null,
    }));
  },

  addSavedAddress: (address) => {
    const newAddr: SavedAddress = {
      ...address,
      id: `loc_${Date.now()}`,
    };
    set((state) => ({
      savedAddresses: [newAddr, ...state.savedAddresses],
    }));
  },

  removeSavedAddress: (id) => {
    set((state) => ({
      savedAddresses: state.savedAddresses.filter((a) => a.id !== id),
    }));
  },

  setDemoMode: (enabled) => {
    apiClient.setDemoMode(enabled);
    set({ isDemoMode: enabled });
  },
}));
