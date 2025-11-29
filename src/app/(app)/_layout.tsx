/* eslint-disable react/no-unstable-nested-components */
import {Tabs} from 'expo-router';
import React from 'react';
import {BarChart3, ListTodo, Settings} from '@/components/ui/icons';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#A78BFA',
        tabBarInactiveTintColor: '#6B7280',
        tabBarStyle: {
          backgroundColor: '#000000',
          borderTopWidth: 1,
          borderTopColor: '#374151',
          paddingBottom: 8,
          paddingTop: 8,
          height: 65,
        },
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
            <ListTodo color={color} width={size} height={size} />
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
            <BarChart3 color={color} width={size} height={size} />
          ),
          tabBarButtonTestID: 'stats-tab',
        }}
      />
      <Tabs.Screen
        name="manage"
        options={{
          title: 'Manage',
          headerTitle: 'Manage Habits',
          tabBarIcon: ({color, size}) => (
            <Settings color={color} width={size} height={size} />
          ),
          tabBarButtonTestID: 'manage-tab',
        }}
      />
    </Tabs>
  );
}
