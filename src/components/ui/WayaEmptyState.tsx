import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { PackageOpen, Compass, BellOff, MapPinOff } from 'lucide-react-native';
import { Colors } from '../../theme/colors';
import { useSettingsStore } from '../../store/useSettingsStore';
import { WayaPrimaryButton } from './WayaPrimaryButton';
import { AfricanPatternDivider } from '../cultural/AfricanPatternDivider';

interface WayaEmptyStateProps {
  type?: 'orders' | 'tracking' | 'notifications' | 'saved_addresses';
  title?: string;
  description?: string;
  actionTitle?: string;
  onAction?: () => void;
}

export const WayaEmptyState: React.FC<WayaEmptyStateProps> = ({
  type = 'orders',
  title,
  description,
  actionTitle,
  onAction,
}) => {
  const { themeMode } = useSettingsStore();
  const isDark = themeMode === 'dark';
  const colors = isDark ? Colors.dark : Colors.light;

  const getDefaultContent = () => {
    switch (type) {
      case 'tracking':
        return {
          icon: <Compass size={56} color={colors.accent} />,
          title: 'No Active Delivery Right Now',
          description:
            'You do not have any delivery on the move currently. Send a parcel or track an existing order by code.',
          actionTitle: 'Send a Package',
        };
      case 'notifications':
        return {
          icon: <BellOff size={56} color={colors.gold} />,
          title: 'All Caught Up!',
          description: 'No new notifications right now. Important rider updates will appear here.',
          actionTitle: 'Back to Home',
        };
      case 'saved_addresses':
        return {
          icon: <MapPinOff size={56} color={colors.primary} />,
          title: 'No Saved Addresses',
          description: 'Save frequently used locations (Home, Work, Mum’s Store) for 1-tap deliveries.',
          actionTitle: 'Add Address',
        };
      case 'orders':
      default:
        return {
          icon: <PackageOpen size={56} color={colors.primary} />,
          title: 'No Delivery Orders Yet',
          description:
            'Need to send documents to the island or groceries to the mainland? Waya riders are on standby.',
          actionTitle: 'Book Your First Delivery',
        };
    }
  };

  const defaultContent = getDefaultContent();
  const displayTitle = title || defaultContent.title;
  const displayDescription = description || defaultContent.description;
  const displayActionTitle = actionTitle || defaultContent.actionTitle;

  return (
    <View style={styles.container}>
      <View style={[styles.iconCircle, { backgroundColor: colors.surfaceSubtle }]}>
        {defaultContent.icon}
      </View>

      <Text style={[styles.title, { color: colors.textPrimary }]}>{displayTitle}</Text>
      <Text style={[styles.description, { color: colors.textSecondary }]}>
        {displayDescription}
      </Text>

      <AfricanPatternDivider height={6} style={{ width: 140, marginVertical: 16 }} />

      {onAction && (
        <WayaPrimaryButton
          title={displayActionTitle}
          onPress={onAction}
          variant="primary"
          size="md"
          style={{ minWidth: 200, marginTop: 4 }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  iconCircle: {
    width: 104,
    height: 104,
    borderRadius: 52,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    lineHeight: 21,
    textAlign: 'center',
    maxWidth: 290,
  },
});
