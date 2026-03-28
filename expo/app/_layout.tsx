import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack, useRouter, useSegments } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { TripProvider } from "@/contexts/TripContext";
import { OnboardingProvider, useOnboarding } from "@/contexts/OnboardingContext";
import { useFonts, Geist_400Regular, Geist_500Medium, Geist_600SemiBold, Geist_700Bold, Geist_800ExtraBold } from '@expo-google-fonts/geist';
import { View, StyleSheet } from 'react-native';

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

function RootLayoutNav() {
  const segments = useSegments();
  const router = useRouter();
  const { onboardingData, isLoading } = useOnboarding();

  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === 'onboarding';
    const inTabsGroup = segments[0] === '(tabs)';

    console.log('Navigation check:', {
      hasCompletedOnboarding: onboardingData.hasCompletedOnboarding,
      segments,
      inAuthGroup,
      inTabsGroup
    });

    if (!onboardingData.hasCompletedOnboarding && !inAuthGroup) {
      console.log('Redirecting to onboarding');
      router.replace('/onboarding');
    } else if (onboardingData.hasCompletedOnboarding && inAuthGroup) {
      console.log('Redirecting to tabs');
      router.replace('/(tabs)');
    }
  }, [onboardingData.hasCompletedOnboarding, isLoading, segments, router]);

  return (
    <View style={styles.rootContainer}>
      <Stack screenOptions={{ headerBackTitle: "Back" }}>
        <Stack.Screen name="onboarding" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="trip/[id]" options={{ headerShown: false }} />
        <Stack.Screen 
          name="create-trip" 
          options={{ 
            presentation: "modal",
            headerShown: false,
          }} 
        />
        <Stack.Screen 
          name="profile" 
          options={{ 
            presentation: "modal",
            headerShown: false,
          }} 
        />
        <Stack.Screen 
          name="review-modal" 
          options={{ 
            presentation: "transparentModal",
            animation: "fade",
            headerShown: false,
          }} 
        />
      </Stack>
    </View>
  );
}

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Geist_400Regular,
    Geist_500Medium,
    Geist_600SemiBold,
    Geist_700Bold,
    Geist_800ExtraBold,
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return <View style={{ flex: 1 }} />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <OnboardingProvider>
          <TripProvider>
            <RootLayoutNav />
          </TripProvider>
        </OnboardingProvider>
      </GestureHandlerRootView>
    </QueryClientProvider>
  );
}

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
  },
});
