import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  Plane, 
  User, 
  Compass, 
  Wallet, 
  Heart, 
  ArrowRight,
  Check,
  Mail,
  Lock
} from 'lucide-react-native';
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  Image,
} from 'react-native';

import colors from '@/constants/colors';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { UserPreferences } from '@/types/user';

const TRAVEL_STYLES: { id: UserPreferences['travelStyle']; label: string; emoji: string; description: string }[] = [
  { id: 'adventure', label: 'Adventure', emoji: '🏔️', description: 'Thrilling experiences' },
  { id: 'relaxation', label: 'Relaxation', emoji: '🏖️', description: 'Peace and tranquility' },
  { id: 'culture', label: 'Culture', emoji: '🏛️', description: 'History and arts' },
  { id: 'mixed', label: 'Mixed', emoji: '🌟', description: 'Best of everything' },
];

const BUDGET_OPTIONS: { id: UserPreferences['budgetPreference']; label: string; emoji: string; description: string }[] = [
  { id: 'budget', label: 'Budget', emoji: '💰', description: 'Cost-effective trips' },
  { id: 'moderate', label: 'Moderate', emoji: '💳', description: 'Balanced spending' },
  { id: 'luxury', label: 'Luxury', emoji: '💎', description: 'Premium experiences' },
];

const INTERESTS = [
  'Food & Dining',
  'Museums',
  'Shopping',
  'Nightlife',
  'Nature',
  'Photography',
  'Sports',
  'Beach',
  'Mountains',
  'Architecture',
  'Local Markets',
  'Music & Concerts',
];

function ProgressBar({ currentStep, totalSteps }: { currentStep: number; totalSteps: number }) {
  const progress = (currentStep / totalSteps) * 100;
  
  return (
    <View style={styles.progressContainer}>
      <View style={styles.progressBar}>
        <LinearGradient
          colors={[colors.gradient.sunset[0], colors.gradient.sunset[1]]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[styles.progressFill, { width: `${progress}%` }]}
        />
      </View>
      <Text style={styles.progressText}>{currentStep} of {totalSteps}</Text>
    </View>
  );
}

