import React, {useState, useEffect} from 'react';
import {Alert} from 'react-native';
import {useRouter, useLocalSearchParams} from 'expo-router';
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
import {HabitFrequency} from '@/stores/types';

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

export default function HabitForm() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const {addHabit, updateHabit} = useHabits();

  // Determine mode from params
  const mode = (params.mode as 'create' | 'edit') || 'create';
  const isEditing = mode === 'edit';

  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [frequency, setFrequency] = useState<HabitFrequency>('daily');
  const [color, setColor] = useState('#8B5CF6');

  // Load existing habit data if editing
  useEffect(() => {
    if (isEditing && params.habitId) {
      setTitle((params.title as string) || '');
      setDescription((params.description as string) || '');
      setFrequency((params.frequency as HabitFrequency) || 'daily');
      setColor((params.color as string) || '#8B5CF6');
    }
  }, [isEditing, params]);

  // Update header title based on mode
  useEffect(() => {
    router.setParams({
      title: isEditing ? 'Edit Habit' : 'Create New Habit',
    });
  }, [isEditing]);

  const handleSave = () => {
    if (!title.trim()) {
      Alert.alert('Error', 'Please enter a habit title');
      return;
    }

    if (isEditing && params.habitId) {
      updateHabit(params.habitId as string, {
        title,
        description,
        frequency,
        color,
      });
      Alert.alert('Success', 'Habit updated successfully!');
    } else {
      addHabit(title, description, frequency, color);
      Alert.alert('Success', 'Habit added successfully!');
    }

    router.back();
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <View className="flex-1 bg-black">
      <FocusAwareStatusBar />

      <View style={{flex: 1}}>
        <ScrollView
          style={{flex: 1, padding: 16}}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{paddingBottom: 150}}>
          <Text className="text-2xl font-bold mb-6 text-white">
            {isEditing ? 'Edit Habit' : 'Create New Habit'}
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
                  {isEditing ? 'Update' : 'Create'}
                </Text>
              </Button>
            </View>
          </View>
          <View className="h-32" /> {/* Spacer for floating navbar */}
        </ScrollView>
      </View>
    </View>
  );
}
