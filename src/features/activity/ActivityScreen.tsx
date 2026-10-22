import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Pressable,
  SafeAreaView,
  StatusBar,
  Modal,
} from 'react-native';
import {
  Search,
  Filter,
  Package,
  RotateCcw,
  CheckCircle2,
  XCircle,
  Clock,
  ChevronRight,
  X,
  Share2,
} from 'lucide-react-native';
import { Colors } from '../../theme/colors';
import { useSettingsStore } from '../../store/useSettingsStore';
import { useDeliveryStore } from '../../store/useDeliveryStore';
import { WayaPatternBackground } from '../../components/cultural/WayaPatternBackground';
import { AfricanPatternDivider } from '../../components/cultural/AfricanPatternDivider';
import { AnimatedDeliveryCard } from '../../components/ui/AnimatedDeliveryCard';
import { WayaEmptyState } from '../../components/ui/WayaEmptyState';
import { WayaPrimaryButton } from '../../components/ui/WayaPrimaryButton';
import { DeliveryOrder } from '../../types';

interface ActivityScreenProps {
  onSelectDelivery: (orderId: string) => void;
  onReorder: (order: DeliveryOrder) => void;
}

export const ActivityScreen: React.FC<ActivityScreenProps> = ({
  onSelectDelivery,
  onReorder,
}) => {
  const { themeMode } = useSettingsStore();
  const isDark = themeMode === 'dark';
  const colors = isDark ? Colors.dark : Colors.light;

  const { deliveries } = useDeliveryStore();

  const [activeTab, setActiveTab] = useState<'active' | 'completed' | 'cancelled'>('active');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<DeliveryOrder | null>(null);

  // Filter deliveries
  const activeOrders = deliveries.filter(
    (d) =>
      d.status === 'CREATED' ||
      d.status === 'SEARCHING_FOR_RIDER' ||
      d.status === 'RIDER_ASSIGNED' ||
      d.status === 'RIDER_ARRIVING' ||
      d.status === 'PICKED_UP' ||
      d.status === 'IN_TRANSIT' ||
      d.status === 'ARRIVED'
  );

  const completedOrders = deliveries.filter((d) => d.status === 'DELIVERED');
  const cancelledOrders = deliveries.filter((d) => d.status === 'CANCELLED');

  const getFilteredList = () => {
    let baseList: DeliveryOrder[] = [];
    if (activeTab === 'active') baseList = activeOrders;
    else if (activeTab === 'completed') baseList = completedOrders;
    else baseList = cancelledOrders;

    if (!searchQuery.trim()) return baseList;

    const q = searchQuery.toLowerCase().trim();
    return baseList.filter(
      (d) =>
        d.trackingNumber.toLowerCase().includes(q) ||
        d.id.toLowerCase().includes(q) ||
        d.destination.addressText.toLowerCase().includes(q) ||
        d.packageDescription.toLowerCase().includes(q)
    );
  };

  const displayList = getFilteredList();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      <WayaPatternBackground variant="ankara" opacity={0.06} />

      {/* Screen Header */}
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>Delivery Activity</Text>
        <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>
          Track ongoing orders and past Nigerian dispatch history
        </Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchRow}>
        <View style={[styles.searchBar, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Search size={18} color={colors.textMuted} />
          <TextInput
            style={[styles.searchInput, { color: colors.textPrimary }]}
            placeholder="Search by tracking code, address..."
            placeholderTextColor={colors.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery ? (
            <Pressable onPress={() => setSearchQuery('')}>
              <X size={16} color={colors.textMuted} />
            </Pressable>
          ) : null}
        </View>
      </View>

      {/* Segmented Filter Tabs */}
      <View style={[styles.tabBar, { backgroundColor: colors.surfaceSubtle, borderColor: colors.border }]}>
        <Pressable
          style={[
            styles.tabBtn,
            activeTab === 'active' && [styles.activeTabBtn, { backgroundColor: colors.surface }],
          ]}
          onPress={() => setActiveTab('active')}
        >
          <Text
            style={[
              styles.tabText,
              { color: activeTab === 'active' ? colors.primary : colors.textMuted },
              activeTab === 'active' && styles.activeTabText,
            ]}
          >
            Active ({activeOrders.length})
          </Text>
        </Pressable>

        <Pressable
          style={[
            styles.tabBtn,
            activeTab === 'completed' && [styles.activeTabBtn, { backgroundColor: colors.surface }],
          ]}
          onPress={() => setActiveTab('completed')}
        >
          <Text
            style={[
              styles.tabText,
              { color: activeTab === 'completed' ? colors.primary : colors.textMuted },
              activeTab === 'completed' && styles.activeTabText,
            ]}
          >
            Completed ({completedOrders.length})
          </Text>
        </Pressable>

        <Pressable
          style={[
            styles.tabBtn,
            activeTab === 'cancelled' && [styles.activeTabBtn, { backgroundColor: colors.surface }],
          ]}
          onPress={() => setActiveTab('cancelled')}
        >
          <Text
            style={[
              styles.tabText,
              { color: activeTab === 'cancelled' ? colors.primary : colors.textMuted },
              activeTab === 'cancelled' && styles.activeTabText,
            ]}
          >
            Cancelled ({cancelledOrders.length})
          </Text>
        </Pressable>
      </View>

      {/* Deliveries List */}
      <ScrollView contentContainerStyle={styles.listContent} showsVerticalScrollIndicator={false}>
        {displayList.length === 0 ? (
          <WayaEmptyState
            type="orders"
            title={`No ${activeTab} deliveries found`}
            description={
              activeTab === 'active'
                ? 'You do not have any orders actively moving right now.'
                : 'No delivery history recorded under this filter.'
            }
          />
        ) : (
          displayList.map((order) => (
            <AnimatedDeliveryCard
              key={order.id}
              order={order}
              onPress={() => setSelectedOrder(order)}
            />
          ))
        )}
      </ScrollView>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <Modal
          visible={!!selectedOrder}
          transparent
          animationType="slide"
          onRequestClose={() => setSelectedOrder(null)}
        >
          <View style={styles.modalOverlay}>
            <View style={[styles.modalSheet, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <View style={styles.modalTopBar}>
                <View>
                  <Text style={[styles.modalOrderCode, { color: colors.textPrimary }]}>
                    {selectedOrder.trackingNumber}
                  </Text>
                  <Text style={[styles.modalDate, { color: colors.textMuted }]}>
                    Created on {new Date(selectedOrder.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                  </Text>
                </View>
                <Pressable onPress={() => setSelectedOrder(null)} style={styles.modalCloseBtn}>
                  <X size={20} color={colors.textPrimary} />
                </Pressable>
              </View>

              <AfricanPatternDivider variant="kente-bars" height={6} style={{ width: '100%', marginVertical: 10 }} />

              <ScrollView showsVerticalScrollIndicator={false}>
                {/* Status Indicator */}
                <View style={[styles.modalStatusPill, { backgroundColor: colors.primaryContainer }]}>
                  <Text style={[styles.modalStatusText, { color: colors.primary }]}>
                    STATUS: {selectedOrder.status.replace(/_/g, ' ')}
                  </Text>
                </View>

                {/* Package Info */}
                <View style={styles.modalSection}>
                  <Text style={[styles.modalSectionTitle, { color: colors.textPrimary }]}>Package Information</Text>
                  <Text style={[styles.modalDesc, { color: colors.textSecondary }]}>
                    {selectedOrder.packageDescription}
                  </Text>
                  <Text style={[styles.modalMeta, { color: colors.textMuted }]}>
                    Size: {selectedOrder.packageSize.replace('_', ' ')} • Tier: {selectedOrder.serviceTier.replace('_', ' ')}
                  </Text>
                </View>

                {/* Pickup & Destination */}
                <View style={styles.modalSection}>
                  <Text style={[styles.modalSectionTitle, { color: colors.textPrimary }]}>Route</Text>
                  <Text style={[styles.modalStopText, { color: colors.textPrimary }]}>
                    📍 Pickup: {selectedOrder.pickup.addressText}
                  </Text>
                  <Text style={[styles.modalStopText, { color: colors.textPrimary, marginTop: 6 }]}>
                    🎯 Destination: {selectedOrder.destination.addressText}
                  </Text>
                </View>

                {/* Fare Breakdown */}
                <View style={[styles.modalSection, styles.fareBox, { backgroundColor: colors.surfaceSubtle }]}>
                  <Text style={[styles.modalSectionTitle, { color: colors.textPrimary }]}>Payment & Fare</Text>
                  <View style={styles.modalFareRow}>
                    <Text style={{ color: colors.textSecondary }}>Base & Distance</Text>
                    <Text style={{ color: colors.textPrimary, fontWeight: '700' }}>
                      ₦{(selectedOrder.price.baseFareNaira + selectedOrder.price.distanceFareNaira).toLocaleString()}
                    </Text>
                  </View>
                  <View style={styles.modalFareRow}>
                    <Text style={{ color: colors.textSecondary }}>Total Fare</Text>
                    <Text style={{ color: colors.primary, fontWeight: '900', fontSize: 16 }}>
                      ₦{selectedOrder.price.totalNaira.toLocaleString('en-NG')}
                    </Text>
                  </View>
                </View>
              </ScrollView>

              {/* Actions Footer */}
              <View style={styles.modalActionsRow}>
                {selectedOrder.status !== 'DELIVERED' && selectedOrder.status !== 'CANCELLED' ? (
                  <WayaPrimaryButton
                    title="Open Live Tracking"
                    onPress={() => {
                      const id = selectedOrder.id;
                      setSelectedOrder(null);
                      onSelectDelivery(id);
                    }}
                    variant="primary"
                    style={{ flex: 1 }}
                  />
                ) : (
                  <WayaPrimaryButton
                    title="Repeat / Send Again"
                    onPress={() => {
                      const ord = selectedOrder;
                      setSelectedOrder(null);
                      onReorder(ord);
                    }}
                    variant="primary"
                    icon={<RotateCcw size={18} color="#FFFFFF" />}
                    style={{ flex: 1 }}
                  />
                )}
              </View>
            </View>
          </View>
        </Modal>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '900',
  },
  headerSubtitle: {
    fontSize: 13,
    marginTop: 2,
  },
  searchRow: {
    paddingHorizontal: 20,
    marginTop: 8,
    marginBottom: 10,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 14,
    borderWidth: 1,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
  },
  tabBar: {
    flexDirection: 'row',
    marginHorizontal: 20,
    padding: 4,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 12,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeTabBtn: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  tabText: {
    fontSize: 12,
    fontWeight: '600',
  },
  activeTabText: {
    fontWeight: '800',
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    gap: 10,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.65)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderTopWidth: 1,
    padding: 24,
    maxHeight: '80%',
  },
  modalTopBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalOrderCode: {
    fontSize: 18,
    fontWeight: '900',
  },
  modalDate: {
    fontSize: 12,
    marginTop: 2,
  },
  modalCloseBtn: {
    padding: 6,
  },
  modalStatusPill: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    marginVertical: 10,
  },
  modalStatusText: {
    fontSize: 11,
    fontWeight: '800',
  },
  modalSection: {
    marginBottom: 16,
  },
  modalSectionTitle: {
    fontSize: 14,
    fontWeight: '800',
    marginBottom: 4,
  },
  modalDesc: {
    fontSize: 13,
    lineHeight: 18,
  },
  modalMeta: {
    fontSize: 11,
    marginTop: 4,
  },
  modalStopText: {
    fontSize: 13,
    lineHeight: 18,
  },
  fareBox: {
    padding: 12,
    borderRadius: 14,
  },
  modalFareRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 3,
  },
  modalActionsRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 14,
  },
});
