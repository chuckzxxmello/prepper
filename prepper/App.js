import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './navigation/AppNavigator';
import * as Font from 'expo-font';
import AppLoading from 'expo-app-loading'; // For loading fonts

const loadFonts = async () => {
  try {
    await Font.loadAsync({
      'Inter-Regular': require('./assets/fonts/Inter-Regular.ttf'),
      'Inter-Bold': require('./assets/fonts/Inter-Bold.ttf'),
      'Inter-Light': require('./assets/fonts/Inter-Light.ttf'),
      'Inter-Medium': require('./assets/fonts/Inter-Medium.ttf'),
      'Inter-SemiBold': require('./assets/fonts/Inter-SemiBold.ttf'),
    });
  } catch (error) {
    console.error('Font loading failed:', error); // Log the error for debugging
  }
};

export default function App() {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  if (!fontsLoaded) {
    return (
      <AppLoading
        startAsync={loadFonts}
        onFinish={() => setFontsLoaded(true)}
        onError={(err) => console.warn('AppLoading Error:', err)} // Log AppLoading issues
      />
    );
  }

  return (
    <NavigationContainer>
      <AppNavigator />
    </NavigationContainer>
  );
}
