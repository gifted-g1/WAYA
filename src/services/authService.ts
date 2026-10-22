import { apiClient } from './apiClient';
import { UserProfile } from '../types';
import { DEMO_USER } from './mockData';

export interface LoginParams {
  phoneNumber: string; // "+234 803 456 7890"
  password?: string;
}

export interface RegisterParams {
  fullName: string;
  phoneNumber: string;
  email: string;
  password?: string;
}

export interface VerifyOtpParams {
  phoneNumber: string;
  otpCode: string;
}

export const authService = {
  async login(params: LoginParams): Promise<{ user: UserProfile; token: string }> {
    if (apiClient.getIsDemoMode()) {
      // Simulate brief network latency
      await new Promise((resolve) => setTimeout(resolve, 600));
      return {
        user: { ...DEMO_USER, phoneNumber: params.phoneNumber },
        token: 'waya_jwt_demo_token_xyz9812',
      };
    }

    return apiClient.request('/auth/login', {
      method: 'POST',
      body: params,
    });
  },

  async register(params: RegisterParams): Promise<{ user: UserProfile; token: string; requiresOtp: boolean }> {
    if (apiClient.getIsDemoMode()) {
      await new Promise((resolve) => setTimeout(resolve, 700));
      const user: UserProfile = {
        ...DEMO_USER,
        fullName: params.fullName,
        phoneNumber: params.phoneNumber,
        email: params.email,
        verified: false,
      };
      return {
        user,
        token: 'waya_jwt_demo_token_new_user',
        requiresOtp: true,
      };
    }

    return apiClient.request('/auth/register', {
      method: 'POST',
      body: params,
    });
  },

  async sendOtp(phoneNumber: string): Promise<{ success: boolean; message: string }> {
    if (apiClient.getIsDemoMode()) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      return {
        success: true,
        message: `OTP sent to ${phoneNumber}. Demo code is 1234.`,
      };
    }

    return apiClient.request('/auth/otp/send', {
      method: 'POST',
      body: { phoneNumber },
    });
  },

  async verifyOtp(params: VerifyOtpParams): Promise<{ verified: boolean; user: UserProfile; token: string }> {
    if (apiClient.getIsDemoMode()) {
      await new Promise((resolve) => setTimeout(resolve, 600));
      return {
        verified: true,
        user: { ...DEMO_USER, phoneNumber: params.phoneNumber, verified: true },
        token: 'waya_jwt_demo_token_verified',
      };
    }

    return apiClient.request('/auth/otp/verify', {
      method: 'POST',
      body: params,
    });
  },

  async logout(): Promise<void> {
    apiClient.setToken(null);
  },
};
