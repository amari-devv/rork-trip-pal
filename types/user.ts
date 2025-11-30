export interface UserPreferences {
  name: string;
  travelStyle: 'adventure' | 'relaxation' | 'culture' | 'mixed';
  budgetPreference: 'budget' | 'moderate' | 'luxury';
  interests: string[];
}

export interface OnboardingData extends UserPreferences {
  hasCompletedOnboarding: boolean;
}
