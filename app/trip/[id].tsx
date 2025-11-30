import { useRouter, useLocalSearchParams, Stack } from 'expo-router';
import {
  Plane,
  Hotel,
  Utensils,
  Camera,
  Car,
  MoreHorizontal,
  Plus,
  ArrowLeft,
  Trash2,
  Calendar,
  Users,
  Sun,
  Sunset,
  Moon,
  MapPin,
  Clock,
  Navigation,
} from 'lucide-react-native';
import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Image,
  Animated,
  Dimensions,
  PanResponder,
} from 'react-native';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import MapView, { Marker, PROVIDER_DEFAULT } from 'react-native-maps';
import * as Location from 'expo-location';

import { GestureHandlerRootView } from 'react-native-gesture-handler';
import colors from '@/constants/colors';
import { useTrips } from '@/contexts/TripContext';
import { Activity } from '@/types/trip';



const ACTIVITY_ICONS = {
  flight: Plane,
  hotel: Hotel,
  restaurant: Utensils,
  activity: Camera,
  transport: Car,
  other: MoreHorizontal,
};

const ACTIVITY_COLORS = {
  flight: colors.secondary,
  hotel: colors.primary,
  restaurant: colors.accent,
  activity: colors.success,
  transport: colors.textSecondary,
  other: colors.textLight,
};

const TIME_OF_DAY_ICONS = {
  morning: Sun,
  afternoon: Sun,
  evening: Sunset,
  night: Moon,
};

const TIME_OF_DAY_COLORS = {
  morning: '#FFB800',
  afternoon: '#FF8C00',
  evening: '#FF6B35',
  night: '#4A5FC1',
};

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
}

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

