import React, {useState} from 'react';
import {Alert} from 'react-native';
import {useHabits} from '@/context/HabitContext';
import {
  Button,
  Input,
  FocusAwareStatusBar,
  Text,
  View,
  Pressable,
  ScrollView,
} from '@/components/ui';
import {Habit, HabitFrequency} from '@/stores/types';
import {Trash2, Edit, Plus} from '@/components/ui/icons';

const frequencyOptions = [
  {value: 'minutely', label: 'Every Minute ⚡ (Testing)'},
  {value: 'hourly', label: 'Hourly ⏰'},
  {value: 'daily', label: 'Daily 📅'},
  {value: 'weekly', label: 'Weekly 📊'},
];

const colorOptions = [
  '#EF4444',
  '#F59E0B',
  '#10B981',
  '#3B82F6',
  '#8B5CF6',
  '#EC4899',
  '#14B8A6',
  '#F97316',
];

export default function Manage() {
  const {habits, addHabit, updateHabit, deleteHabit} = useHabits();

  const [mode, setMode] = useState<'list' | 'add' | 'edit'>('list');
  const [editingId, setEditingId] = useState<string | null>(null);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [frequency, setFrequency] = useState<HabitFrequency>('daily');
  const [color, setColor] = useState('#8B5CF6');

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setFrequency('daily');
    setColor('#8B5CF6');
    setEditingId(null);
  };

  const handleSave = () => {
    if (!title.trim()) {
      Alert.alert('Error', 'Please enter a habit title');
      return;
    }

    if (mode === 'add') {
      addHabit(title, description, frequency, color);
      Alert.alert('Success', 'Habit added successfully!');
    } else if (mode === 'edit' && editingId) {
      updateHabit(editingId, {title, description, frequency, color});
      Alert.alert('Success', 'Habit updated successfully!');
    }

    resetForm();
    setMode('list');
  };

  const handleEdit = (habit: Habit) => {
    setTitle(habit.title);
    setDescription(habit.description || '');
    setFrequency(habit.frequency);
    setColor(habit.color);
    setEditingId(habit.id);
    setMode('edit');
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

  const handleCancel = () => {
    resetForm();
    setMode('list');
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

      {mode === 'list' ? (
        <View className="flex-1">
          <ScrollView
            className="flex-1 px-4 pt-4"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{paddingBottom: 150}}>
            <View className="flex-row items-center justify-between mb-4">
              <Text className="text-2xl font-bold text-white">All Habits</Text>
              <View className="bg-purple-600 px-3 py-1 rounded-full">
                <Text className="text-white font-semibold">
                  {habits.length}
                </Text>
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
              habits.map(habit => (
                <HabitListItem key={habit.id} habit={habit} />
              ))
            )}
            <View className="h-24" />
            {/* Spacer for floating button and navbar */}
          </ScrollView>

          <View className="absolute bottom-24 right-6 left-6">
            <Button
              onPress={() => setMode('add')}
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
      ) : (
        <View style={{flex: 1}}>
          <ScrollView
            style={{flex: 1, padding: 16}}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{paddingBottom: 150}}>
            <Text className="text-2xl font-bold mb-6 text-white">
              {mode === 'add' ? 'Create New Habit' : 'Edit Habit'}
            </Text>
            <View className="mb-4">
              <Text className="text-sm font-medium text-gray-300 mb-2">
                Title *
              </Text>
              <Input
                placeholder="e.g., Drink water, Exercise, Read"
                value={title}
                onChangeText={setTitle}
              />
            </View>
            <View className="mb-4">
              <Text className="text-sm font-medium text-gray-300 mb-2">
                Description
              </Text>
              <Input
                placeholder="Add details or goals (optional)"
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={3}
              />
            </View>
            <View>
              <Text className="text-sm font-medium text-gray-300 mb-3">
                Frequency *
              </Text>
              <View>
                {frequencyOptions.map(option => (
                  <Pressable
                    key={option.value}
                    onPress={() => setFrequency(option.value as HabitFrequency)}
                    className={`flex-row items-center p-4 rounded-xl border-2 mb-3 ${
                      frequency === option.value
                        ? 'bg-purple-900/20 border-purple-600'
                        : 'bg-gray-900 border-gray-700'
                    }`}>
                    <View
                      className={`w-6 h-6 rounded-full border-2 items-center justify-center mr-3 ${
                        frequency === option.value
                          ? 'border-purple-600 bg-purple-600'
                          : 'border-gray-600'
                      }`}>
                      {frequency === option.value ? (
                        <View className="w-3 h-3 rounded-full bg-white" />
                      ) : null}
                    </View>
                    <Text className="text-white text-base font-medium">
                      {option.label}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>
            <View>
              <Text className="text-sm font-medium text-gray-300 mb-2">
                Color
              </Text>
              <View className="flex-row flex-wrap">
                {colorOptions.map(colorOption => (
                  <Button
                    key={colorOption}
                    variant="ghost"
                    onPress={() => setColor(colorOption)}
                    className="w-12 h-12 rounded-full p-0 mr-3 mb-3"
                    style={{backgroundColor: colorOption}}>
                    {color === colorOption ? (
                      <Text className="text-white text-xl">✓</Text>
                    ) : null}
                  </Button>
                ))}
              </View>
            </View>
            <View className="flex-row mt-4">
              <View className="flex-1 mr-2">
                <Button variant="outline" onPress={handleCancel}>
                  <Text className="text-white font-semibold">Cancel</Text>
                </Button>
              </View>
              <View className="flex-1">
                <Button onPress={handleSave}>
                  <Text className="text-white font-semibold">
                    {mode === 'add' ? 'Create' : 'Update'}
                  </Text>
                </Button>
              </View>
            </View>
            <View className="h-32" /> {/* Spacer for floating navbar */}
          </ScrollView>
        </View>
      )}
    </View>
  );
}
