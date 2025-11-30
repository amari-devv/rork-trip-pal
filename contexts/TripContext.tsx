import AsyncStorage from '@react-native-async-storage/async-storage';
import createContextHook from '@nkzw/create-context-hook';
import { useEffect, useState, useCallback, useMemo } from 'react';
import { Trip, Activity, DayItinerary } from '@/types/trip';

const STORAGE_KEY = '@trips';

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

function getDaysBetween(startDate: string, endDate: string): string[] {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const days: string[] = [];
  
  const current = new Date(start);
  while (current <= end) {
    days.push(current.toISOString().split('T')[0]);
    current.setDate(current.getDate() + 1);
  }
  
  return days;
}

function generateActivitiesForDay(dayIndex: number, destination: string, interests?: string[]): Activity[] {
  const activities: Activity[] = [];
  
  const ACTIVITY_IMAGES = {
    food: [
      'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80',
      'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=800&q=80',
      'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800&q=80',
      'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80',
    ],
    sightseeing: [
      'https://images.unsplash.com/photo-1533105079780-92b9be482077?w=800&q=80',
      'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?w=800&q=80',
      'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800&q=80',
      'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&q=80',
    ],
    nightlife: [
      'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&q=80',
      'https://images.unsplash.com/photo-1514525253440-b393332569ec?w=800&q=80',
    ],
  };

  const getRandomImage = (type: 'food' | 'sightseeing' | 'nightlife') => {
    const images = ACTIVITY_IMAGES[type];
    return images[Math.floor(Math.random() * images.length)];
  };
  
  const morningActivities = [
    { 
      title: 'Local Breakfast Experience', 
      type: 'restaurant' as const, 
      time: '9:00 AM', 
      timeOfDay: 'morning' as const,
      description: 'Start your day with authentic local pastries and coffee in a charming cafe.',
      imageUrl: getRandomImage('food')
    },
    { 
      title: 'Historic District Walking Tour', 
      type: 'activity' as const, 
      time: '10:30 AM', 
      timeOfDay: 'morning' as const,
      description: 'Explore the hidden gems and historic streets with a knowledgeable local guide.',
      imageUrl: getRandomImage('sightseeing')
    },
    { 
      title: 'Famous Museum Visit', 
      type: 'activity' as const, 
      time: '11:00 AM', 
      timeOfDay: 'morning' as const,
      description: 'Immerse yourself in art and history at the city\'s most renowned museum.',
      imageUrl: getRandomImage('sightseeing')
    },
  ];
  
  const afternoonActivities = [
    { 
      title: 'Lunch with a View', 
      type: 'restaurant' as const, 
      time: '1:00 PM', 
      timeOfDay: 'afternoon' as const,
      description: 'Enjoy delicious local cuisine while taking in panoramic views of the city.',
      imageUrl: getRandomImage('food')
    },
    { 
      title: 'City Landmark Exploration', 
      type: 'activity' as const, 
      time: '2:30 PM', 
      timeOfDay: 'afternoon' as const,
      description: 'Visit iconic landmarks and capture beautiful photos of the architecture.',
      imageUrl: getRandomImage('sightseeing')
    },
    { 
      title: 'Local Artisan Market', 
      type: 'activity' as const, 
      time: '4:00 PM', 
      timeOfDay: 'afternoon' as const,
      description: 'Browse unique handmade crafts and souvenirs at the bustling local market.',
      imageUrl: getRandomImage('sightseeing')
    },
  ];
  
  const eveningActivities = [
    { 
      title: 'Sunset Scenic Point', 
      type: 'activity' as const, 
      time: '6:30 PM', 
      timeOfDay: 'evening' as const,
      description: 'Watch the sun go down from the best vantage point in the city.',
      imageUrl: getRandomImage('sightseeing')
    },
    { 
      title: 'Traditional Dinner', 
      type: 'restaurant' as const, 
      time: '8:00 PM', 
      timeOfDay: 'evening' as const,
      description: 'Savor traditional dishes prepared with fresh local ingredients.',
      imageUrl: getRandomImage('food')
    },
  ];
  
  const nightActivities = [
    { 
      title: 'Evening Cultural Show', 
      type: 'activity' as const, 
      time: '9:30 PM', 
      timeOfDay: 'night' as const,
      description: 'Experience local music and dance performances in a vibrant atmosphere.',
      imageUrl: getRandomImage('nightlife')
    },
    { 
      title: 'Late Night Lounge', 
      type: 'activity' as const, 
      time: '10:30 PM', 
      timeOfDay: 'night' as const,
      description: 'Relax with signature cocktails in a sophisticated lounge setting.',
      imageUrl: getRandomImage('nightlife')
    },
  ];
  
  // Select random activities for the day
  const morning = morningActivities[Math.floor(Math.random() * morningActivities.length)];
  const afternoon = afternoonActivities[Math.floor(Math.random() * afternoonActivities.length)];
  const evening = eveningActivities[Math.floor(Math.random() * eveningActivities.length)];
  
  activities.push(
    { id: generateId(), ...morning, location: destination },
    { id: generateId(), ...afternoon, location: destination },
    { id: generateId(), ...evening, location: destination }
  );
  
  // Add night activity if interested or random chance
  if (interests && (interests.includes('nightlife') || Math.random() > 0.6)) {
    const night = nightActivities[Math.floor(Math.random() * nightActivities.length)];
    activities.push({ id: generateId(), ...night, location: destination });
  }
  
  return activities;
}

