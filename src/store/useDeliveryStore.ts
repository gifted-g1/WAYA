import { create } from 'zustand';
import { DeliveryOrder, DeliveryStatus, PriceBreakdown, ServiceTier, PackageCategory, PackageSize, LocationPoint } from '../types';
import { INITIAL_DELIVERIES, DEMO_RIDERS, LAGOS_SAMPLE_ROUTE } from '../services/mockData';
import { deliveryService, CreateDeliveryParams } from '../services/deliveryService';

interface DeliveryStoreState {
  deliveries: DeliveryOrder[];
  activeDeliveryId: string | null;
  isCreatingOrder: boolean;
  isMatchingRider: boolean;
  matchingProgress: number; // 0 to 100
  matchingMessage: string;
  trackingRouteIndex: number; // current simulated position on polyline

  // Actions
  getActiveDelivery: () => DeliveryOrder | undefined;
  setActiveDeliveryId: (id: string | null) => void;
  createOrder: (params: CreateDeliveryParams) => Promise<DeliveryOrder>;
  startMatchingSimulation: (orderId: string) => void;
  cancelOrder: (orderId: string) => Promise<void>;
  updateOrderStatus: (orderId: string, status: DeliveryStatus) => void;
  verifyDeliveryOtp: (orderId: string, otp: string) => Promise<boolean>;
  advanceTrackingSimulation: () => void;
  resetDemoOrders: () => void;
}

export const useDeliveryStore = create<DeliveryStoreState>((set, get) => ({
  deliveries: INITIAL_DELIVERIES,
  activeDeliveryId: 'WY-8492-LG', // Pre-select active order for instant tracking preview
  isCreatingOrder: false,
  isMatchingRider: false,
  matchingProgress: 0,
  matchingMessage: 'Scanning nearby dispatch riders in Ikeja GRA...',
  trackingRouteIndex: 4, // Mid-route on Third Mainland Bridge corridor

  getActiveDelivery: () => {
    const { deliveries, activeDeliveryId } = get();
    return deliveries.find((d) => d.id === activeDeliveryId) || deliveries[0];
  },

  setActiveDeliveryId: (id) => {
    set({ activeDeliveryId: id });
  },

  createOrder: async (params) => {
    set({ isCreatingOrder: true });
    try {
      const newOrder = await deliveryService.createDelivery(params);
      set((state) => ({
        deliveries: [newOrder, ...state.deliveries],
        activeDeliveryId: newOrder.id,
        isCreatingOrder: false,
      }));
      return newOrder;
    } catch (err) {
      set({ isCreatingOrder: false });
      throw err;
    }
  },

  startMatchingSimulation: (orderId: string) => {
    set({
      isMatchingRider: true,
      matchingProgress: 10,
      matchingMessage: 'Broadcasting order to nearby Waya dispatch riders...',
    });

    const timers: any[] = [];

    timers.push(
      setTimeout(() => {
        set({
          matchingProgress: 40,
          matchingMessage: '3 riders detected near pickup location. Checking ratings...',
        });
      }, 1200)
    );

    timers.push(
      setTimeout(() => {
        set({
          matchingProgress: 75,
          matchingMessage: 'Rider selected: Babajide Adekunle (4.94★). Confirming route...',
        });
      }, 2400)
    );

    timers.push(
      setTimeout(() => {
        set((state) => {
          const updated = state.deliveries.map((ord) => {
            if (ord.id === orderId) {
              return {
                ...ord,
                status: 'RIDER_ASSIGNED' as DeliveryStatus,
                rider: DEMO_RIDERS[0],
              };
            }
            return ord;
          });
          return {
            deliveries: updated,
            isMatchingRider: false,
            matchingProgress: 100,
            matchingMessage: 'Rider assigned! Babajide is en route to pickup.',
          };
        });
      }, 3600)
    );
  },

  cancelOrder: async (orderId) => {
    await deliveryService.cancelDelivery(orderId);
    set((state) => ({
      deliveries: state.deliveries.map((d) => (d.id === orderId ? { ...d, status: 'CANCELLED' as DeliveryStatus } : d)),
    }));
  },

  updateOrderStatus: (orderId, status) => {
    set((state) => ({
      deliveries: state.deliveries.map((d) => (d.id === orderId ? { ...d, status, updatedAt: new Date().toISOString() } : d)),
    }));
  },

  verifyDeliveryOtp: async (orderId, otp) => {
    const active = get().deliveries.find((d) => d.id === orderId);
    if (!active) return false;

    // Check if OTP matches or demo fallback
    const expectedOtp = active.deliveryOtp.replace('WY-', '').trim();
    const cleanOtp = otp.replace('WY-', '').trim();

    if (cleanOtp === expectedOtp || cleanOtp === '1234' || cleanOtp === '7842') {
      set((state) => ({
        deliveries: state.deliveries.map((d) =>
          d.id === orderId ? { ...d, status: 'DELIVERED' as DeliveryStatus, updatedAt: new Date().toISOString() } : d
        ),
      }));
      return true;
    }
    return false;
  },

  advanceTrackingSimulation: () => {
    set((state) => {
      const active = state.getActiveDelivery();
      if (!active || !active.routeCoordinates || active.routeCoordinates.length === 0) return state;

      const nextIndex = (state.trackingRouteIndex + 1) % active.routeCoordinates.length;
      const coord = active.routeCoordinates[nextIndex];

      let updatedStatus: DeliveryStatus = active.status;
      if (nextIndex >= active.routeCoordinates.length - 2) {
        updatedStatus = 'ARRIVED';
      } else if (nextIndex > 2 && active.status === 'RIDER_ASSIGNED') {
        updatedStatus = 'IN_TRANSIT';
      }

      const updatedDeliveries = state.deliveries.map((d) => {
        if (d.id === active.id) {
          return {
            ...d,
            status: updatedStatus,
            rider: d.rider
              ? {
                  ...d.rider,
                  currentLocation: coord,
                  estimatedArrivalMinutes: Math.max(1, Math.round((active.routeCoordinates!.length - nextIndex) * 2.2)),
                  distanceKm: Math.max(0.4, Math.round((active.routeCoordinates!.length - nextIndex) * 0.8 * 10) / 10),
                }
              : undefined,
          };
        }
        return d;
      });

      return {
        trackingRouteIndex: nextIndex,
        deliveries: updatedDeliveries,
      };
    });
  },

  resetDemoOrders: () => {
    set({
      deliveries: INITIAL_DELIVERIES,
      activeDeliveryId: INITIAL_DELIVERIES[0].id,
      trackingRouteIndex: 4,
    });
  },
}));
