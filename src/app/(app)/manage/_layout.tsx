import {Stack} from 'expo-router';
import React from 'react';

export default function ManageLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: '#000000',
        },
        headerTitleStyle: {
          fontWeight: '700',
          fontSize: 20,
          color: '#FFFFFF',
        },
        headerTintColor: '#FFFFFF',
      }}>
      <Stack.Screen
        name="index"
        options={{
          title: 'Manage Habits',
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="form"
        options={{
          title: 'Habit Form',
          headerShown: true,
          presentation: 'card',
        }}
      />
    </Stack>
  );
}
