import React, { useRef, useState } from 'react';
import {
  View,
  StyleSheet,
  Animated,
  PanResponder,
  Dimensions,
  Modal,
  Pressable,
} from 'react-native';
import { Colors } from '../../theme/colors';
import { useSettingsStore } from '../../store/useSettingsStore';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

interface WayaBottomSheetProps {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
  snapHeight?: number; // Height in px or default ~55% of screen
  maxHeight?: number;
}

export const WayaBottomSheet: React.FC<WayaBottomSheetProps> = ({
  visible,
  onClose,
  children,
  snapHeight = SCREEN_HEIGHT * 0.6,
  maxHeight = SCREEN_HEIGHT * 0.88,
}) => {
  const { themeMode, isReducedMotion } = useSettingsStore();
  const isDark = themeMode === 'dark';
  const colors = isDark ? Colors.dark : Colors.light;

  const translateY = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const [sheetHeight, setSheetHeight] = useState(snapHeight);

  React.useEffect(() => {
    if (visible) {
      if (isReducedMotion) {
        translateY.setValue(0);
      } else {
        Animated.spring(translateY, {
          toValue: 0,
          friction: 8,
          tension: 65,
          useNativeDriver: true,
        }).start();
      }
    } else {
      if (isReducedMotion) {
        translateY.setValue(SCREEN_HEIGHT);
      } else {
        Animated.timing(translateY, {
          toValue: SCREEN_HEIGHT,
          duration: 250,
          useNativeDriver: true,
        }).start();
      }
    }
  }, [visible, isReducedMotion]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dy > 0) {
          translateY.setValue(gestureState.dy);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > 120 || gestureState.vy > 0.6) {
          Animated.timing(translateY, {
            toValue: SCREEN_HEIGHT,
            duration: 200,
            useNativeDriver: true,
          }).start(onClose);
        } else {
          Animated.spring(translateY, {
            toValue: 0,
            friction: 7,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  if (!visible) return null;

  return (
    <Modal transparent visible={visible} animationType="none" onRequestClose={onClose}>
      <View style={styles.overlay}>
        {/* Backdrop */}
        <Pressable style={[StyleSheet.absoluteFill, { backgroundColor: colors.backdrop }]} onPress={onClose} />

        {/* Draggable Sheet */}
        <Animated.View
          style={[
            styles.sheet,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
              height: sheetHeight,
              maxHeight,
              transform: [{ translateY }],
            },
          ]}
        >
          {/* Grab Handle Bar */}
          <View {...panResponder.panHandlers} style={styles.handleContainer}>
            <View style={[styles.handleBar, { backgroundColor: colors.textMuted }]} />
            <View style={[styles.handleAccentDot, { backgroundColor: colors.accent }]} />
          </View>

          {/* Sheet Contents */}
          <View style={styles.contentContainer}>{children}</View>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  sheet: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -6 },
    shadowOpacity: 0.18,
    shadowRadius: 18,
    elevation: 20,
    overflow: 'hidden',
  },
  handleContainer: {
    width: '100%',
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 6,
  },
  handleBar: {
    width: 44,
    height: 5,
    borderRadius: 3,
  },
  handleAccentDot: {
    width: 6,
    height: 5,
    borderRadius: 2.5,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
});
