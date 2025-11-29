import React from 'react';
import {View, Text, Pressable} from '@/components/ui';
import {Habit} from '@/stores/types';
import {CheckCircle2, Circle, Flame} from '@/components/ui/icons';

interface HabitItemProps {
  habit: Habit;
  onToggle: () => void;
}

export const HabitItem = ({habit, onToggle}: HabitItemProps) => {
  const frequencyConfig = {
    hourly: {
      bg: 'bg-blue-50 dark:bg-blue-900/20',
      text: 'text-blue-700 dark:text-blue-300',
      border: 'border-blue-200 dark:border-blue-800',
      icon: '⏰',
    },
    daily: {
      bg: 'bg-green-50 dark:bg-green-900/20',
      text: 'text-green-700 dark:text-green-300',
      border: 'border-green-200 dark:border-green-800',
      icon: '📅',
    },
    weekly: {
      bg: 'bg-purple-50 dark:bg-purple-900/20',
      text: 'text-purple-700 dark:text-purple-300',
      border: 'border-purple-200 dark:border-purple-800',
      icon: '📊',
    },
  };

  const config = frequencyConfig[habit.frequency];

  return (
    <Pressable
      onPress={onToggle}
      className={`rounded-2xl p-4 mb-3 shadow-sm border-2 ${
        habit.completed
          ? 'bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 border-emerald-300 dark:border-emerald-700'
          : `bg-white dark:bg-gray-800 ${config.border}`
      }`}
      style={{borderLeftWidth: 6, borderLeftColor: habit.color}}>
      <View className="flex-row items-start justify-between">
        {/* Left section: Checkbox and text */}
        <View className="flex-row items-start flex-1">
          <View className="mt-1">
            {habit.completed ? (
              <CheckCircle2 color="#10B981" width={28} height={28} />
            ) : (
              <Circle color="#9CA3AF" width={28} height={28} />
            )}
          </View>

          <View className="ml-3 flex-1">
            <Text
              className={`text-lg font-bold ${
                habit.completed
                  ? 'line-through text-gray-500 dark:text-gray-400'
                  : 'text-gray-900 dark:text-white'
              }`}>
              {habit.title}
            </Text>

            {habit.description ? (
              <Text
                className={`text-sm mt-1 ${
                  habit.completed
                    ? 'text-gray-400 dark:text-gray-500'
                    : 'text-gray-600 dark:text-gray-400'
                }`}>
                {habit.description}
              </Text>
            ) : null}

            <View className="flex-row items-center gap-2 mt-2">
              <View
                className={`${config.bg} px-2 py-1 rounded-full flex-row items-center`}>
                <Text className="text-xs mr-1">{config.icon}</Text>
                <Text
                  className={`text-xs font-semibold ${config.text} capitalize`}>
                  {habit.frequency}
                </Text>
              </View>

              {habit.streak > 0 && (
                <View className="bg-gradient-to-r from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 px-2 py-1 rounded-full flex-row items-center">
                  <Flame color="#F59E0B" width={14} height={14} />
                  <Text className="text-xs font-bold text-amber-700 dark:text-amber-400 ml-1">
                    {habit.streak}
                  </Text>
                </View>
              )}
            </View>
          </View>
        </View>
      </View>
    </Pressable>
  );
};
