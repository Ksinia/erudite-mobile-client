import { Tabs } from 'expo-router';
import React from 'react';

import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import Toolbar from '@/components/Toolbar';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <>
      <Toolbar />
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
          headerShown: false, // Hide the default header since we're using our custom Toolbar
          tabBarLabelStyle: { fontSize: 14 }, // Make text labels more prominent
        }}>
        <Tabs.Screen
          name="index"
          options={{
            title: 'Lobby',
            // No tabBarIcon prop needed
          }}
        />
        <Tabs.Screen
          name="my-games"
          options={{
            title: 'My Games',
            // No tabBarIcon prop needed
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: 'Profile',
            // No tabBarIcon prop needed
          }}
        />
      </Tabs>
    </>
  );
}