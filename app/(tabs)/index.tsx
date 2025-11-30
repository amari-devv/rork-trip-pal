import { useRouter } from 'expo-router';
import { Plane, Plus, Calendar, Users, User, Share as ShareIcon } from 'lucide-react-native';
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  StatusBar,
  Share,
  Alert,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { LinearGradient } from 'expo-linear-gradient';
import colors from '@/constants/colors';
import { useTrips } from '@/contexts/TripContext';
import { Trip } from '@/types/trip';

function formatDateRange(startDate: string, endDate: string): string {
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  const startMonth = start.toLocaleDateString('en-US', { month: 'short' });
  const endMonth = end.toLocaleDateString('en-US', { month: 'short' });
  const startDay = start.getDate();
  const endDay = end.getDate();
  
  if (startMonth === endMonth) {
    return `${startMonth} ${startDay}-${endDay}`;
  }
  return `${startMonth} ${startDay} - ${endMonth} ${endDay}`;
}

function getDaysCount(startDate: string, endDate: string): number {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end.getTime() - start.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays + 1;
}

function TripCard({ trip, onPress, onShare }: { trip: Trip; onPress: () => void; onShare: () => void }) {
  const daysCount = getDaysCount(trip.startDate, trip.endDate);
  const activitiesCount = trip.itinerary.reduce((sum, day) => sum + day.activities.length, 0);

  return (
    <TouchableOpacity 
      style={styles.tripCard} 
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.cardImageContainer}>
        {trip.imageUrl ? (
          <Image source={{ uri: trip.imageUrl }} style={styles.cardImage} />
        ) : (
          <LinearGradient
            colors={[colors.gradient.sunset[0], colors.gradient.sunset[1]]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.cardImage}
          >
            <Plane color={colors.surface} size={40} strokeWidth={1.5} />
          </LinearGradient>
        )}
        
        {trip.travelers >= 2 && (
          <TouchableOpacity 
            style={styles.shareButton} 
            onPress={(e) => {
              e.stopPropagation();
              onShare();
            }}
            activeOpacity={0.8}
          >
            <View style={styles.shareButtonBlur}>
              <ShareIcon color={colors.surface} size={18} strokeWidth={2.5} />
            </View>
          </TouchableOpacity>
        )}
      </View>
      
      <View style={styles.cardContent}>
        <Text style={styles.cardDestination}>{trip.destination}</Text>
        <Text style={styles.cardDates}>{formatDateRange(trip.startDate, trip.endDate)}</Text>
        
        <View style={styles.cardStats}>
          <View style={styles.cardStat}>
            <Calendar color={colors.textSecondary} size={14} />
            <Text style={styles.cardStatText}>{daysCount} days</Text>
          </View>
          <View style={styles.cardStat}>
            <Users color={colors.textSecondary} size={14} />
            <Text style={styles.cardStatText}>{trip.travelers} travelers</Text>
          </View>
        </View>
        
        {activitiesCount > 0 && (
          <Text style={styles.cardActivities}>{activitiesCount} activities planned</Text>
        )}
      </View>
    </TouchableOpacity>
  );
}

function EmptyState({ onCreateTrip }: { onCreateTrip: () => void }) {
  return (
    <View style={styles.emptyState}>
      <View style={[styles.emptyIcon, { backgroundColor: 'transparent' }]}>
        <Image 
          source={require('@/assets/images/icon.png')} 
          style={{ width: 100, height: 100, borderRadius: 20 }} 
          resizeMode="contain"
        />
      </View>
      
      <Text style={styles.emptyTitle}>No trips yet</Text>
      <Text style={styles.emptyDescription}>
        Start planning your next adventure and create unforgettable memories
      </Text>
      
      <TouchableOpacity 
        style={styles.emptyButton}
        onPress={onCreateTrip}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={[colors.gradient.sunset[0], colors.gradient.sunset[1]]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.emptyButtonGradient}
        >
          <Plus color={colors.surface} size={24} strokeWidth={2.5} />
          <Text style={styles.emptyButtonText}>Plan Your First Trip</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
}

export default function MyTripsScreen() {
  const router = useRouter();
  const { trips, isLoading } = useTrips();
  const insets = useSafeAreaInsets();

  const handleCreateTrip = () => {
    router.push('/create-trip' as any);
  };

  const handleTripPress = (tripId: string) => {
    router.push(`/trip/${tripId}` as any);
  };

  const handleShareTrip = async (trip: Trip) => {
    try {
      const shareMessage = `Join me on my trip to ${trip.destination}! ✈️\n\n📅 ${formatDateRange(trip.startDate, trip.endDate)}\n📍 ${trip.destination}\n\nView itinerary: https://rork.app/trip/${trip.id}`;
      
      const result = await Share.share({
        message: shareMessage,
        url: `https://rork.app/trip/${trip.id}`, // iOS
        title: `Trip to ${trip.destination}`, // Android
      });

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      if (Platform.OS !== 'web') {
        Alert.alert('Error', 'Could not share trip');
      } else {
        console.error('Error sharing trip:', error);
      }
    }
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <View style={[styles.loadingContainer, { paddingTop: insets.top }]}>
          <Text style={styles.loadingText}>Loading your trips...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      <View style={[styles.header, { paddingTop: insets.top + 20 }]}>
        <View>
          <Text style={styles.headerTitle}>My Trips</Text>
          <Text style={styles.headerSubtitle}>
            {trips.length === 0 ? 'Start your journey' : `${trips.length} ${trips.length === 1 ? 'trip' : 'trips'} planned`}
          </Text>
        </View>
        
        <TouchableOpacity 
          style={styles.profileButton}
          onPress={() => router.push('/profile')}
          activeOpacity={0.7}
        >
          <LinearGradient
            colors={[colors.gradient.sunset[0], colors.gradient.sunset[1]]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.profileButtonGradient}
          >
            <User color={colors.surface} size={20} strokeWidth={2} />
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {trips.length === 0 ? (
        <EmptyState onCreateTrip={handleCreateTrip} />
      ) : (
        <FlatList
          data={trips}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TripCard 
              trip={item} 
              onPress={() => handleTripPress(item.id)} 
              onShare={() => handleShareTrip(item)}
            />
          )}
          contentContainerStyle={[styles.listContent, { paddingBottom: 100 }]}
          showsVerticalScrollIndicator={false}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '700' as const,
    color: colors.text,
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 15,
    color: colors.textSecondary,
    marginTop: 4,
  },
  profileButton: {
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  profileButtonGradient: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    padding: 20,
    paddingTop: 8,
  },
  tripCard: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    marginBottom: 16,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  cardImageContainer: {
    width: '100%',
    height: 180,
    overflow: 'hidden',
  },
  cardImage: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  shareButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    zIndex: 10,
  },
  shareButtonBlur: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  cardContent: {
    padding: 16,
  },
  cardDestination: {
    fontSize: 22,
    fontWeight: '700' as const,
    color: colors.text,
    marginBottom: 4,
  },
  cardDates: {
    fontSize: 15,
    color: colors.textSecondary,
    marginBottom: 12,
  },
  cardStats: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 8,
  },
  cardStat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  cardStatText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  cardActivities: {
    fontSize: 13,
    color: colors.primary,
    fontWeight: '600' as const,
    marginTop: 4,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyIcon: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 28,
    fontWeight: '700' as const,
    color: colors.text,
    marginBottom: 12,
  },
  emptyDescription: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  emptyButton: {
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  emptyButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  emptyButtonText: {
    fontSize: 17,
    fontWeight: '600' as const,
    color: colors.surface,
  },
});
