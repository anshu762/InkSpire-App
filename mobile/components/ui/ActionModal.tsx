import React, { useEffect, useRef, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { BottomSheetModal, BottomSheetBackdrop, BottomSheetView } from '@gorhom/bottom-sheet';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

export interface ActionOption {
  label: string;
  icon?: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
  destructive?: boolean;
}

interface ActionModalProps {
  visible: boolean;
  title?: string;
  options: ActionOption[];
  onClose: () => void;
}

export function ActionModal({ visible, title, options, onClose }: ActionModalProps) {
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  useEffect(() => {
    if (visible) {
      bottomSheetModalRef.current?.present();
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } else {
      bottomSheetModalRef.current?.dismiss();
    }
  }, [visible]);

  const handleSheetChanges = useCallback((index: number) => {
    if (index === -1 && visible) {
      // The user swiped it down or tapped the backdrop to close it
      onClose();
    }
  }, [visible, onClose]);

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        onPress={onClose}
      />
    ),
    [onClose]
  );

  return (
    <BottomSheetModal
      ref={bottomSheetModalRef}
      onChange={handleSheetChanges}
      backdropComponent={renderBackdrop}
      enableDynamicSizing={true}
      handleIndicatorStyle={styles.dragHandle}
      backgroundStyle={styles.backgroundStyle}
    >
      <BottomSheetView style={styles.container}>
        {title && <Text style={styles.title}>{title}</Text>}
        
        <View style={styles.optionsContainer}>
          {options.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.optionButton, index < options.length - 1 && styles.borderBottom]}
              activeOpacity={0.7}
              onPress={() => {
                Haptics.selectionAsync();
                onClose();
                setTimeout(option.onPress, 100);
              }}
            >
              {option.icon && (
                <Ionicons
                  name={option.icon}
                  size={22}
                  color={option.destructive ? '#ef4444' : '#374151'}
                  style={styles.icon}
                />
              )}
              <Text style={[styles.optionText, option.destructive && styles.destructiveText]}>
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.cancelButton} activeOpacity={0.7} onPress={onClose}>
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>
      </BottomSheetView>
    </BottomSheetModal>
  );
}

const styles = StyleSheet.create({
  backgroundStyle: {
    backgroundColor: '#f3f4f6',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  container: {
    paddingHorizontal: 16,
    paddingBottom: 32, // safe area padding
    paddingTop: 12,
  },
  dragHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#d1d5db',
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 8,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 16,
  },
  optionsContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: '#ffffff',
  },
  borderBottom: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#e5e7eb',
  },
  icon: {
    marginRight: 16,
  },
  optionText: {
    fontSize: 17,
    color: '#374151',
    fontWeight: '500',
  },
  destructiveText: {
    color: '#ef4444',
  },
  cancelButton: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
  },
  cancelText: {
    fontSize: 17,
    fontWeight: '600',
    color: '#4f46e5',
  },
});
