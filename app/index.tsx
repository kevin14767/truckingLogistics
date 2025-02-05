import { Redirect } from "expo-router";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ActivityIndicator, View } from "react-native";
import { getAuth, onAuthStateChanged } from "firebase/auth";

export default function Index() {
  const [authStatus, setAuthStatus] = useState<{
    isAuthenticated: boolean | null;
    isOnboardingCompleted: boolean | null;
  }>({
    isAuthenticated: null,
    isOnboardingCompleted: null
  });

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const auth = getAuth();
        const onboardingValue = await AsyncStorage.getItem("onboardingCompleted");
        
        // Use a promise to get current auth state
        const authPromise = new Promise((resolve) => {
          const unsubscribe = onAuthStateChanged(auth, (user) => {
            unsubscribe();
            resolve(!!user);
          });
        });

        const [isAuthenticated] = await Promise.all([
          authPromise
        ]);

        setAuthStatus({
          isAuthenticated: !!isAuthenticated,
          isOnboardingCompleted: onboardingValue === "true"
        });
      } catch (error) {
        console.error("Error checking auth status:", error);
        setAuthStatus({
          isAuthenticated: false,
          isOnboardingCompleted: false
        });
      }
    };

    checkAuthStatus();
  }, []);

  // Loading state
  if (
    authStatus.isAuthenticated === null || 
    authStatus.isOnboardingCompleted === null
  ) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  // If authenticated, redirect to home
  if (authStatus.isAuthenticated) {
    return <Redirect href="/(app)/home" />;
  }

  // Check onboarding status
  if (!authStatus.isOnboardingCompleted) {
    return <Redirect href="/(auth)/language" />;
  }

  // Default to login
  return <Redirect href="/(auth)/language" />;
}