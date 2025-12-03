import '../../global.css';

import {Slot, SplashScreen} from 'expo-router';
import {useEffect, useState} from 'react';
import {I18nManager} from 'react-native';
import {Providers} from '@/providers';

// Prevent the splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Disable RTL if enabled
        if (I18nManager.isRTL) {
          I18nManager.allowRTL(false);
          I18nManager.forceRTL(false);
        }

        setIsReady(true);
      } catch (error) {
        console.error('Failed to initialize app:', error);
        setIsReady(true); // Continue anyway
      }
    };

    initializeApp();
  }, []);

  useEffect(() => {
    if (isReady) {
      // Hide splash screen once the app is ready
      const hideSplash = async () => {
        await SplashScreen.hideAsync();
      };

      // Small delay to ensure smooth transition
      setTimeout(() => {
        hideSplash();
      }, 500);
    }
  }, [isReady]);

  if (!isReady) {
    return null;
  }

  return (
    <Providers>
      <Slot />
    </Providers>
  );
}
