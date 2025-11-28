import React, {useState} from 'react';
import {useRouter} from 'expo-router';
import {useStores} from '@/stores';
import {Button, Input, FocusAwareStatusBar, Text, View} from '@/components/ui';

export default function CreateHabit() {
  const router = useRouter();
  const {habit} = useStores();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleCreate = () => {
    if (title) {
      habit.addHabit(title, description, '#4F46E5');
      router.replace('/');
    }
  };

  return (
    <View className="flex-1 p-4 bg-white dark:bg-black">
      <FocusAwareStatusBar />
      <Text className="text-2xl font-bold mb-6 dark:text-white">
        Create New Habit
      </Text>
      <View className="gap-4">
        <Input
          label="Title"
          placeholder="Drink water"
          value={title}
          onChangeText={setTitle}
        />
        <Input
          label="Description"
          placeholder="8 glasses a day"
          value={description}
          onChangeText={setDescription}
        />
        <Button label="Create Habit" onPress={handleCreate} />
      </View>
    </View>
  );
}
