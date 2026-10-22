export interface UserProfile {
  id: string;
  fullName: string;
  phoneNumber: string; // Nigerian format, e.g. "+234 803 123 4567"
  email: string;
  avatarUrl?: string;
  verified: boolean;
  walletBalanceNaira: number;
  homeAddress?: string;
  officeAddress?: string;
  createdAt: string;
}

export interface SavedAddress {
  id: string;
  title: string; // "Home", "Work / Tech Hub", "Mum's Store"
  addressText: string;
  city: string; // "Lagos", "Abuja", "Ibadan"
  landmark?: string;
  latitude: number;
  longitude: number;
  recipientName?: string;
  recipientPhone?: string;
  isDefault?: boolean;
}

export interface AuthState {
  user: UserProfile | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}
