import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Star, ArrowRight } from 'lucide-react-native';
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Pressable, Dimensions } from 'react-native';
import colors from '@/constants/colors';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function ReviewModal() {
  const router = useRouter();
  const [rating, setRating] = useState(0);

  const handleComplete = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(tabs)');
    }
  };

  return (
    <View style={styles.container}>
      <Pressable style={styles.overlay} onPress={handleComplete} />
      
      <View style={styles.contentContainer}>
        <View style={styles.handle} />
        
        <View style={styles.iconCircle}>
          <Star color={colors.accent} size={40} strokeWidth={2} />
        </View>
        
        <Text style={styles.questionTitle}>How was your experience?</Text>
        <Text style={styles.questionSubtitle}>
          Help us improve Trip Pal by sharing your feedback
        </Text>
        
        <View style={styles.starContainer}>
          {[1, 2, 3, 4, 5].map((star) => (
            <TouchableOpacity
              key={star}
              onPress={() => setRating(star)}
              activeOpacity={0.7}
              style={styles.starButton}
            >
              <Star
                color={star <= rating ? colors.accent : colors.border}
                fill={star <= rating ? colors.accent : 'transparent'}
                size={42}
                strokeWidth={2}
              />
            </TouchableOpacity>
          ))}
        </View>

        {rating > 0 && (
          <View style={styles.responseContainer}>
            <Text style={styles.responseText}>
              {rating >= 4 ? '🎉 Thank you! We\'re glad you love Trip Pal!' : '💙 Thank you for your feedback!'}
            </Text>
          </View>
        )}
        
        <TouchableOpacity 
          style={styles.continueButton}
          onPress={handleComplete}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={[colors.gradient.sunset[0], colors.gradient.sunset[1]]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.continueButtonGradient}
          >
            <Text style={styles.continueButtonText}>
              {rating > 0 ? 'Submit & Continue' : 'Skip for Now'}
            </Text>
            <ArrowRight color={colors.surface} size={24} strokeWidth={2} />
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.4)', // Semi-transparent background
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
  },
  contentContainer: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 40,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 10,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: colors.border,
    borderRadius: 2,
    marginBottom: 32,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  questionTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 8,
    fontFamily: 'Geist_700Bold',
  },
  questionSubtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 32,
    fontFamily: 'Geist_400Regular',
    maxWidth: '80%',
  },
  starContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    marginBottom: 32,
  },
  starButton: {
    padding: 4,
  },
  responseContainer: {
    backgroundColor: `${colors.primary}10`,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    width: '100%',
  },
  responseText: {
    fontSize: 15,
    color: colors.primary,
    textAlign: 'center',
    fontFamily: 'Geist_500Medium',
  },
  continueButton: {
    width: '100%',
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  continueButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
  },
  continueButtonText: {
    fontSize: 17,
    fontWeight: '600',
    color: colors.surface,
    fontFamily: 'Geist_600SemiBold',
  },
});
