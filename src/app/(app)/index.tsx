import React from 'react';
import {FlashList} from '@shopify/flash-list';
import {observer} from 'mobx-react-lite';
import {useStores} from '@/stores';
import {FocusAwareStatusBar, Text, View, EmptyList} from '@/components/ui';
import {HabitItem} from '@/components/habit-item';
import {WeatherWidget} from '@/components/weather-widget';

export default observer(function Habits() {
  const {habit} = useStores();
  const habits = habit.habits;

  const renderItem = React.useCallback(
    ({item}: {item: import('@/stores/types').Habit}) => (
      <HabitItem
        habit={item}
        onToggle={habit.toggleCompletion}
        onDelete={habit.deleteHabit}
      />
    ),
    [habit],
  );

  return (
    <View className="flex-1 bg-gray-50 dark:bg-black px-4 pt-4">
      <FocusAwareStatusBar />
      <Text className="text-3xl font-bold mb-4 dark:text-white">My Habits</Text>
      <WeatherWidget />
      <FlashList
        data={habits.slice()} // Create a shallow copy for MobX observability compatibility with FlashList
        renderItem={renderItem}
        keyExtractor={item => item.id}
        ListEmptyComponent={<EmptyList isLoading={false} />}
        // @ts-ignore
        estimatedItemSize={100}
      />
    </View>
  );
});
