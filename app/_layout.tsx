import { Stack } from "expo-router";
import { useEffect } from "react";
import { AuthProvider } from '../src/context/AuthContext';
import { PaperProvider } from 'react-native-paper';

// Import the i18n configuration
import '../src/i18n';
import { I18nextProvider } from 'react-i18next';
import i18n from '../src/i18n';

export default function RootLayout() {
  useEffect(() => {
    console.log("Root layout mounted");
  }, []);

  return (
    <AuthProvider>
      <I18nextProvider i18n={i18n}>
        <PaperProvider>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(auth)" options={{ headerShown: false }} />
            <Stack.Screen name="(app)" options={{ headerShown: false }} />
          </Stack>
        </PaperProvider>
      </I18nextProvider>
    </AuthProvider>
  );
}