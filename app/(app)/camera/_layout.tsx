// app/(app)/camera/_layout.tsx
import { Stack } from 'expo-router';
import { Colors } from '../../../src/themes';

export default function CameraLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: Colors.black_grey }
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="imagedetails" />
      <Stack.Screen name="verification" />
      <Stack.Screen name="report" />
    </Stack>
  );
}