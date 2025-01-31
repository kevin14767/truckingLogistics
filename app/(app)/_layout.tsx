// app/(app)/_layout.tsx
import { useEffect } from 'react';
import { Stack, useRouter } from 'expo-router';
import { useAuth } from '@/src/context/AuthContext';
import { ActivityIndicator, View } from 'react-native';
import { Colors } from '@/src/themes';

export default function AppLayout() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/(auth)/login');
    }
  }, [user, loading]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={Colors.greenThemeColor} />
      </View>
    );
  }

  return <Stack />;
}