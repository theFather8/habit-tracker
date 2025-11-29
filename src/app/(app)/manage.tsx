import React, {useState} from 'react';
import {ScrollView, Alert} from 'react-native';
import {useHabits} from '@/context/HabitContext';
import {
  Button,
  Input,
  FocusAwareStatusBar,
  Text,
  View,
  Pressable,
} from '@/components/ui';
import {Habit, HabitFrequency} from '@/stores/types';
import {Trash2, Edit, Plus} from '@/components/ui/icons';

const frequencyOptions = [
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
        <View className="flex-row items-center gap-2">
          <View className="bg-gray-800 px-3 py-1 rounded-full">
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

        <View className="flex-row gap-2">
          <Button
            label=""
            size="sm"
            variant="outline"
            onPress={() => handleEdit(habit)}
            className="w-10 h-10 items-center justify-center">
            <Edit color="#6B7280" width={16} height={16} />
          </Button>
          <Button
            label=""
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
            showsVerticalScrollIndicator={false}>
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
          </ScrollView>

          <View className="p-4 bg-gray-900 border-t border-gray-800">
            <Button
              label="Add New Habit"
              onPress={() => setMode('add')}
              className="flex-row items-center justify-center">
              <Plus color="#FFFFFF" width={20} height={20} />
              <Text className="text-white font-semibold ml-2">
                Add New Habit
              </Text>
            </Button>
          </View>
        </View>
      ) : (
        <ScrollView className="flex-1 p-4" showsVerticalScrollIndicator={false}>
          <Text className="text-2xl font-bold mb-6 text-white">
            {mode === 'add' ? 'Create New Habit' : 'Edit Habit'}
          </Text>

          <View className="gap-4">
            <Input
              label="Title *"
              placeholder="e.g., Drink water, Exercise, Read"
              value={title}
              onChangeText={setTitle}
            />

            <Input
              label="Description"
              placeholder="Add details or goals (optional)"
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={3}
            />

            <View>
              <Text className="text-sm font-medium text-gray-300 mb-3">
                Frequency *
              </Text>
              <View className="gap-3">
                {frequencyOptions.map(option => (
                  <Pressable
                    key={option.value}
                    onPress={() => setFrequency(option.value as HabitFrequency)}
                    className={`flex-row items-center p-4 rounded-xl border-2 ${
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
                      {frequency === option.value && (
                        <View className="w-3 h-3 rounded-full bg-white" />
                      )}
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
              <View className="flex-row flex-wrap gap-3">
                {colorOptions.map(colorOption => (
                  <Button
                    key={colorOption}
                    label=""
                    variant="ghost"
                    onPress={() => setColor(colorOption)}
                    className="w-12 h-12 rounded-full p-0"
                    style={{backgroundColor: colorOption}}>
                    {color === colorOption && (
                      <Text className="text-white text-xl">✓</Text>
                    )}
                  </Button>
                ))}
              </View>
            </View>

            <View className="flex-row gap-2 mt-4">
              <View className="flex-1">
                <Button
                  label="Cancel"
                  variant="outline"
                  onPress={handleCancel}
                />
              </View>
              <View className="flex-1">
                <Button
                  label={mode === 'add' ? 'Create' : 'Update'}
                  onPress={handleSave}
                />
              </View>
            </View>
          </View>
        </ScrollView>
      )}
    </View>
  );
}
