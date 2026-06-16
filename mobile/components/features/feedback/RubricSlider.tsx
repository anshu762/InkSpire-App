import React, { useState } from 'react';
import { View, Text, StyleSheet, LayoutChangeEvent, AccessibilityInfo } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { useSharedValue, useAnimatedStyle, runOnJS, withSpring } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

interface RubricSliderProps {
  label: string;
  value: number;
  onValueChange: (value: number) => void;
  min?: number;
  max?: number;
}

const getLabelForValue = (val: number) => {
  if (val <= 1) return 'Needs work';
  if (val <= 2) return 'Fair';
  if (val <= 3) return 'Solid';
  if (val <= 4) return 'Good';
  return 'Excellent';
};

export function RubricSlider({ label, value, onValueChange, min = 1, max = 5 }: RubricSliderProps) {
  const [width, setWidth] = useState(0);
  const translateX = useSharedValue(0);

  // Initialize position
  React.useEffect(() => {
    if (width > 0) {
      const stepWidth = width / (max - min);
      translateX.value = (value - min) * stepWidth;
    }
  }, [width, value, min, max, translateX]);

  const onLayout = (e: LayoutChangeEvent) => {
    setWidth(e.nativeEvent.layout.width);
  };

  const handleValueChange = (newVal: number) => {
    if (newVal !== value) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      onValueChange(newVal);
      AccessibilityInfo.announceForAccessibility(`${label} set to ${newVal}, ${getLabelForValue(newVal)}`);
    }
  };

  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      if (width === 0) return;
      let newX = event.x;
      if (newX < 0) newX = 0;
      if (newX > width) newX = width;
      
      translateX.value = newX;
      
      const stepWidth = width / (max - min);
      const rawValue = min + (newX / stepWidth);
      const roundedValue = Math.round(rawValue);
      const clampedValue = Math.max(min, Math.min(max, roundedValue));
      
      runOnJS(handleValueChange)(clampedValue);
    })
    .onEnd(() => {
      if (width === 0) return;
      const stepWidth = width / (max - min);
      const snappedX = (value - min) * stepWidth;
      translateX.value = withSpring(snappedX, { damping: 20, stiffness: 200 });
    });

  const thumbStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }]
  }));

  const activeTrackStyle = useAnimatedStyle(() => ({
    width: translateX.value
  }));

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.valueText}>{value}/{max} - {getLabelForValue(value)}</Text>
      </View>
      
      <GestureDetector gesture={panGesture}>
        <View style={styles.trackContainer} onLayout={onLayout} accessible={true} accessibilityRole="adjustable" accessibilityValue={{ min, max, now: value }} accessibilityLabel={`${label} slider`}>
          <View style={styles.track} />
          <Animated.View style={[styles.activeTrack, activeTrackStyle]} />
          <Animated.View style={[styles.thumb, thumbStyle]} />
        </View>
      </GestureDetector>
      
      <View style={styles.ticksContainer}>
        {Array.from({ length: max - min + 1 }).map((_, i) => (
          <View key={i} style={styles.tick} />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#334155', // slate-700
  },
  valueText: {
    fontSize: 14,
    color: '#64748b', // slate-500
    fontWeight: '500',
  },
  trackContainer: {
    height: 40,
    justifyContent: 'center',
    position: 'relative',
  },
  track: {
    height: 6,
    backgroundColor: '#e2e8f0', // slate-200
    borderRadius: 3,
    width: '100%',
    position: 'absolute',
  },
  activeTrack: {
    height: 6,
    backgroundColor: '#8b5cf6', // brand purple
    borderRadius: 3,
    position: 'absolute',
  },
  thumb: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#8b5cf6',
    position: 'absolute',
    left: -12, // center the thumb over the actual value
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  ticksContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 12, // half thumb width
    marginTop: -2,
  },
  tick: {
    width: 2,
    height: 6,
    backgroundColor: '#cbd5e1',
    borderRadius: 1,
  }
});