function WelcomeScreen({ onNext }: { onNext: () => void }) {
  return (
    <View style={styles.screenContainer}>
      <StatusBar barStyle="light-content" />
      <LinearGradient
        colors={[colors.gradient.sunset[0], colors.gradient.sunset[1]]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFillObject}
      />
      
      <View style={styles.welcomeContent}>
        <View style={[styles.welcomeIconContainer, { backgroundColor: 'transparent' }]}>
          <Image 
            source={require('@/assets/images/icon.png')} 
            style={{ width: 120, height: 120, borderRadius: 24 }} 
          />
        </View>
        
        <Text style={styles.welcomeTitle}>Welcome to Trip Pal</Text>
        <Text style={styles.welcomeSubtitle}>Your AI Planner in your Pocket</Text>
        
        <Text style={styles.welcomeDescription}>
          Let&apos;s get to know you better so we can create personalized travel experiences tailored just for you
        </Text>
        
        <TouchableOpacity 
          style={styles.welcomeButton}
          onPress={onNext}
          activeOpacity={0.8}
        >
          <Text style={styles.welcomeButtonText}>Get Started</Text>
          <ArrowRight color={colors.primary} size={24} strokeWidth={2} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

function NameScreen({ 
  name, 
  onNameChange, 
  onNext 
}: { 
  name: string; 
  onNameChange: (text: string) => void; 
  onNext: () => void;
}) {
  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.screenContainer}
    >
      <View style={styles.contentContainer}>
        <View style={styles.iconCircle}>
          <User color={colors.primary} size={40} strokeWidth={2} />
        </View>
        
        <Text style={styles.questionTitle}>What&apos;s your name?</Text>
        <Text style={styles.questionSubtitle}>
          We&apos;d love to know what to call you
        </Text>
        
        <TextInput
          style={styles.nameInput}
          placeholder="Enter your name"
          placeholderTextColor={colors.textLight}
          value={name}
          onChangeText={onNameChange}
          autoFocus
          autoCapitalize="words"
        />
        
        {name.length > 0 && (
          <View style={styles.responseContainer}>
            <Text style={styles.responseText}>Great to meet you, {name}! 👋</Text>
          </View>
        )}
        
        <TouchableOpacity 
          style={[styles.continueButton, !name && styles.continueButtonDisabled]}
          onPress={onNext}
          activeOpacity={0.8}
          disabled={!name}
        >
          <LinearGradient
            colors={name ? [colors.gradient.sunset[0], colors.gradient.sunset[1]] : [colors.border, colors.border]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.continueButtonGradient}
          >
            <Text style={styles.continueButtonText}>Continue</Text>
            <ArrowRight color={colors.surface} size={24} strokeWidth={2} />
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

function TravelStyleScreen({ 
  selectedStyle, 
  onStyleSelect, 
  onNext,
  userName
}: { 
  selectedStyle: UserPreferences['travelStyle']; 
  onStyleSelect: (style: UserPreferences['travelStyle']) => void; 
  onNext: () => void;
  userName: string;
}) {
  return (
    <View style={styles.screenContainer}>
      <ScrollView 
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.iconCircle}>
          <Compass color={colors.secondary} size={40} strokeWidth={2} />
        </View>
        
        <Text style={styles.questionTitle}>{userName}, what&apos;s your travel style?</Text>
        <Text style={styles.questionSubtitle}>
          Choose the vibe that resonates with you most
        </Text>
        
        <View style={styles.optionsContainer}>
          {TRAVEL_STYLES.map((style) => (
            <TouchableOpacity
              key={style.id}
              style={[
                styles.optionCard,
                selectedStyle === style.id && styles.optionCardSelected,
              ]}
              onPress={() => onStyleSelect(style.id)}
              activeOpacity={0.7}
            >
              <View style={styles.optionCardContent}>
                <Text style={styles.optionEmoji}>{style.emoji}</Text>
                <Text style={styles.optionLabel}>{style.label}</Text>
                <Text style={styles.optionDescription}>{style.description}</Text>
              </View>
              {selectedStyle === style.id && (
                <View style={styles.checkmark}>
                  <Check color={colors.surface} size={16} strokeWidth={3} />
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>
        
        {selectedStyle && (
          <View style={styles.responseContainer}>
            <Text style={styles.responseText}>
              {selectedStyle === 'adventure' && '🏔️ Love the thrill! You\'ll enjoy our exciting itineraries.'}
              {selectedStyle === 'relaxation' && '🏖️ Perfect! We\'ll help you find the most peaceful spots.'}
              {selectedStyle === 'culture' && '🏛️ Wonderful! History and art await you.'}
              {selectedStyle === 'mixed' && '🌟 Great choice! We\'ll mix it all up for you.'}
            </Text>
          </View>
        )}
        
        <TouchableOpacity 
          style={styles.continueButton}
          onPress={onNext}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={[colors.gradient.sunset[0], colors.gradient.sunset[1]]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.continueButtonGradient}
          >
            <Text style={styles.continueButtonText}>Continue</Text>
            <ArrowRight color={colors.surface} size={24} strokeWidth={2} />
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

function BudgetScreen({ 
  selectedBudget, 
  onBudgetSelect, 
  onNext 
}: { 
  selectedBudget: UserPreferences['budgetPreference']; 
  onBudgetSelect: (budget: UserPreferences['budgetPreference']) => void; 
  onNext: () => void;
}) {
  return (
    <View style={styles.screenContainer}>
      <ScrollView 
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.iconCircle}>
          <Wallet color={colors.accent} size={40} strokeWidth={2} />
        </View>
        
        <Text style={styles.questionTitle}>What&apos;s your budget preference?</Text>
        <Text style={styles.questionSubtitle}>
          This helps us suggest the best options for you
        </Text>
        
        <View style={styles.optionsContainer}>
          {BUDGET_OPTIONS.map((budget) => (
            <TouchableOpacity
              key={budget.id}
              style={[
                styles.optionCard,
                selectedBudget === budget.id && styles.optionCardSelected,
              ]}
              onPress={() => onBudgetSelect(budget.id)}
              activeOpacity={0.7}
            >
              <View style={styles.optionCardContent}>
                <Text style={styles.optionEmoji}>{budget.emoji}</Text>
                <Text style={styles.optionLabel}>{budget.label}</Text>
                <Text style={styles.optionDescription}>{budget.description}</Text>
              </View>
              {selectedBudget === budget.id && (
                <View style={styles.checkmark}>
                  <Check color={colors.surface} size={16} strokeWidth={3} />
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>
        
        {selectedBudget && (
          <View style={styles.responseContainer}>
            <Text style={styles.responseText}>
              {selectedBudget === 'budget' && '💰 Smart choice! We\'ll find the best deals for you.'}
              {selectedBudget === 'moderate' && '💳 Balanced approach! Quality meets value.'}
              {selectedBudget === 'luxury' && '💎 Excellent! Prepare for premium experiences.'}
            </Text>
          </View>
        )}
        
        <TouchableOpacity 
          style={styles.continueButton}
          onPress={onNext}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={[colors.gradient.sunset[0], colors.gradient.sunset[1]]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.continueButtonGradient}
          >
            <Text style={styles.continueButtonText}>Continue</Text>
            <ArrowRight color={colors.surface} size={24} strokeWidth={2} />
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

function InterestsScreen({ 
  selectedInterests, 
  onInterestToggle, 
  onNext
}: { 
  selectedInterests: string[]; 
  onInterestToggle: (interest: string) => void; 
  onNext: () => void;
}) {
  return (
    <View style={styles.screenContainer}>
      <ScrollView 
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.iconCircle}>
          <Heart color={colors.error} size={40} strokeWidth={2} />
        </View>
        
        <Text style={styles.questionTitle}>What interests you?</Text>
        <Text style={styles.questionSubtitle}>
          Select all that apply - we&apos;ll personalize your trips
        </Text>
        
        <View style={styles.interestsContainer}>
          {INTERESTS.map((interest) => {
            const isSelected = selectedInterests.includes(interest);
            return (
              <TouchableOpacity
                key={interest}
                style={[
                  styles.interestChip,
                  isSelected && styles.interestChipSelected,
                ]}
                onPress={() => onInterestToggle(interest)}
                activeOpacity={0.7}
              >
                <Text style={[
                  styles.interestChipText,
                  isSelected && styles.interestChipTextSelected,
                ]}>
                  {interest}
                </Text>
                {isSelected && (
                  <Check color={colors.surface} size={16} strokeWidth={3} />
                )}
              </TouchableOpacity>
            );
          })}
        </View>
        
        {selectedInterests.length > 0 && (
          <View style={styles.responseContainer}>
            <Text style={styles.responseText}>
              ✨ Love it! We&apos;ve got amazing recommendations for you.
            </Text>
          </View>
        )}
        
        <TouchableOpacity 
          style={[styles.continueButton, selectedInterests.length === 0 && styles.continueButtonDisabled]}
          onPress={onNext}
          activeOpacity={0.8}
          disabled={selectedInterests.length === 0}
        >
          <LinearGradient
            colors={selectedInterests.length > 0 ? [colors.gradient.sunset[0], colors.gradient.sunset[1]] : [colors.border, colors.border]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.continueButtonGradient}
          >
            <Text style={styles.continueButtonText}>Continue</Text>
            <ArrowRight color={colors.surface} size={24} strokeWidth={2} />
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

function SignUpScreen({ 
  onComplete 
}: { 
  onComplete: () => void;
}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const isValid = email.length > 0 && password.length > 0;

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.screenContainer}
    >
      <ScrollView 
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.iconCircle}>
          <Mail color={colors.primary} size={40} strokeWidth={2} />
        </View>
        
        <Text style={styles.questionTitle}>Create your account</Text>
        <Text style={styles.questionSubtitle}>
          Sign up to save your preferences and start planning trips
        </Text>
        
        <View style={styles.inputContainer}>
          <Mail color={colors.textLight} size={20} style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Email address"
            placeholderTextColor={colors.textLight}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
          />
        </View>

        <View style={styles.inputContainer}>
          <Lock color={colors.textLight} size={20} style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor={colors.textLight}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoCapitalize="none"
            autoComplete="password"
          />
        </View>
        
        <TouchableOpacity 
          style={[styles.continueButton, !isValid && styles.continueButtonDisabled]}
          onPress={onComplete}
          activeOpacity={0.8}
          disabled={!isValid}
        >
          <LinearGradient
            colors={isValid ? [colors.gradient.sunset[0], colors.gradient.sunset[1]] : [colors.border, colors.border]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.continueButtonGradient}
          >
            <Text style={styles.continueButtonText}>Create Account</Text>
            <Check color={colors.surface} size={24} strokeWidth={2} />
          </LinearGradient>
        </TouchableOpacity>

        <Text style={styles.disclaimerText}>
          By signing up, you agree to our Terms of Service and Privacy Policy
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function CreateTripPromptScreen({ 
  onContinue,
  userName
}: { 
  onContinue: () => void;
  userName: string;
}) {
  return (
    <View style={styles.screenContainer}>
      <LinearGradient
        colors={[colors.gradient.sunset[0], colors.gradient.sunset[1]]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFillObject}
      />
      
      <View style={styles.welcomeContent}>
        <View style={styles.welcomeIconContainer}>
          <Check color={colors.surface} size={64} strokeWidth={1.5} />
        </View>
        
        <Text style={styles.welcomeTitle}>All Set, {userName}!</Text>
        <Text style={styles.welcomeSubtitle}>Ready to plan your first trip?</Text>
        
        <Text style={styles.welcomeDescription}>
          Let&apos;s create an amazing itinerary tailored just for you. Tap below to start planning!
        </Text>
        
        <TouchableOpacity 
          style={styles.welcomeButton}
          onPress={onContinue}
          activeOpacity={0.8}
        >
          <Text style={styles.welcomeButtonText}>Plan My First Trip</Text>
          <ArrowRight color={colors.primary} size={24} strokeWidth={2} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default function OnboardingScreen() {
  const router = useRouter();
  const { completeOnboarding } = useOnboarding();
  const [currentStep, setCurrentStep] = useState(0);
  const [preferences, setPreferences] = useState<UserPreferences>({
    name: '',
    travelStyle: 'mixed',
    budgetPreference: 'moderate',
    interests: [],
  });



  const handleNext = () => {
    setCurrentStep(prev => prev + 1);
  };

  const handleComplete = async () => {
    await completeOnboarding(preferences);
    router.replace('/(tabs)');
    setTimeout(() => {
      router.push('/review-modal');
    }, 100);
  };

  const handleInterestToggle = (interest: string) => {
    setPreferences(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest],
    }));
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle={currentStep === 0 || currentStep === 6 ? 'light-content' : 'dark-content'} />
      
      {currentStep > 0 && currentStep < 6 && (
        <ProgressBar currentStep={currentStep} totalSteps={5} />
      )}

      {currentStep === 0 && (
        <WelcomeScreen onNext={handleNext} />
      )}
      
      {currentStep === 1 && (
        <NameScreen
          name={preferences.name}
          onNameChange={(text) => setPreferences(prev => ({ ...prev, name: text }))}
          onNext={handleNext}
        />
      )}
      
      {currentStep === 2 && (
        <TravelStyleScreen
          selectedStyle={preferences.travelStyle}
          onStyleSelect={(style) => setPreferences(prev => ({ ...prev, travelStyle: style }))}
          onNext={handleNext}
          userName={preferences.name}
        />
      )}
      
      {currentStep === 3 && (
        <BudgetScreen
          selectedBudget={preferences.budgetPreference}
          onBudgetSelect={(budget) => setPreferences(prev => ({ ...prev, budgetPreference: budget }))}
          onNext={handleNext}
        />
      )}
      
      {currentStep === 4 && (
        <InterestsScreen
          selectedInterests={preferences.interests}
          onInterestToggle={handleInterestToggle}
          onNext={handleNext}
        />
      )}

      {currentStep === 5 && (
        <SignUpScreen
          onComplete={handleNext}
        />
      )}

      {currentStep === 6 && (
        <CreateTripPromptScreen
          onContinue={handleComplete}
          userName={preferences.name}
        />
      )}

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  progressContainer: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 16,
    backgroundColor: colors.background,
  },
  progressBar: {
    height: 6,
    backgroundColor: colors.border,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 8,
    textAlign: 'center',
    fontFamily: 'Geist_500Medium' as const,
  },
  screenContainer: {
    flex: 1,
  },
  contentContainer: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 40,
  },
  welcomeContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  welcomeIconContainer: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
  },
  welcomeTitle: {
    fontSize: 36,
    fontWeight: '800' as const,
    color: colors.surface,
    textAlign: 'center',
    marginBottom: 12,
    letterSpacing: -1,
    fontFamily: 'Geist_800ExtraBold' as const,
  },
  welcomeSubtitle: {
    fontSize: 20,
    color: colors.surface,
    textAlign: 'center',
    marginBottom: 24,
    opacity: 0.9,
    fontFamily: 'Geist_500Medium' as const,
  },
  welcomeDescription: {
    fontSize: 16,
    color: colors.surface,
    textAlign: 'center',
    lineHeight: 24,
    opacity: 0.8,
    marginBottom: 48,
    fontFamily: 'Geist_400Regular' as const,
  },
  welcomeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.surface,
    paddingHorizontal: 32,
    paddingVertical: 18,
    borderRadius: 16,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  welcomeButtonText: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: colors.primary,
    fontFamily: 'Geist_600SemiBold' as const,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
    alignSelf: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  questionTitle: {
    fontSize: 28,
    fontWeight: '700' as const,
    color: colors.text,
    textAlign: 'center',
    marginBottom: 12,
    letterSpacing: -0.5,
    fontFamily: 'Geist_700Bold' as const,
  },
  questionSubtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 40,
    fontFamily: 'Geist_400Regular' as const,
  },
  nameInput: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 18,
    fontSize: 18,
    color: colors.text,
    borderWidth: 2,
    borderColor: colors.border,
    marginBottom: 24,
    fontFamily: 'Geist_500Medium' as const,
  },
  responseContainer: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: colors.border,
  },
  responseText: {
    fontSize: 15,
    color: colors.text,
    textAlign: 'center',
    fontFamily: 'Geist_500Medium' as const,
    lineHeight: 22,
  },
  optionsContainer: {
    gap: 12,
    marginBottom: 32,
  },
  optionCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 20,
    borderWidth: 2,
    borderColor: colors.border,
    position: 'relative',
  },
  optionCardSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.surface,
  },
  optionCardContent: {
    alignItems: 'center',
  },
  optionEmoji: {
    fontSize: 48,
    marginBottom: 12,
  },
  optionLabel: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: colors.text,
    marginBottom: 4,
    fontFamily: 'Geist_600SemiBold' as const,
  },
  optionDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    fontFamily: 'Geist_400Regular' as const,
  },
  checkmark: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  interestsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 32,
  },
  interestChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 24,
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderColor: colors.border,
  },
  interestChipSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  interestChipText: {
    fontSize: 14,
    fontWeight: '500' as const,
    color: colors.text,
    fontFamily: 'Geist_500Medium' as const,
  },
  interestChipTextSelected: {
    color: colors.surface,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 4,
    borderWidth: 2,
    borderColor: colors.border,
    marginBottom: 16,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
    paddingVertical: 14,
    fontFamily: 'Geist_400Regular' as const,
  },
  disclaimerText: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 16,
    lineHeight: 18,
    fontFamily: 'Geist_400Regular' as const,
  },
  starContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    marginVertical: 32,
  },
  continueButton: {
    borderRadius: 16,
    overflow: 'hidden',
    marginTop: 'auto',
    elevation: 4,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  continueButtonDisabled: {
    elevation: 0,
    shadowOpacity: 0,
  },
  continueButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 18,
  },
  continueButtonText: {
    fontSize: 17,
    fontWeight: '600' as const,
    color: colors.surface,
    fontFamily: 'Geist_600SemiBold' as const,
  },
});
