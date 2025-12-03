import React from 'react';
import {View, Text, Pressable} from '@/components/ui';
import {Habit} from '@/types';
import {CheckCircle2, Circle, Flame} from '@/components/ui/icons';

interface HabitItemProps {
  habit: Habit;
  onToggle: () => void;
}

export const HabitItem = ({habit, onToggle}: HabitItemProps) => {
  const frequencyConfig = {
    minutely: {
      bg: 'bg-yellow-900/30',
      text: 'text-yellow-300',
      border: 'border-yellow-800',
      icon: '⚡',
    },
    hourly: {
      bg: 'bg-blue-900/30',
      text: 'text-blue-300',
      border: 'border-blue-800',
      icon: '⏰',
    },
    daily: {
      bg: 'bg-green-900/30',
      text: 'text-green-300',
      border: 'border-green-800',
      icon: '📅',
    },
    weekly: {
      bg: 'bg-purple-900/30',
      text: 'text-purple-300',
      border: 'border-purple-800',
      icon: '📊',
    },
  };

  const config = frequencyConfig[habit.frequency];

  return (
    <Pressable
      onPress={onToggle}
      className={`rounded-2xl p-4 mb-3 shadow-sm border-2 ${
        habit.completed
          ? 'bg-emerald-900/20 border-emerald-700'
          : `bg-gray-900 ${config.border}`
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
                habit.completed ? 'line-through text-gray-500' : 'text-white'
              }`}>
              {habit.title}
            </Text>

            {habit.description ? (
              <Text
                className={`text-sm mt-1 ${
                  habit.completed ? 'text-gray-500' : 'text-gray-400'
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
                <View className="bg-amber-900/30 px-2 py-1 rounded-full flex-row items-center">
                  <Flame color="#F59E0B" width={14} height={14} />
                  <Text className="text-xs font-bold text-amber-400 ml-1">
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
