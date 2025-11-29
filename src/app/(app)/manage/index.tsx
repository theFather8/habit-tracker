import React from 'react';
import {Alert} from 'react-native';
import {useRouter} from 'expo-router';
import {useHabits} from '@/context/HabitContext';
import {
  Button,
  FocusAwareStatusBar,
  Text,
  View,
  ScrollView,
} from '@/components/ui';
import {Habit} from '@/stores/types';
import {Trash2, Edit, Plus} from '@/components/ui/icons';

export default function ManageIndex() {
  const {habits, deleteHabit} = useHabits();
  const router = useRouter();

  const handleEdit = (habit: Habit) => {
    router.push({
      pathname: '/manage/form',
      params: {
        mode: 'edit',
        habitId: habit.id,
        title: habit.title,
        description: habit.description || '',
        frequency: habit.frequency,
        color: habit.color,
      },
    });
  };

  const handleDelete = (id: string) => {
    Alert.alert(
      'Delete Habit',
      'Are you sure you want to delete this habit? This action cannot be undone.',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            deleteHabit(id);
            Alert.alert('Success', 'Habit deleted successfully!');
          },
        },
      ],
    );
  };

  const HabitListItem = ({habit}: {habit: Habit}) => (
    <View
      className="bg-gray-900 rounded-xl p-4 mb-3 shadow-sm border border-gray-800"
      style={{borderLeftWidth: 4, borderLeftColor: habit.color}}>
      <View className="flex-row items-center justify-between mb-2">
        <View className="flex-1">
          <Text className="text-lg font-semibold text-white">
            {habit.title}
          </Text>
          {habit.description ? (
            <Text className="text-sm text-gray-400 mt-1">
              {habit.description}
            </Text>
          ) : null}
        </View>
      </View>

      <View className="flex-row items-center justify-between mt-2">
        <View className="flex-row items-center">
          <View className="bg-gray-800 px-3 py-1 rounded-full mr-2">
            <Text className="text-xs font-medium text-gray-300 capitalize">
              {habit.frequency}
            </Text>
          </View>
          <View className="bg-amber-900/30 px-3 py-1 rounded-full">
            <Text className="text-xs font-medium text-amber-300">
              🔥 {habit.streak} streak
            </Text>
          </View>
        </View>

        <View className="flex-row">
          <Button
            size="sm"
            variant="outline"
            onPress={() => handleEdit(habit)}
            className="w-10 h-10 items-center justify-center mr-2">
            <Edit color="#6B7280" width={16} height={16} />
          </Button>
          <Button
            size="sm"
            variant="destructive"
            onPress={() => handleDelete(habit.id)}
            className="w-10 h-10 items-center justify-center">
            <Trash2 color="#FFFFFF" width={16} height={16} />
          </Button>
        </View>
      </View>
    </View>
  );

  return (
    <View className="flex-1 bg-black">
      <FocusAwareStatusBar />

      <View className="flex-1">
        <ScrollView
          className="flex-1 px-4 pt-4"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{paddingBottom: 150}}>
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-2xl font-bold text-white">All Habits</Text>
            <View className="bg-purple-600 px-3 py-1 rounded-full">
              <Text className="text-white font-semibold">{habits.length}</Text>
            </View>
          </View>
          {habits.length === 0 ? (
            <View className="items-center justify-center py-20">
              <Text className="text-gray-500 text-center mb-2">
                No habits yet
              </Text>
              <Text className="text-gray-500 text-center text-sm">
                Tap the button below to create your first habit
              </Text>
            </View>
          ) : (
            habits.map(habit => <HabitListItem key={habit.id} habit={habit} />)
          )}
          <View className="h-24" />
          {/* Spacer for floating button and navbar */}
        </ScrollView>

        <View className="absolute bottom-24 right-6 left-6">
          <Button
            onPress={() => router.push('/manage/form?mode=create')}
            className="flex-row items-center justify-center shadow-lg bg-purple-600 rounded-full h-14">
            <Plus color="#FFFFFF" width={24} height={24} />
            <Text
              className="text-white font-bold text-lg ml-2"
              style={{color: '#FFFFFF'}}>
              Add New Habit
            </Text>
          </Button>
        </View>
      </View>
    </View>
  );
}
