import { Rider } from './rider';

export type DeliveryStatus =
  | 'CREATED'
  | 'SEARCHING_FOR_RIDER'
  | 'RIDER_ASSIGNED'
  | 'RIDER_ARRIVING'
  | 'PICKED_UP'
  | 'IN_TRANSIT'
  | 'ARRIVED'
  | 'DELIVERED'
  | 'CANCELLED';

export type PackageCategory =
  | 'documents'
  | 'food'
  | 'groceries'
  | 'packages'
  | 'fragile'
  | 'express';

export type PackageSize =
  | 'envelope'
  | 'small_box'
  | 'medium_box'
  | 'large_box'
  | 'bulk';

export type ServiceTier = 'waya_swift' | 'standard' | 'eco_saver';

export interface LocationPoint {
  latitude: number;
  longitude: number;
  addressText: string;
  landmark?: string;
  contactName?: string;
  contactPhone?: string;
}

export interface PriceBreakdown {
  baseFareNaira: number;
  distanceFareNaira: number;
  weightSurgeNaira: number;
  serviceFeeNaira: number;
  discountNaira: number;
  totalNaira: number;
  distanceKm: number;
  estimatedMinutes: number;
}

export interface DeliveryOrder {
  id: string; // e.g. "WY-9824-LG"
  trackingNumber: string; // "WY-7842"
  pickupOtp: string; // "3821"
  deliveryOtp: string; // "WY-8492" (Secure OTP handed to rider)
  createdAt: string;
  updatedAt: string;
  status: DeliveryStatus;
  category: PackageCategory;
  packageSize: PackageSize;
  packageDescription: string;
  serviceTier: ServiceTier;
  pickup: LocationPoint;
  destination: LocationPoint;
  price: PriceBreakdown;
  paymentMethod: 'Waya Wallet' | 'Debit Card (Paystack/Flutterwave)' | 'Pay on Pickup';
  paymentStatus: 'PAID' | 'PENDING' | 'REFUNDED';
  rider?: Rider;
  deliveryInstructions?: string;
  isFragile?: boolean;
  routeCoordinates?: Array<{ latitude: number; longitude: number }>;
}
