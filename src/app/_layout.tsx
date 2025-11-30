import '../../global.css';

import {Slot, SplashScreen} from 'expo-router';
import {useEffect, useState} from 'react';
import {hydrateStores} from '@/stores';
import {I18nManager} from 'react-native';
import {Providers} from '@/providers';

// Prevent the splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        if (I18nManager.isRTL) {
          I18nManager.allowRTL(false);
          I18nManager.forceRTL(false);
        }

        // Hydrate all stores from AsyncStorage
        await hydrateStores();
        setIsHydrated(true);
      } catch (error) {
        console.error('Failed to hydrate stores:', error);
        setIsHydrated(true); // Continue anyway
      }
    };

    initializeApp();
  }, []);

  useEffect(() => {
    if (isHydrated) {
      // Hide splash screen once the app is ready
      const hideSplash = async () => {
        await SplashScreen.hideAsync();
      };

      // Small delay to ensure smooth transition
      setTimeout(() => {
        hideSplash();
      }, 500);
    }
  }, [isHydrated]);

  if (!isHydrated) {
    return null; // or a loading screen
  }

  return (
    <Providers>
      <Slot />
    </Providers>
  );
}
