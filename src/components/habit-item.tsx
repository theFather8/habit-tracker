import React from 'react';
import {View, Text, Pressable, Checkbox} from '@/components/ui';
import {Habit} from '@/stores/types';

interface HabitItemProps {
  habit: Habit;
  onToggle: (id: string, date: string) => void;
  onDelete: (id: string) => void;
}

export const HabitItem = ({habit, onToggle, onDelete}: HabitItemProps) => {
  const today = new Date().toISOString().split('T')[0];
  const isCompleted = habit.completedDates.includes(today);

  return (
    <View className="flex-row items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg mb-2 shadow-sm border border-gray-100 dark:border-gray-700">
      <View className="flex-row items-center flex-1">
        <Checkbox.Root
          checked={isCompleted}
          onChange={() => onToggle(habit.id, today)}
          accessibilityLabel={`Toggle completion for ${habit.title}`}>
          <Checkbox.Icon checked={isCompleted} />
        </Checkbox.Root>
        <View className="ml-3 flex-1">
          <Text
            className={`text-lg font-semibold ${isCompleted ? 'line-through text-gray-400' : 'dark:text-white'}`}>
            {habit.title}
          </Text>
          {habit.description ? (
            <Text className="text-sm text-gray-500">{habit.description}</Text>
          ) : null}
        </View>
      </View>
      <Pressable onPress={() => onDelete(habit.id)} className="ml-2 p-2">
        <Text className="text-red-500">Delete</Text>
      </Pressable>
    </View>
  );
};
