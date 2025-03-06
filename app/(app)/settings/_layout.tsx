// app/(app)/settings/_layout.tsx
import { Stack } from 'expo-router';
import { Colors } from '@/src/themes';

export default function SettingsLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: Colors.black_grey },
      }}
    >
      <Stack.Screen 
        name="index"
        options={{ 
          headerShown: false,
        }}
      />
      <Stack.Screen 
        name="edit" 
        options={{ 
          headerShown: false,
          presentation: 'modal'
        }}
      />
    </Stack>
  );
}