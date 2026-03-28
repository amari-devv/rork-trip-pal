import AsyncStorage from '@react-native-async-storage/async-storage';
import createContextHook from '@nkzw/create-context-hook';
import { useEffect, useState, useCallback, useMemo } from 'react';
import { OnboardingData, UserPreferences } from '@/types/user';

const STORAGE_KEY = '@onboarding';

const defaultOnboardingData: OnboardingData = {
  name: '',
  travelStyle: 'mixed',
  budgetPreference: 'moderate',
  interests: [],
  hasCompletedOnboarding: false,
};

export const [OnboardingProvider, useOnboarding] = createContextHook(() => {
  const [onboardingData, setOnboardingData] = useState<OnboardingData>(defaultOnboardingData);
  const [isLoading, setIsLoading] = useState(true);

  const loadOnboardingData = useCallback(async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        try {
          setOnboardingData(JSON.parse(stored));
        } catch (e) {
          console.error('JSON Parse error in OnboardingContext, clearing storage:', e);
          await AsyncStorage.removeItem(STORAGE_KEY);
          setOnboardingData(defaultOnboardingData);
        }
      }
    } catch (error) {
      console.error('Failed to load onboarding data:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadOnboardingData();
  }, [loadOnboardingData]);

  const saveOnboardingData = useCallback(async (data: OnboardingData) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      setOnboardingData(data);
    } catch (error) {
      console.error('Failed to save onboarding data:', error);
    }
  }, []);

  const updatePreferences = useCallback(async (preferences: Partial<UserPreferences>) => {
    const updated = { ...onboardingData, ...preferences };
    await saveOnboardingData(updated);
  }, [onboardingData, saveOnboardingData]);

  const completeOnboarding = useCallback(async (preferences: UserPreferences) => {
    const completed: OnboardingData = {
      ...preferences,
      hasCompletedOnboarding: true,
    };
    await saveOnboardingData(completed);
  }, [saveOnboardingData]);

  const resetOnboarding = useCallback(async () => {
    await saveOnboardingData(defaultOnboardingData);
  }, [saveOnboardingData]);

  return useMemo(() => ({
    onboardingData,
    isLoading,
    updatePreferences,
    completeOnboarding,
    resetOnboarding,
  }), [onboardingData, isLoading, updatePreferences, completeOnboarding, resetOnboarding]);
});
