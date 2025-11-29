/* eslint-disable react/no-unstable-nested-components */
import {Tabs} from 'expo-router';
import React from 'react';
import {View} from 'react-native';
import {BarChart3, ListTodo, Settings} from '@/components/ui/icons';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#A78BFA',
        tabBarInactiveTintColor: '#6B7280',
        tabBarStyle: {
          backgroundColor: '#111827', // dark gray-900
          borderTopWidth: 0,
          position: 'absolute',
          bottom: 30,
          marginHorizontal: 60,
          elevation: 5,
          borderRadius: 30,
          height: 60,
          paddingTop: 0, // Remove top padding to center icons vertically
          paddingBottom: 0, // Remove bottom padding
          alignItems: 'center',
          justifyContent: 'center',
          borderWidth: 1,
          borderColor: '#374151', // gray-700
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 4,
          },
          shadowOpacity: 0.3,
          shadowRadius: 4.65,
        },
        tabBarShowLabel: false, // Hide labels for cleaner floating look
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
        headerStyle: {
          backgroundColor: '#000000',
        },
        headerTitleStyle: {
          fontWeight: '700',
          fontSize: 20,
          color: '#FFFFFF',
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Tracker',
          headerTitle: 'My Habits',
          tabBarIcon: ({color, size}) => (
            <View className="items-center justify-center h-full w-full pt-4">
              <ListTodo color={color} width={28} height={28} />
            </View>
          ),
          tabBarButtonTestID: 'tracker-tab',
        }}
      />
      <Tabs.Screen
        name="stats"
        options={{
          title: 'Stats',
          headerTitle: 'Statistics',
          tabBarIcon: ({color, size}) => (
            <View className="items-center justify-center h-full w-full pt-4">
              <BarChart3 color={color} width={28} height={28} />
            </View>
          ),
          tabBarButtonTestID: 'stats-tab',
        }}
      />
      <Tabs.Screen
        name="manage"
        options={{
          title: 'Manage',
          headerShown: false, // Hide header as manage has its own stack
          tabBarIcon: ({color, size}) => (
            <View className="items-center justify-center h-full w-full pt-4">
              <Settings color={color} width={28} height={28} />
            </View>
          ),
          tabBarButtonTestID: 'manage-tab',
        }}
      />
    </Tabs>
  );
}
