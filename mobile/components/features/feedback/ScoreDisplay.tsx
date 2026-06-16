import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withDelay } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';

interface ScoreDisplayProps {
  score: number;
  maxScore?: number;
  size?: number;
  color?: string;
  inactiveColor?: string;
}

export function ScoreDisplay({ 
  score, 
  maxScore = 5, 
  size = 16, 
  color = '#8b5cf6', // Brand purple
  inactiveColor = '#e2e8f0' 
}: ScoreDisplayProps) {
  
  return (
    <View style={styles.container}>
      {Array.from({ length: maxScore }).map((_, index) => (
        <StarItem 
          key={index} 
          index={index} 
          isActive={index < score} 
          size={size} 
          color={color} 
          inactiveColor={inactiveColor} 
        />
      ))}
    </View>
  );
}

function StarItem({ index, isActive, size, color, inactiveColor }: { index: number, isActive: boolean, size: number, color: string, inactiveColor: string }) {
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.5);

  useEffect(() => {
    opacity.value = withDelay(index * 100, withTiming(1, { duration: 300 }));
    scale.value = withDelay(index * 100, withTiming(1, { duration: 300 }));
  }, [index, opacity, scale]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }]
  }));

  return (
    <Animated.View style={[animatedStyle, { marginHorizontal: 2 }]}>
      <Ionicons 
        name={isActive ? 'star' : 'star-outline'} 
        size={size} 
        color={isActive ? color : inactiveColor} 
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  }
});
