import { View, Image, StyleSheet, Dimensions } from 'react-native';
import React, { useEffect } from 'react';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  withSequence,
  Easing
} from 'react-native-reanimated';
import Colors from '@/constants/Colors';

const { width, height } = Dimensions.get('window');

export default function AppSplashScreen({ onFinish }) {
  const logoOpacity = useSharedValue(0);
  const logoScale = useSharedValue(0.5);
  const backgroundOpacity = useSharedValue(0);

  useEffect(() => {
    const startAnimation = () => {
      // Background fade in
      backgroundOpacity.value = withTiming(1, { duration: 500 });

      // Logo animation
      logoOpacity.value = withTiming(1, { duration: 800, easing: Easing.out(Easing.ease) });
      logoScale.value = withSequence(
        withTiming(1.1, { duration: 600, easing: Easing.out(Easing.ease) }),
        withTiming(1, { duration: 200, easing: Easing.out(Easing.ease) })
      );

      // Finish after 2.5 seconds
      setTimeout(() => {
        onFinish();
      }, 2500);
    };

    startAnimation();
  }, [onFinish]);

  const backgroundStyle = useAnimatedStyle(() => ({
    opacity: backgroundOpacity.value,
  }));

  const logoStyle = useAnimatedStyle(() => ({
    opacity: logoOpacity.value,
    transform: [{ scale: logoScale.value }],
  }));

  return (
  
    <View style={styles.container}></View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.WHITE,
  },
  background: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  gradient: {
    flex: 1,
    backgroundColor: Colors.WHITE,
  },
  logo: {
    width: 150,
    height: 150,
  },
});
