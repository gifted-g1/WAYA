export type NotificationType =
  | 'RIDER_ASSIGNED'
  | 'RIDER_ARRIVED'
  | 'PICKED_UP'
  | 'IN_TRANSIT'
  | 'DELIVERED'
  | 'WALLET_CREDITED'
  | 'PROMOTION';

export interface NotificationItem {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  deliveryId?: string;
}
