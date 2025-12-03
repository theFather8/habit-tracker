import {StyleSheet} from 'react-native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {BottomSheetModalProvider} from '@gorhom/bottom-sheet';
import FlashMessage from 'react-native-flash-message';
import {HabitProvider} from '@/context/HabitContext';

export function Providers({children}: {children: React.ReactNode}) {
  return (
    <GestureHandlerRootView style={styles.container}>
      <HabitProvider>
        <BottomSheetModalProvider>
          {children}
          <FlashMessage position="top" />
        </BottomSheetModalProvider>
      </HabitProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
