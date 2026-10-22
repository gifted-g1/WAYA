import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import {
  Bell,
  CheckCheck,
  Bike,
  Package,
  Wallet,
  Sparkles,
  ArrowRight,
  Clock,
  Trash2,
} from 'lucide-react-native';
import { Colors } from '../../theme/colors';
import { useSettingsStore } from '../../store/useSettingsStore';
import { useNotificationStore } from '../../store/useNotificationStore';
import { WayaPatternBackground } from '../../components/cultural/WayaPatternBackground';
import { AfricanPatternDivider } from '../../components/cultural/AfricanPatternDivider';
import { WayaEmptyState } from '../../components/ui/WayaEmptyState';
import { NotificationType } from '../../types';

interface NotificationsScreenProps {
  onSelectDelivery: (deliveryId: string) => void;
  onBack: () => void;
}

export const NotificationsScreen: React.FC<NotificationsScreenProps> = ({
  onSelectDelivery,
  onBack,
}) => {
  const { themeMode } = useSettingsStore();
  const isDark = themeMode === 'dark';
  const colors = isDark ? Colors.dark : Colors.light;

  const { notifications, unreadCount, markAsRead, markAllAsRead, deleteNotification } =
    useNotificationStore();

  const getNotifIcon = (type: NotificationType) => {
    switch (type) {
      case 'RIDER_ASSIGNED':
      case 'RIDER_ARRIVED':
        return <Bike size={20} color={colors.primary} />;
      case 'PICKED_UP':
      case 'IN_TRANSIT':
        return <Package size={20} color={colors.accent} />;
      case 'DELIVERED':
        return <Package size={20} color={colors.success} />;
      case 'WALLET_CREDITED':
        return <Wallet size={20} color={colors.goldDark} />;
      case 'PROMOTION':
      default:
        return <Sparkles size={20} color={colors.goldDark} />;
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      <WayaPatternBackground variant="adire" opacity={0.06} />

      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>Notifications</Text>
          <Text style={[styles.headerSub, { color: colors.textSecondary }]}>
            {unreadCount > 0 ? `${unreadCount} unread alert${unreadCount > 1 ? 's' : ''}` : 'All caught up'}
          </Text>
        </View>

        {unreadCount > 0 && (
          <Pressable onPress={markAllAsRead} style={styles.markAllBtn}>
            <CheckCheck size={16} color={colors.primary} />
            <Text style={[styles.markAllText, { color: colors.primary }]}>Mark all as read</Text>
          </Pressable>
        )}
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {notifications.length === 0 ? (
          <WayaEmptyState
            type="notifications"
            onAction={onBack}
            actionTitle="Back to Dashboard"
          />
        ) : (
          notifications.map((item) => (
            <Pressable
              key={item.id}
              style={[
                styles.notifCard,
                {
                  backgroundColor: colors.surface,
                  borderColor: item.read ? colors.border : colors.primary,
                  borderLeftWidth: item.read ? 1 : 4,
                  borderLeftColor: item.read ? colors.border : colors.accent,
                },
              ]}
              onPress={() => {
                markAsRead(item.id);
                if (item.deliveryId) {
                  onSelectDelivery(item.deliveryId);
                }
              }}
            >
              <View style={[styles.iconBox, { backgroundColor: colors.surfaceSubtle }]}>
                {getNotifIcon(item.type)}
              </View>

              <View style={styles.contentBox}>
                <View style={styles.titleRow}>
                  <Text style={[styles.title, { color: colors.textPrimary }]}>{item.title}</Text>
                  {!item.read && <View style={[styles.unreadDot, { backgroundColor: colors.accent }]} />}
                </View>
                <Text style={[styles.message, { color: colors.textSecondary }]}>{item.message}</Text>
                <View style={styles.footerRow}>
                  <View style={styles.timeRow}>
                    <Clock size={12} color={colors.textMuted} />
                    <Text style={[styles.timestamp, { color: colors.textMuted }]}>{item.timestamp}</Text>
                  </View>
                  {item.deliveryId && (
                    <Text style={[styles.actionTag, { color: colors.primary }]}>
                      Track Order →
                    </Text>
                  )}
                </View>
              </View>

              <Pressable onPress={() => deleteNotification(item.id)} style={styles.trashBtn}>
                <Trash2 size={14} color={colors.textMuted} />
              </Pressable>
            </Pressable>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '900',
  },
  headerSub: {
    fontSize: 13,
    marginTop: 2,
  },
  markAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  markAllText: {
    fontSize: 12,
    fontWeight: '700',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    gap: 12,
  },
  notifCard: {
    flexDirection: 'row',
    padding: 14,
    borderRadius: 18,
    borderWidth: 1,
    alignItems: 'flex-start',
    gap: 12,
  },
  iconBox: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentBox: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  title: {
    fontSize: 14,
    fontWeight: '800',
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  message: {
    fontSize: 12,
    lineHeight: 18,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  timestamp: {
    fontSize: 11,
  },
  actionTag: {
    fontSize: 11,
    fontWeight: '700',
  },
  trashBtn: {
    padding: 4,
  },
});
