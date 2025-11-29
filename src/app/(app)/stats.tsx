import React from 'react';
import {ScrollView} from 'react-native';
import {useHabits} from '@/context/HabitContext';
import {FocusAwareStatusBar, Text, View} from '@/components/ui';
import {Flame, TrendingUp, Calendar, Clock} from '@/components/ui/icons';
import {Habit} from '@/stores/types';

export default function Stats() {
  const {habits} = useHabits();

  // Group habits by frequency
  const habitsByFrequency = {
    hourly: habits.filter(h => h.frequency === 'hourly'),
    daily: habits.filter(h => h.frequency === 'daily'),
    weekly: habits.filter(h => h.frequency === 'weekly'),
  };

  // Calculate stats
  const totalHabits = habits.length;
  const completedToday = habits.filter(h => h.completed).length;
  const completionRate =
    totalHabits > 0 ? Math.round((completedToday / totalHabits) * 100) : 0;
  const longestStreak =
    habits.length > 0 ? Math.max(...habits.map(h => h.streak)) : 0;
  const totalStreaks = habits.reduce((sum, h) => sum + h.streak, 0);

  const StatCard = ({
    icon: Icon,
    label,
    value,
    color,
  }: {
    icon: any;
    label: string;
    value: string | number;
    color: string;
  }) => (
    <View className={`flex-1 ${color} rounded-2xl p-4 shadow-sm mx-1`}>
      <Icon color="#FFFFFF" width={24} height={24} />
      <Text className="text-white text-3xl font-bold mt-2">{value}</Text>
      <Text className="text-white/80 text-sm mt-1">{label}</Text>
    </View>
  );

  const HabitStreakItem = ({habit}: {habit: Habit}) => {
    const frequencyColors = {
      hourly:
        'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
      daily:
        'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
      weekly:
        'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
    };

    return (
      <View className="bg-white dark:bg-gray-800 rounded-xl p-4 mb-3 shadow-sm border border-gray-100 dark:border-gray-700">
        <View className="flex-row items-center justify-between">
          <View className="flex-1">
            <Text className="text-lg font-semibold dark:text-white mb-1">
              {habit.title}
            </Text>
            <View className="flex-row items-center gap-2">
              <View
                className={`px-2 py-1 rounded-full ${frequencyColors[habit.frequency]}`}>
                <Text className="text-xs font-medium capitalize">
                  {habit.frequency}
                </Text>
              </View>
              {habit.completed && (
                <View className="bg-emerald-100 dark:bg-emerald-900/30 px-2 py-1 rounded-full">
                  <Text className="text-emerald-700 dark:text-emerald-300 text-xs font-medium">
                    ✓ Done
                  </Text>
                </View>
              )}
            </View>
          </View>
          <View className="items-center">
            <View className="flex-row items-center">
              <Flame color="#F59E0B" width={20} height={20} />
              <Text className="text-2xl font-bold text-amber-600 dark:text-amber-400 ml-1">
                {habit.streak}
              </Text>
            </View>
            <Text className="text-xs text-gray-500 dark:text-gray-400">
              streak
            </Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View className="flex-1 bg-gray-50 dark:bg-black">
      <FocusAwareStatusBar />
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="p-4">
          {/* Overview Stats */}
          <Text className="text-2xl font-bold mb-4 dark:text-white">
            Overview
          </Text>
          <View className="flex-row mb-6">
            <StatCard
              icon={TrendingUp}
              label="Completion Rate"
              value={`${completionRate}%`}
              color="bg-gradient-to-br from-violet-500 to-purple-600"
            />
            <StatCard
              icon={Flame}
              label="Longest Streak"
              value={longestStreak}
              color="bg-gradient-to-br from-amber-500 to-orange-600"
            />
          </View>

          <View className="flex-row mb-6">
            <StatCard
              icon={Calendar}
              label="Total Streaks"
              value={totalStreaks}
              color="bg-gradient-to-br from-emerald-500 to-green-600"
            />
            <StatCard
              icon={Clock}
              label="Completed Today"
              value={`${completedToday}/${totalHabits}`}
              color="bg-gradient-to-br from-blue-500 to-cyan-600"
            />
          </View>

          {/* Habits by Frequency */}
          {Object.entries(habitsByFrequency).map(
            ([frequency, habitsInCategory]) => {
              if (habitsInCategory.length === 0) return null;

              const icons = {
                hourly: Clock,
                daily: Calendar,
                weekly: TrendingUp,
              };
              const Icon = icons[frequency as keyof typeof icons];

              return (
                <View key={frequency} className="mb-6">
                  <View className="flex-row items-center mb-3">
                    <Icon color="#6B7280" width={20} height={20} />
                    <Text className="text-xl font-bold ml-2 dark:text-white capitalize">
                      {frequency} Habits
                    </Text>
                    <View className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded-full ml-2">
                      <Text className="text-gray-700 dark:text-gray-300 text-xs font-semibold">
                        {habitsInCategory.length}
                      </Text>
                    </View>
                  </View>
                  {habitsInCategory.map(habit => (
                    <HabitStreakItem key={habit.id} habit={habit} />
                  ))}
                </View>
              );
            },
          )}

          {totalHabits === 0 && (
            <View className="items-center justify-center py-20">
              <Text className="text-gray-400 text-center">
                No habits yet. Create some in the Manage tab!
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}
