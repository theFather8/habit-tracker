import React from 'react';
import {FlashList} from '@shopify/flash-list';
import {useHabits} from '@/context/HabitContext';
import {FocusAwareStatusBar, Text, View, EmptyList} from '@/components/ui';
import {HabitItem} from '@/components/habit-item';
import {WeatherWidget} from '@/components/weather-widget';
import {Habit} from '@/stores/types';

export default function Tracker() {
  const {habits, toggleHabitCompletion, loading} = useHabits();

  // Filter habits due for the current cycle
  const habitsForCurrentCycle = habits.filter(habit => {
    // For this view, we show all habits but prioritize incomplete ones
    return true;
  });

  const renderItem = React.useCallback(
    ({item}: {item: Habit}) => (
      <HabitItem habit={item} onToggle={() => toggleHabitCompletion(item.id)} />
    ),
    [toggleHabitCompletion],
  );

  return (
    <View className="flex-1 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-black">
      <FocusAwareStatusBar />

      {/* Weather Widget Section */}
      <View className="px-4 pt-4">
        <WeatherWidget />
      </View>

      {/* Habits List Section */}
      <View className="flex-1 px-4">
        <View className="flex-row items-center justify-between mb-4">
          <Text className="text-2xl font-bold dark:text-white">
            Today's Habits
          </Text>
          <View className="bg-violet-100 dark:bg-violet-900/30 px-3 py-1 rounded-full">
            <Text className="text-violet-700 dark:text-violet-300 font-semibold text-sm">
              {habits.filter(h => h.completed).length}/{habits.length}
            </Text>
          </View>
        </View>

        <FlashList
          data={habitsForCurrentCycle}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          ListEmptyComponent={<EmptyList isLoading={loading} />}
          // @ts-ignore
          estimatedItemSize={100}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </View>
  );
}
