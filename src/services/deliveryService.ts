import { apiClient } from './apiClient';
import {
  DeliveryOrder,
  DeliveryStatus,
  LocationPoint,
  PackageCategory,
  PackageSize,
  PriceBreakdown,
  ServiceTier,
} from '../types';
import { INITIAL_DELIVERIES, DEMO_RIDERS, LAGOS_SAMPLE_ROUTE } from './mockData';

export interface CreateDeliveryParams {
  pickup: LocationPoint;
  destination: LocationPoint;
  category: PackageCategory;
  packageSize: PackageSize;
  packageDescription: string;
  serviceTier: ServiceTier;
  paymentMethod: 'Waya Wallet' | 'Debit Card (Paystack/Flutterwave)' | 'Pay on Pickup';
  deliveryInstructions?: string;
  isFragile?: boolean;
}

export const deliveryService = {
  calculateFare(
    pickup: LocationPoint,
    destination: LocationPoint,
    category: PackageCategory,
    packageSize: PackageSize,
    serviceTier: ServiceTier
  ): PriceBreakdown {
    // Haversine approximation for Nigerian urban routes
    const dLat = (destination.latitude - pickup.latitude) * 111;
    const dLng = (destination.longitude - pickup.longitude) * 111;
    const linearDist = Math.sqrt(dLat * dLat + dLng * dLng);
    // City road multiplier
    const distanceKm = Math.max(1.8, Math.round(linearDist * 1.35 * 10) / 10);

    let baseFareNaira = 900;
    let perKmRate = 140;

    if (serviceTier === 'waya_swift') {
      baseFareNaira = 1400;
      perKmRate = 180;
    } else if (serviceTier === 'eco_saver') {
      baseFareNaira = 750;
      perKmRate = 110;
    }

    let sizeMultiplier = 1.0;
    if (packageSize === 'small_box') sizeMultiplier = 1.15;
    if (packageSize === 'medium_box') sizeMultiplier = 1.35;
    if (packageSize === 'large_box') sizeMultiplier = 1.7;
    if (packageSize === 'bulk') sizeMultiplier = 2.2;

    const distanceFareNaira = Math.round(distanceKm * perKmRate);
    const weightSurgeNaira = Math.round(baseFareNaira * (sizeMultiplier - 1.0));
    const serviceFeeNaira = 150;
    const discountNaira = 0;
    const totalNaira = baseFareNaira + distanceFareNaira + weightSurgeNaira + serviceFeeNaira - discountNaira;

    // Traffic aware estimated minutes in Nigerian cities
    const estimatedMinutes = Math.max(15, Math.round(distanceKm * 2.8 + 6));

    return {
      baseFareNaira,
      distanceFareNaira,
      weightSurgeNaira,
      serviceFeeNaira,
      discountNaira,
      totalNaira,
      distanceKm,
      estimatedMinutes,
    };
  },

  async createDelivery(params: CreateDeliveryParams): Promise<DeliveryOrder> {
    if (apiClient.getIsDemoMode()) {
      await new Promise((resolve) => setTimeout(resolve, 800));

      const price = this.calculateFare(
        params.pickup,
        params.destination,
        params.category,
        params.packageSize,
        params.serviceTier
      );

      const randomIdSuffix = Math.floor(1000 + Math.random() * 9000);
      const newOrder: DeliveryOrder = {
        id: `WY-${randomIdSuffix}-LG`,
        trackingNumber: `WY-${randomIdSuffix}`,
        pickupOtp: String(Math.floor(1000 + Math.random() * 9000)),
        deliveryOtp: `WY-${Math.floor(1000 + Math.random() * 9000)}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        status: 'SEARCHING_FOR_RIDER',
        category: params.category,
        packageSize: params.packageSize,
        packageDescription: params.packageDescription || 'General package delivery',
        serviceTier: params.serviceTier,
        pickup: params.pickup,
        destination: params.destination,
        price,
        paymentMethod: params.paymentMethod,
        paymentStatus: 'PAID',
        deliveryInstructions: params.deliveryInstructions,
        isFragile: params.isFragile,
        routeCoordinates: LAGOS_SAMPLE_ROUTE,
      };

      return newOrder;
    }

    return apiClient.request('/deliveries', {
      method: 'POST',
      body: params,
    });
  },

  async getDeliveries(): Promise<DeliveryOrder[]> {
    if (apiClient.getIsDemoMode()) {
      await new Promise((resolve) => setTimeout(resolve, 400));
      return INITIAL_DELIVERIES;
    }

    return apiClient.request('/deliveries', {
      method: 'GET',
    });
  },

  async getDeliveryById(id: string): Promise<DeliveryOrder | undefined> {
    if (apiClient.getIsDemoMode()) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      return INITIAL_DELIVERIES.find((d) => d.id === id);
    }

    return apiClient.request(`/deliveries/${id}`, {
      method: 'GET',
    });
  },

  async cancelDelivery(id: string, reason?: string): Promise<{ success: boolean; message: string }> {
    if (apiClient.getIsDemoMode()) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      return {
        success: true,
        message: 'Delivery order cancelled. Any paid funds have been refunded to your Waya Wallet.',
      };
    }

    return apiClient.request(`/deliveries/${id}/cancel`, {
      method: 'POST',
      body: { reason },
    });
  },

  async verifyDeliveryOtp(id: string, otp: string): Promise<{ verified: boolean; message: string }> {
    if (apiClient.getIsDemoMode()) {
      await new Promise((resolve) => setTimeout(resolve, 600));
      return {
        verified: true,
        message: 'Delivery verified successfully! Thank you for using Waya.',
      };
    }

    return apiClient.request(`/deliveries/${id}/verify-otp`, {
      method: 'POST',
      body: { otp },
    });
  },
};
