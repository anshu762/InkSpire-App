import React, { useEffect, useState } from 'react';
import { StyleSheet, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  withDelay,
  Easing,
  runOnJS,
} from 'react-native-reanimated';
import * as SplashScreen from 'expo-splash-screen';
import { LinearGradient } from 'expo-linear-gradient';

interface AnimatedSplashScreenProps {
  onAnimationComplete: () => void;
}

const { width, height } = Dimensions.get('window');

// Keep the splash screen visible while we load resources
SplashScreen.preventAutoHideAsync().catch(() => {});

export function AnimatedSplashScreen({ onAnimationComplete }: AnimatedSplashScreenProps) {
  const [isAppReady, setAppReady] = useState(false);
  const opacity = useSharedValue(1);
  const logoScale = useSharedValue(0.8);
  const logoOpacity = useSharedValue(0);

  useEffect(() => {
    // Simulate loading resources (fonts, auth state, etc.)
    // In a real app, you would wait for your fonts and assets to load here.
    const prepare = async () => {
      try {
        // Mock loading delay to ensure smooth transition from native splash
        await new Promise(resolve => setTimeout(resolve, 500));
      } catch (e) {
        console.warn(e);
      } finally {
        setAppReady(true);
      }
    };
    prepare();
  }, []);

  useEffect(() => {
    if (isAppReady) {
      // 1. Hide native splash screen
      SplashScreen.hideAsync().catch(() => {});

      // 2. Start animation sequence
      logoOpacity.value = withTiming(1, { duration: 600 });
      logoScale.value = withSequence(
        withTiming(1.05, { duration: 600, easing: Easing.out(Easing.back(1.5)) }),
        withTiming(1, { duration: 300, easing: Easing.ease }),
        withDelay(
          500, // hold for a moment
          withTiming(1.5, { duration: 400 }) // zoom in slightly before fading out
        )
      );

      opacity.value = withDelay(
        1400, // total time before fading out the whole splash screen
        withTiming(0, { duration: 400, easing: Easing.inOut(Easing.ease) }, (finished) => {
          if (finished) {
            runOnJS(onAnimationComplete)();
          }
        })
      );
    }
  }, [isAppReady]);

  const containerStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    pointerEvents: opacity.value === 0 ? 'none' : 'auto',
  }));

  const logoStyle = useAnimatedStyle(() => ({
    opacity: logoOpacity.value,
    transform: [{ scale: logoScale.value }],
  }));

  return (
    <Animated.View style={[StyleSheet.absoluteFill, styles.container, containerStyle]}>
      <LinearGradient
        colors={['#0f0f1a', '#1a1a2e', '#0f0f1a']}
        style={StyleSheet.absoluteFill}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />
      <Animated.Image
        source={require('../../assets/icon.png')}
        style={[styles.logo, logoStyle]}
        resizeMode="contain"
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
  },
  logo: {
    width: 200,
    height: 200,
  },
});
