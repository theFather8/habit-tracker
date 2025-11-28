/* eslint-disable react/no-unstable-nested-components */
import {Link, Redirect, Tabs} from 'expo-router';
import React from 'react';

import {Pressable, Text} from '@/components/ui';
import {
  Feed as FeedIcon,
  Style as StyleIcon,
} from '@/components/ui/icons';
export default function TabLayout() {
  return (
    <Tabs>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Habits',
          tabBarIcon: ({color}) => <FeedIcon color={color} />,
          tabBarButtonTestID: 'feed-tab',
        }}
      />
      <Tabs.Screen
        name="create"
        options={{
          title: 'Add Habit',
          headerShown: false,
          tabBarIcon: ({color}) => <StyleIcon color={color} />,
          tabBarButtonTestID: 'create-tab',
        }}
      />
    </Tabs>
  );
}

const CreateNewPostLink = () => {
  return (
    <Link href={'/feed/add-post' as any} asChild>
      <Pressable>
        <Text className="px-3 text-primary-300">Create</Text>
      </Pressable>
    </Link>
  );
};
