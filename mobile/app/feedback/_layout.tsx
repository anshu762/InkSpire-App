import { Stack } from 'expo-router';
import React from 'react';

export default function FeedbackLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: '#fff',
        },
        headerTintColor: '#334155',
        headerTitleStyle: {
          fontWeight: '600',
        },
        headerShadowVisible: false,
        contentStyle: { backgroundColor: '#f8fafc' }, // slate-50
      }}
    >
      <Stack.Screen 
        name="index" 
        options={{ 
          title: 'Peer Feedback',
          headerLargeTitle: true,
        }} 
      />
      <Stack.Screen 
        name="submit" 
        options={{ 
          title: 'Request Feedback',
          presentation: 'modal'
        }} 
      />
      <Stack.Screen 
        name="[id]/index" 
        options={{ 
          title: 'Feedback Details'
        }} 
      />
      <Stack.Screen 
        name="[id]/give-feedback" 
        options={{ 
          title: 'Give Feedback',
          presentation: 'modal'
        }} 
      />
    </Stack>
  );
}