function ActivityCard({
  activity,
  onDelete,
  onPress,
}: {
  activity: Activity;
  onDelete: () => void;
  onPress: () => void;
}) {
  const Icon = ACTIVITY_ICONS[activity.type];
  const iconColor = ACTIVITY_COLORS[activity.type];
  const TimeIcon = activity.timeOfDay ? TIME_OF_DAY_ICONS[activity.timeOfDay] : Clock;
  const timeColor = activity.timeOfDay ? TIME_OF_DAY_COLORS[activity.timeOfDay] : colors.textSecondary;

  const renderRightActions = (
    progress: Animated.AnimatedInterpolation<number>,
    dragX: Animated.AnimatedInterpolation<number>
  ) => {
    return (
      <TouchableOpacity
        style={styles.deleteAction}
        onPress={onDelete}
      >
        <View style={styles.deleteActionContent}>
          <Trash2 color={colors.surface} size={24} strokeWidth={2} />
          <Text style={styles.deleteActionText}>Delete</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <Swipeable renderRightActions={renderRightActions}>
      <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
        <View style={styles.activityCard}>
          {activity.imageUrl && (
            <Image 
              source={{ uri: activity.imageUrl }} 
              style={styles.activityImage}
            />
          )}
          <View style={styles.activityMain}>
            <View style={styles.activityHeader}>
              <View style={styles.activityTypeTag}>
                 <Icon color={iconColor} size={14} strokeWidth={2.5} />
                 <Text style={[styles.activityTypeText, { color: iconColor }]}>{activity.type}</Text>
              </View>
              {activity.time && (
                <View style={styles.activityTimeContainer}>
                  <TimeIcon color={timeColor} size={14} strokeWidth={2} />
                  <Text style={styles.activityTime}>{activity.time}</Text>
                </View>
              )}
            </View>

            <Text style={styles.activityTitle}>{activity.title}</Text>
            
            {activity.description && (
              <Text style={styles.activityDescription} numberOfLines={2}>{activity.description}</Text>
            )}
            
            {activity.location && (
              <View style={styles.locationContainer}>
                <MapPin color={colors.primary} size={12} />
                <Text style={styles.activityLocation} numberOfLines={1}>{activity.location}</Text>
              </View>
            )}
          </View>
        </View>
      </TouchableOpacity>
    </Swipeable>
  );
}

function AddActivityModal({
  visible,
  onClose,
  onAdd,
}: {
  visible: boolean;
  onClose: () => void;
  onAdd: (activity: Omit<Activity, 'id'>) => void;
}) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [time, setTime] = useState('');
  const [location, setLocation] = useState('');
  const [type, setType] = useState<Activity['type']>('activity');
  const [timeOfDay, setTimeOfDay] = useState<Activity['timeOfDay']>('morning');

  const handleAdd = () => {
    if (!title.trim()) {
      Alert.alert('Missing Information', 'Please enter an activity title');
      return;
    }

    onAdd({
      title: title.trim(),
      description: description.trim() || undefined,
      time: time.trim() || undefined,
      location: location.trim() || undefined,
      type,
      timeOfDay,
    });

    setTitle('');
    setDescription('');
    setTime('');
    setLocation('');
    setType('activity');
    setTimeOfDay('morning');
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <SafeAreaView style={styles.modalContainer} edges={['top', 'bottom']}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalKeyboard}
        >
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Add Activity</Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.modalCancel}>Cancel</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalScroll} keyboardShouldPersistTaps="handled">
            <View style={styles.modalContent}>
              <View style={styles.modalInputGroup}>
                <Text style={styles.modalLabel}>Activity Type</Text>
                <View style={styles.typeSelector}>
                  {(Object.keys(ACTIVITY_ICONS) as Activity['type'][]).map((activityType) => {
                    const Icon = ACTIVITY_ICONS[activityType];
                    const isSelected = type === activityType;
                    return (
                      <TouchableOpacity
                        key={activityType}
                        style={[
                          styles.typeOption,
                          isSelected && styles.typeOptionSelected,
                        ]}
                        onPress={() => setType(activityType)}
                      >
                        <Icon
                          color={isSelected ? colors.surface : colors.textSecondary}
                          size={20}
                          strokeWidth={2}
                        />
                        <Text
                          style={[
                            styles.typeOptionText,
                            isSelected && styles.typeOptionTextSelected,
                          ]}
                        >
                          {activityType}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>

              <View style={styles.modalInputGroup}>
                <Text style={styles.modalLabel}>Title *</Text>
                <TextInput
                  style={styles.modalInput}
                  placeholder="e.g., Visit Eiffel Tower"
                  placeholderTextColor={colors.textLight}
                  value={title}
                  onChangeText={setTitle}
                  autoCapitalize="words"
                />
              </View>

              <View style={styles.modalInputGroup}>
                <Text style={styles.modalLabel}>Time</Text>
                <TextInput
                  style={styles.modalInput}
                  placeholder="e.g., 10:00 AM"
                  placeholderTextColor={colors.textLight}
                  value={time}
                  onChangeText={setTime}
                />
              </View>

              <View style={styles.modalInputGroup}>
                <Text style={styles.modalLabel}>Location</Text>
                <TextInput
                  style={styles.modalInput}
                  placeholder="e.g., Champ de Mars"
                  placeholderTextColor={colors.textLight}
                  value={location}
                  onChangeText={setLocation}
                  autoCapitalize="words"
                />
              </View>

              <View style={styles.modalInputGroup}>
                <Text style={styles.modalLabel}>Time of Day</Text>
                <View style={styles.typeSelector}>
                  {(['morning', 'afternoon', 'evening', 'night'] as Activity['timeOfDay'][]).map((tod) => {
                    if (!tod) return null;
                    const TimeIcon = TIME_OF_DAY_ICONS[tod];
                    const isSelected = timeOfDay === tod;
                    return (
                      <TouchableOpacity
                        key={tod}
                        style={[
                          styles.typeOption,
                          isSelected && { ...styles.typeOptionSelected, backgroundColor: TIME_OF_DAY_COLORS[tod] },
                        ]}
                        onPress={() => setTimeOfDay(tod)}
                      >
                        <TimeIcon
                          color={isSelected ? colors.surface : colors.textSecondary}
                          size={16}
                          strokeWidth={2}
                        />
                        <Text
                          style={[
                            styles.typeOptionText,
                            isSelected && styles.typeOptionTextSelected,
                          ]}
                        >
                          {tod}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>

              <View style={styles.modalInputGroup}>
                <Text style={styles.modalLabel}>Description</Text>
                <TextInput
                  style={[styles.modalInput, styles.modalTextArea]}
                  placeholder="Add notes or details..."
                  placeholderTextColor={colors.textLight}
                  value={description}
                  onChangeText={setDescription}
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                />
              </View>
            </View>
          </ScrollView>

          <View style={styles.modalFooter}>
            <TouchableOpacity style={styles.addActivityButton} onPress={handleAdd}>
              <LinearGradient
                colors={[colors.gradient.sunset[0], colors.gradient.sunset[1]]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.addActivityButtonGradient}
              >
                <Text style={styles.addActivityButtonText}>Add Activity</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Modal>
  );
}

export default function TripDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getTripById, deleteTrip, addActivity, deleteActivity } = useTrips();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<Location.LocationObject | null>(null);
  const [locationPermission, setLocationPermission] = useState(false);
  const bottomSheetAnim = useRef(new Animated.Value(1)).current;
  const mapRef = useRef<MapView>(null);

  const { height: SCREEN_HEIGHT } = Dimensions.get('window');
  const snapPoints = useMemo(() => [0.25, 0.50, 0.85], []);
  const [currentSnapIndex, setCurrentSnapIndex] = useState(1);

  const getSheetHeight = useCallback((index: number) => {
    return SCREEN_HEIGHT * snapPoints[index];
  }, [SCREEN_HEIGHT, snapPoints]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return Math.abs(gestureState.dy) > 5;
      },
      onPanResponderMove: (_, gestureState) => {
        const currentHeight = getSheetHeight(currentSnapIndex);
        const newHeight = currentHeight - gestureState.dy;
        const normalizedValue = newHeight / SCREEN_HEIGHT;
        const clampedValue = Math.max(snapPoints[0], Math.min(snapPoints[2], normalizedValue));
        bottomSheetAnim.setValue(clampedValue);
      },
      onPanResponderRelease: (_, gestureState) => {
        const currentHeight = getSheetHeight(currentSnapIndex);
        const newHeight = currentHeight - gestureState.dy;
        const normalizedValue = newHeight / SCREEN_HEIGHT;
        
        let closestIndex = 0;
        let minDistance = Math.abs(normalizedValue - snapPoints[0]);
        snapPoints.forEach((point, index) => {
          const distance = Math.abs(normalizedValue - point);
          if (distance < minDistance) {
            minDistance = distance;
            closestIndex = index;
          }
        });
        
        setCurrentSnapIndex(closestIndex);
        Animated.spring(bottomSheetAnim, {
          toValue: snapPoints[closestIndex],
          useNativeDriver: false,
          tension: 50,
          friction: 10,
        }).start();
      },
    })
  ).current;

  const trip = getTripById(id);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Location permission denied');
        setLocationPermission(false);
        return;
      }
      
      setLocationPermission(true);
      
      try {
        const location = await Location.getCurrentPositionAsync({});
        setUserLocation(location);
      } catch (error) {
        console.log('Error getting location:', error);
      }
    })();
  }, []);

  const allActivitiesWithCoordinates = useMemo(() => {
    if (!trip) return [];
    
    return trip.itinerary.flatMap(day => 
      day.activities
        .filter(activity => activity.coordinates)
        .map(activity => ({
          ...activity,
          date: day.date,
        }))
    );
  }, [trip]);



  const centerMapToUserLocation = () => {
    if (userLocation && mapRef.current) {
      mapRef.current.animateToRegion({
        latitude: userLocation.coords.latitude,
        longitude: userLocation.coords.longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      }, 1000);
    }
  };

  const focusOnActivity = (activity: Activity & { date: string }) => {
    if (activity.coordinates && mapRef.current) {
      mapRef.current.animateToRegion({
        latitude: activity.coordinates.latitude,
        longitude: activity.coordinates.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      }, 500);
    }
  };

  if (!trip) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Trip not found</Text>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.errorLink}>Go back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const handleDeleteTrip = () => {
    Alert.alert(
      'Delete Trip',
      'Are you sure you want to delete this trip? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await deleteTrip(trip.id);
            router.back();
          },
        },
      ]
    );
  };

  const handleAddActivity = (date: string) => {
    setSelectedDate(date);
    setModalVisible(true);
  };

  const handleActivityAdd = async (activity: Omit<Activity, 'id'>) => {
    if (selectedDate) {
      await addActivity(trip.id, selectedDate, activity);
    }
  };

  const handleDeleteActivity = (date: string, activityId: string) => {
    Alert.alert('Delete Activity', 'Are you sure you want to delete this activity?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          await deleteActivity(trip.id, date, activityId);
        },
      },
    ]);
  };

  const getInitialRegion = () => {
    if (allActivitiesWithCoordinates.length > 0) {
      const firstActivity = allActivitiesWithCoordinates[0];
      return {
        latitude: firstActivity.coordinates!.latitude,
        longitude: firstActivity.coordinates!.longitude,
        latitudeDelta: 0.1,
        longitudeDelta: 0.1,
      };
    }
    
    if (userLocation) {
      return {
        latitude: userLocation.coords.latitude,
        longitude: userLocation.coords.longitude,
        latitudeDelta: 0.1,
        longitudeDelta: 0.1,
      };
    }
    
    return {
      latitude: 37.78825,
      longitude: -122.4324,
      latitudeDelta: 0.1,
      longitudeDelta: 0.1,
    };
  };

  const initialRegion = getInitialRegion();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: '',
          headerTransparent: true,
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => router.back()}
              style={styles.headerButton}
            >
              <ArrowLeft color={colors.text} size={24} strokeWidth={2} />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <TouchableOpacity
              onPress={handleDeleteTrip}
              style={styles.headerButton}
            >
              <Trash2 color={colors.error} size={22} strokeWidth={2} />
            </TouchableOpacity>
          ),
        }}
      />
      
      <View style={styles.container}>
        <MapView
          ref={mapRef}
          provider={PROVIDER_DEFAULT}
          style={styles.map}
          initialRegion={initialRegion}
          showsUserLocation={locationPermission}
          showsMyLocationButton={false}
        >
          {allActivitiesWithCoordinates.map((activity) => {
            const markerColor = ACTIVITY_COLORS[activity.type];
            
            return (
              <Marker
                key={activity.id}
                coordinate={{
                  latitude: activity.coordinates!.latitude,
                  longitude: activity.coordinates!.longitude,
                }}
                title={activity.title}
                description={activity.location}
                pinColor={markerColor}
              />
            );
          })}
        </MapView>

        {locationPermission && (
          <TouchableOpacity 
            style={styles.locationButton}
            onPress={centerMapToUserLocation}
          >
            <Navigation color={colors.primary} size={24} strokeWidth={2} />
          </TouchableOpacity>
        )}

        <Animated.View
          style={[
            styles.bottomSheetContainer,
            {
              height: bottomSheetAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0, SCREEN_HEIGHT],
              }),
            },
          ]}
        >
          <View {...panResponder.panHandlers} style={styles.bottomSheetHandle}>
            <View style={styles.bottomSheetIndicator} />
          </View>
          <ScrollView
            contentContainerStyle={styles.bottomSheetContent}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.sheetHeader}>
              <View>
                <Text style={styles.destination}>{trip.destination}</Text>
                <View style={styles.tripInfo}>
                  <View style={styles.tripInfoItem}>
                    <Calendar color={colors.textSecondary} size={14} />
                    <Text style={styles.tripInfoText}>
                      {formatDateRange(trip.startDate, trip.endDate)}
                    </Text>
                  </View>
                  <View style={styles.tripInfoItem}>
                    <Users color={colors.textSecondary} size={14} />
                    <Text style={styles.tripInfoText}>{trip.travelers} travelers</Text>
                  </View>
                </View>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>My Spots</Text>
              <Text style={styles.spotsCount}>{allActivitiesWithCoordinates.length} Saved</Text>
            </View>

            {trip.itinerary.map((day, index) => (
              <View key={day.date} style={styles.daySection}>
                <View style={styles.dayHeader}>
                  <View>
                    <Text style={styles.dayTitle}>Day {index + 1}</Text>
                    <Text style={styles.dayDate}>{formatDate(day.date)}</Text>
                  </View>
                  <TouchableOpacity
                    style={styles.addDayButton}
                    onPress={() => handleAddActivity(day.date)}
                  >
                    <Plus color={colors.primary} size={20} strokeWidth={2.5} />
                  </TouchableOpacity>
                </View>

                {day.activities.length === 0 ? (
                  <View style={styles.emptyDay}>
                    <Text style={styles.emptyDayText}>No activities planned yet</Text>
                  </View>
                ) : (
                  <View style={styles.activitiesList}>
                    {day.activities.map((activity) => (
                      <ActivityCard
                        key={activity.id}
                        activity={activity}
                        onDelete={() => handleDeleteActivity(day.date, activity.id)}
                        onPress={() => focusOnActivity({ ...activity, date: day.date })}
                      />
                    ))}
                  </View>
                )}
              </View>
            ))}
          </ScrollView>
        </Animated.View>

        <AddActivityModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          onAdd={handleActivityAdd}
        />
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  locationButton: {
    position: 'absolute',
    top: 100,
    right: 20,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  bottomSheetContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  bottomSheetHandle: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  bottomSheetIndicator: {
    backgroundColor: colors.border,
    width: 40,
    height: 4,
    borderRadius: 2,
  },
  bottomSheetContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  sheetHeader: {
    paddingTop: 4,
    paddingBottom: 12,
  },
  destination: {
    fontSize: 26,
    fontWeight: '700' as const,
    color: colors.text,
    marginBottom: 8,
  },
  tripInfo: {
    flexDirection: 'row',
    gap: 16,
  },
  tripInfoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  tripInfoText: {
    fontSize: 13,
    color: colors.textSecondary,
    fontWeight: '500' as const,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700' as const,
    color: colors.text,
  },
  spotsCount: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '500' as const,
  },
  daySection: {
    marginBottom: 20,
  },
  dayHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  dayTitle: {
    fontSize: 17,
    fontWeight: '600' as const,
    color: colors.text,
  },
  dayDate: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
  },
  addDayButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primary + '20',
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyDay: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderStyle: 'dashed',
  },
  emptyDayText: {
    fontSize: 14,
    color: colors.textLight,
  },
  activitiesList: {
    gap: 10,
  },
  activityCard: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    flexDirection: 'row',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    overflow: 'hidden',
    minHeight: 100,
  },
  activityImage: {
    width: 90,
    height: '100%',
    backgroundColor: colors.background,
  },
  activityMain: {
    flex: 1,
    padding: 10,
    gap: 4,
    justifyContent: 'center',
  },
  activityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  activityTypeTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.background,
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 6,
  },
  activityTypeText: {
    fontSize: 9,
    fontWeight: '700' as const,
    textTransform: 'uppercase',
  },
  activityTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  activityTime: {
    fontSize: 11,
    color: colors.textSecondary,
    fontWeight: '500' as const,
  },
  activityTitle: {
    fontSize: 15,
    fontWeight: '700' as const,
    color: colors.text,
    marginBottom: 2,
  },
  activityDescription: {
    fontSize: 12,
    color: colors.textSecondary,
    lineHeight: 16,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    marginTop: 2,
  },
  activityLocation: {
    fontSize: 11,
    color: colors.primary,
    fontWeight: '600' as const,
    flex: 1,
  },
  deleteAction: {
    backgroundColor: colors.error,
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    height: '100%',
    borderTopRightRadius: 14,
    borderBottomRightRadius: 14,
  },
  deleteActionContent: {
    alignItems: 'center',
    gap: 4,
  },
  deleteActionText: {
    color: colors.surface,
    fontSize: 12,
    fontWeight: '600' as const,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: colors.text,
    marginBottom: 12,
  },
  errorLink: {
    fontSize: 16,
    color: colors.primary,
    fontWeight: '600' as const,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  modalKeyboard: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: colors.text,
  },
  modalCancel: {
    fontSize: 16,
    color: colors.primary,
    fontWeight: '600' as const,
  },
  modalScroll: {
    flex: 1,
  },
  modalContent: {
    padding: 20,
    gap: 24,
  },
  modalInputGroup: {
    gap: 8,
  },
  modalLabel: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: colors.text,
  },
  modalInput: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.border,
  },
  modalTextArea: {
    minHeight: 100,
    paddingTop: 16,
  },
  typeSelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  typeOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  typeOptionSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  typeOptionText: {
    fontSize: 14,
    color: colors.textSecondary,
    textTransform: 'capitalize',
  },
  typeOptionTextSelected: {
    color: colors.surface,
    fontWeight: '600' as const,
  },
  modalFooter: {
    padding: 20,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  addActivityButton: {
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  addActivityButtonGradient: {
    paddingVertical: 18,
    alignItems: 'center',
  },
  addActivityButtonText: {
    fontSize: 17,
    fontWeight: '700' as const,
    color: colors.surface,
  },
});