export const [TripProvider, useTrips] = createContextHook(() => {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadTrips = useCallback(async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) {
            setTrips(parsed);
          } else {
            console.log('Invalid trips data in storage, resetting...');
            await AsyncStorage.removeItem(STORAGE_KEY);
            setTrips([]);
          }
        } catch (parseError) {
          console.error('Failed to parse trips data:', parseError);
          console.log('Clearing corrupt data...');
          await AsyncStorage.removeItem(STORAGE_KEY);
          setTrips([]);
        }
      }
    } catch (error) {
      console.error('Failed to load trips:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTrips();
  }, [loadTrips]);

  const saveTrips = useCallback(async (updatedTrips: Trip[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedTrips));
      setTrips(updatedTrips);
    } catch (error) {
      console.error('Failed to save trips:', error);
    }
  }, []);

  const createTrip = useCallback(async (
    destination: string,
    startDate: string,
    endDate: string,
    travelers: number,
    imageUrl?: string,
    interests?: string[]
  ) => {
    const days = getDaysBetween(startDate, endDate);
    const itinerary: DayItinerary[] = days.map((date, index) => ({
      date,
      activities: generateActivitiesForDay(index, destination, interests),
    }));

    const newTrip: Trip = {
      id: generateId(),
      destination,
      startDate,
      endDate,
      travelers,
      imageUrl,
      interests,
      itinerary,
      createdAt: new Date().toISOString(),
    };

    const updatedTrips = [newTrip, ...trips];
    await saveTrips(updatedTrips);
    return newTrip;
  }, [trips, saveTrips]);

  const deleteTrip = useCallback(async (tripId: string) => {
    const updatedTrips = trips.filter(trip => trip.id !== tripId);
    await saveTrips(updatedTrips);
  }, [trips, saveTrips]);

  const addActivity = useCallback(async (tripId: string, date: string, activity: Omit<Activity, 'id'>) => {
    const updatedTrips = trips.map(trip => {
      if (trip.id !== tripId) return trip;

      const updatedItinerary = trip.itinerary.map(day => {
        if (day.date !== date) return day;

        return {
          ...day,
          activities: [...day.activities, { ...activity, id: generateId() }],
        };
      });

      return { ...trip, itinerary: updatedItinerary };
    });

    await saveTrips(updatedTrips);
  }, [trips, saveTrips]);

  const updateActivity = useCallback(async (
    tripId: string,
    date: string,
    activityId: string,
    updates: Partial<Activity>
  ) => {
    const updatedTrips = trips.map(trip => {
      if (trip.id !== tripId) return trip;

      const updatedItinerary = trip.itinerary.map(day => {
        if (day.date !== date) return day;

        return {
          ...day,
          activities: day.activities.map(activity =>
            activity.id === activityId ? { ...activity, ...updates } : activity
          ),
        };
      });

      return { ...trip, itinerary: updatedItinerary };
    });

    await saveTrips(updatedTrips);
  }, [trips, saveTrips]);

  const deleteActivity = useCallback(async (tripId: string, date: string, activityId: string) => {
    const updatedTrips = trips.map(trip => {
      if (trip.id !== tripId) return trip;

      const updatedItinerary = trip.itinerary.map(day => {
        if (day.date !== date) return day;

        return {
          ...day,
          activities: day.activities.filter(activity => activity.id !== activityId),
        };
      });

      return { ...trip, itinerary: updatedItinerary };
    });

    await saveTrips(updatedTrips);
  }, [trips, saveTrips]);

  const getTripById = useCallback((tripId: string): Trip | undefined => {
    return trips.find(trip => trip.id === tripId);
  }, [trips]);

  return useMemo(() => ({
    trips,
    isLoading,
    createTrip,
    deleteTrip,
    addActivity,
    updateActivity,
    deleteActivity,
    getTripById,
  }), [trips, isLoading, createTrip, deleteTrip, addActivity, updateActivity, deleteActivity, getTripById]);
});
