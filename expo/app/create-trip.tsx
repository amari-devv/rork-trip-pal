import { useRouter } from 'expo-router';
import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  TextInput,
  ActivityIndicator,
  LayoutAnimation,
  Platform,
  UIManager,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Home, Calendar as CalendarIcon, Users, MapPin, Search, X, ChevronLeft, ChevronRight, Minus, Plus, ChevronDown, ChevronUp } from 'lucide-react-native';
import colors from '@/constants/colors';
import { useTrips } from '@/contexts/TripContext';
import { INTERESTS } from '@/constants/interests';

// Enable LayoutAnimation for Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const POPULAR_DESTINATIONS = [
  'Paris, France',
  'Tokyo, Japan',
  'New York, USA',
  'London, UK',
  'Barcelona, Spain',
  'Rome, Italy',
  'Dubai, UAE',
  'Sydney, Australia',
  'Bali, Indonesia',
  'Bangkok, Thailand',
  'Istanbul, Turkey',
  'Amsterdam, Netherlands',
  'Prague, Czech Republic',
  'Singapore',
  'Los Angeles, USA',
  'Miami, USA',
  'Maldives',
  'Santorini, Greece',
  'Lisbon, Portugal',
  'Berlin, Germany',
];

// --- Calendar Logic ---

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const DAYS_OF_WEEK = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

function InlineCalendar({ 
  onSelectDate, 
  selectedDate, 
  minDate,
  maxDate
}: { 
  onSelectDate: (date: Date) => void; 
  selectedDate?: Date | null; 
  minDate?: Date;
  maxDate?: Date;
}) {
  const [currentDate, setCurrentDate] = useState(selectedDate || new Date());
  
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const handleDayPress = (day: number) => {
    const newDate = new Date(year, month, day);
    onSelectDate(newDate);
  };

  const isDateDisabled = (day: number) => {
    const checkDate = new Date(year, month, day);
    checkDate.setHours(0,0,0,0);
    
    if (minDate) {
      const minDateSimple = new Date(minDate);
      minDateSimple.setHours(0,0,0,0);
      if (checkDate < minDateSimple) return true;
    }
    
    if (maxDate) {
      const maxDateSimple = new Date(maxDate);
      maxDateSimple.setHours(0,0,0,0);
      if (checkDate > maxDateSimple) return true;
    }
    
    return false;
  };

  const isDateSelected = (day: number) => {
    if (!selectedDate) return false;
    return (
      selectedDate.getDate() === day &&
      selectedDate.getMonth() === month &&
      selectedDate.getFullYear() === year
    );
  };

  const renderCalendarDays = () => {
    const days = [];
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<View key={`empty-${i}`} style={styles.calendarDayCell} />);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const disabled = isDateDisabled(day);
      const selected = isDateSelected(day);

      days.push(
        <TouchableOpacity
          key={`day-${day}`}
          style={[
            styles.calendarDayCell,
            selected && styles.calendarDaySelected,
          ]}
          onPress={() => !disabled && handleDayPress(day)}
          disabled={disabled}
          activeOpacity={0.7}
        >
          <Text
            style={[
              styles.calendarDayText,
              selected && styles.calendarDayTextSelected,
              disabled && styles.calendarDayTextDisabled,
            ]}
          >
            {day}
          </Text>
        </TouchableOpacity>
      );
    }
    return days;
  };

  return (
    <View style={styles.inlineCalendarContainer}>
      <View style={styles.monthSelector}>
        <TouchableOpacity onPress={prevMonth} style={styles.monthNavButton}>
          <ChevronLeft color={colors.text} size={20} />
        </TouchableOpacity>
        <Text style={styles.monthText}>
          {MONTH_NAMES[month]} {year}
        </Text>
        <TouchableOpacity onPress={nextMonth} style={styles.monthNavButton}>
          <ChevronRight color={colors.text} size={20} />
        </TouchableOpacity>
      </View>

      <View style={styles.weekDaysRow}>
        {DAYS_OF_WEEK.map((day, index) => (
          <Text key={index} style={styles.weekDayText}>{day}</Text>
        ))}
      </View>

      <View style={styles.daysGrid}>
        {renderCalendarDays()}
      </View>
    </View>
  );
}

// --- Main Screen ---

export default function CreateTripScreen() {
  const router = useRouter();
  const { createTrip } = useTrips();

  // Destination State
  const [destinationSearch, setDestinationSearch] = useState('');
  const [selectedDestination, setSelectedDestination] = useState('');
  const [showDestinationSuggestions, setShowDestinationSuggestions] = useState(false);

  // Date State
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [activeDateInput, setActiveDateInput] = useState<'start' | 'end' | null>(null);

  // Travelers State
  const [travelers, setTravelers] = useState(1);

  // Interests State
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  
  // Loading State
  const [isGeneratingTrip, setIsGeneratingTrip] = useState(false);

  // Derived State
  const filteredDestinations = useMemo(() => {
    if (!destinationSearch.trim()) return POPULAR_DESTINATIONS;
    return POPULAR_DESTINATIONS.filter(dest =>
      dest.toLowerCase().includes(destinationSearch.toLowerCase())
    );
  }, [destinationSearch]);

  const toggleInterest = (interestId: string) => {
    setSelectedInterests(prev =>
      prev.includes(interestId)
        ? prev.filter(id => id !== interestId)
        : [...prev, interestId]
    );
  };

  const toggleDateInput = (input: 'start' | 'end') => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setActiveDateInput(current => current === input ? null : input);
  };

  const handleDateSelect = (date: Date) => {
    if (activeDateInput === 'start') {
      setStartDate(date);
      if (endDate && date > endDate) {
        setEndDate(null);
      }
      // Auto switch to end date
      setActiveDateInput('end');
    } else {
      setEndDate(date);
      // Close calendar after end date selection
      setActiveDateInput(null);
    }
  };

  const handleCreateTrip = async () => {
    if (!selectedDestination) {
      Alert.alert('Missing Information', 'Please select a destination.');
      return;
    }

    if (!startDate || !endDate) {
      Alert.alert('Missing Dates', 'Please select both start and end dates.');
      return;
    }

    if (endDate < startDate) {
      Alert.alert('Invalid Dates', 'End date must be after start date.');
      return;
    }

    setIsGeneratingTrip(true);

    try {
      const formatDate = (date: Date) => date.toISOString().split('T')[0];
      
      const newTrip = await createTrip(
        selectedDestination,
        formatDate(startDate),
        formatDate(endDate),
        travelers,
        undefined,
        selectedInterests.length > 0 ? selectedInterests : undefined
      );
      
      setIsGeneratingTrip(false);
      router.back();
      // Small delay to allow navigation animation to finish or start
      setTimeout(() => {
        router.push(`/trip/${newTrip.id}` as any);
      }, 100);
    } catch (error) {
      console.error('Failed to create trip:', error);
      setIsGeneratingTrip(false);
      Alert.alert('Error', 'Failed to create trip. Please try again.');
    }
  };

  const handleHomePress = () => {
    Alert.alert(
      'Leave Trip Planning?',
      'Are you sure you want to discard this trip?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Leave', style: 'destructive', onPress: () => router.back() },
      ]
    );
  };

  const formatDateDisplay = (date: Date | null) => {
    if (!date) return 'Select Date';
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.headerText}>Plan Your Trip</Text>
          <TouchableOpacity 
            style={styles.homeButton}
            onPress={handleHomePress}
            activeOpacity={0.7}
          >
            <Home color={colors.text} size={24} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Destination Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <MapPin color={colors.primary} size={20} />
            <Text style={styles.sectionTitle}>Where to?</Text>
          </View>
          
          <View style={styles.searchContainer}>
            <Search color={colors.textLight} size={20} style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search destinations (e.g. Paris, Tokyo)"
              placeholderTextColor={colors.textLight}
              value={destinationSearch}
              onChangeText={(text) => {
                setDestinationSearch(text);
                setShowDestinationSuggestions(true);
                if (text.trim()) {
                  setSelectedDestination(text);
                }
              }}
              onFocus={() => setShowDestinationSuggestions(true)}
            />
            {destinationSearch.length > 0 && (
              <TouchableOpacity
                onPress={() => {
                  setDestinationSearch('');
                  setSelectedDestination('');
                  setShowDestinationSuggestions(false);
                }}
                style={styles.clearButton}
              >
                <X color={colors.textLight} size={20} />
              </TouchableOpacity>
            )}
          </View>

          {/* Suggestions Dropdown */}
          {showDestinationSuggestions && filteredDestinations.length > 0 && (
            <View style={styles.suggestionsContainer}>
              <ScrollView
                style={styles.suggestionsList}
                keyboardShouldPersistTaps="handled"
                nestedScrollEnabled={true}
              >
                {filteredDestinations.map((dest, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.suggestionItem}
                    onPress={() => {
                      setDestinationSearch(dest);
                      setSelectedDestination(dest);
                      setShowDestinationSuggestions(false);
                    }}
                  >
                    <MapPin color={colors.primary} size={16} />
                    <Text style={styles.suggestionText}>{dest}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}
        </View>

        {/* Dates Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <CalendarIcon color={colors.primary} size={20} />
            <Text style={styles.sectionTitle}>When?</Text>
          </View>
          
          <View style={styles.datesContainer}>
            <TouchableOpacity
              style={[
                styles.dateInput, 
                activeDateInput === 'start' && styles.dateInputActive
              ]}
              onPress={() => toggleDateInput('start')}
              activeOpacity={0.9}
            >
              <View>
                <Text style={styles.dateLabel}>Start Date</Text>
                <Text style={[styles.dateValue, !startDate && styles.placeholderText]}>
                  {formatDateDisplay(startDate)}
                </Text>
              </View>
              {activeDateInput === 'start' ? (
                <ChevronUp color={colors.primary} size={20} />
              ) : (
                <ChevronDown color={colors.textLight} size={20} />
              )}
            </TouchableOpacity>

            {activeDateInput === 'start' && (
              <InlineCalendar 
                onSelectDate={handleDateSelect}
                selectedDate={startDate}
                minDate={new Date()}
              />
            )}

            <View style={styles.dateSpacing} />

            <TouchableOpacity
              style={[
                styles.dateInput, 
                activeDateInput === 'end' && styles.dateInputActive
              ]}
              onPress={() => toggleDateInput('end')}
              activeOpacity={0.9}
            >
              <View>
                <Text style={styles.dateLabel}>End Date</Text>
                <Text style={[styles.dateValue, !endDate && styles.placeholderText]}>
                  {formatDateDisplay(endDate)}
                </Text>
              </View>
               {activeDateInput === 'end' ? (
                <ChevronUp color={colors.primary} size={20} />
              ) : (
                <ChevronDown color={colors.textLight} size={20} />
              )}
            </TouchableOpacity>

            {activeDateInput === 'end' && (
              <InlineCalendar 
                onSelectDate={handleDateSelect}
                selectedDate={endDate}
                minDate={startDate || new Date()}
              />
            )}
          </View>
        </View>

        {/* Travelers Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Users color={colors.primary} size={20} />
            <Text style={styles.sectionTitle}>Who&apos;s coming?</Text>
          </View>
          
          <View style={styles.travelersCard}>
            <View>
              <Text style={styles.travelersCountLabel}>Total Travelers</Text>
              <Text style={styles.travelersDescription}>Including yourself</Text>
            </View>
            
            <View style={styles.travelersCounter}>
              <TouchableOpacity 
                style={[styles.counterButton, travelers <= 1 && styles.counterButtonDisabled]}
                onPress={() => setTravelers(prev => Math.max(1, prev - 1))}
                disabled={travelers <= 1}
              >
                <Minus size={24} color={travelers <= 1 ? colors.textLight : colors.text} />
              </TouchableOpacity>
              
              <Text style={styles.travelersValue}>{travelers}</Text>
              
              <TouchableOpacity 
                style={styles.counterButton}
                onPress={() => setTravelers(prev => Math.min(20, prev + 1))}
              >
                <Plus size={24} color={colors.text} />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Interests Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Interests (Optional)</Text>
          <Text style={styles.sectionSubtitle}>Select what you love to do</Text>
          
          <View style={styles.interestsGrid}>
            {INTERESTS.map((interest) => {
              const isSelected = selectedInterests.includes(interest.id);
              return (
                <TouchableOpacity
                  key={interest.id}
                  style={[
                    styles.interestBubble,
                    isSelected && { 
                      backgroundColor: interest.color,
                      borderColor: interest.color,
                    }
                  ]}
                  onPress={() => toggleInterest(interest.id)}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.interestText,
                      isSelected && styles.interestTextSelected,
                    ]}
                  >
                    {interest.name}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Create Button */}
        <TouchableOpacity
          style={styles.createButton}
          onPress={handleCreateTrip}
          activeOpacity={0.8}
          disabled={isGeneratingTrip}
        >
          <LinearGradient
            colors={[colors.gradient.sunset[0], colors.gradient.sunset[1]]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.createButtonGradient}
          >
            {isGeneratingTrip ? (
              <View style={styles.createButtonLoading}>
                <ActivityIndicator color={colors.surface} size="small" />
                <Text style={styles.createButtonText}>Generating Itinerary...</Text>
              </View>
            ) : (
              <Text style={styles.createButtonText}>Create Trip</Text>
            )}
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.background,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerText: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
  },
  homeButton: {
    padding: 8,
    backgroundColor: colors.surface,
    borderRadius: 12,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  section: {
    marginBottom: 28,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: colors.textLight,
    marginBottom: 12,
    marginTop: -4,
  },
  
  // Destination Styles
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 16,
    height: 56,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
    height: '100%',
  },
  clearButton: {
    padding: 4,
  },
  suggestionsContainer: {
    marginTop: 8,
    backgroundColor: colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    maxHeight: 200,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  suggestionsList: {
    maxHeight: 200,
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  suggestionText: {
    fontSize: 16,
    color: colors.text,
  },

  // Dates Styles
  datesContainer: {
    gap: 12,
  },
  dateInput: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  dateInputActive: {
    borderColor: colors.primary,
    backgroundColor: `${colors.primary}05`, // Light primary background
  },
  dateLabel: {
    fontSize: 12,
    color: colors.textLight,
    marginBottom: 4,
  },
  dateValue: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  placeholderText: {
    color: colors.textLight,
    fontWeight: '400',
  },
  dateSpacing: {
    height: 4,
  },

  // Inline Calendar Styles
  inlineCalendarContainer: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    marginTop: 4,
    marginBottom: 12,
  },
  monthSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  monthNavButton: {
    padding: 8,
    backgroundColor: colors.background,
    borderRadius: 12,
  },
  monthText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  weekDaysRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  weekDayText: {
    width: 40,
    textAlign: 'center',
    color: colors.textLight,
    fontWeight: '600',
    fontSize: 12,
  },
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
  calendarDayCell: {
    width: '14.28%', // 100% / 7
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  calendarDaySelected: {
    backgroundColor: colors.primary,
    borderRadius: 20,
  },
  calendarDayText: {
    fontSize: 16,
    color: colors.text,
  },
  calendarDayTextSelected: {
    color: colors.surface,
    fontWeight: '600',
  },
  calendarDayTextDisabled: {
    color: colors.textLight,
    opacity: 0.3,
  },

  // Travelers Styles
  travelersCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  travelersCountLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  travelersDescription: {
    fontSize: 12,
    color: colors.textLight,
  },
  travelersCounter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    backgroundColor: colors.background,
    padding: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  counterButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  counterButtonDisabled: {
    backgroundColor: colors.background,
    opacity: 0.5,
  },
  travelersValue: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    minWidth: 32,
    textAlign: 'center',
  },

  // Interests Styles
  interestsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  interestBubble: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 24,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  interestText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
  },
  interestTextSelected: {
    color: colors.surface,
    fontWeight: '600',
  },

  // Button Styles
  createButton: {
    marginTop: 12,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  createButtonGradient: {
    paddingVertical: 18,
    alignItems: 'center',
  },
  createButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.surface,
  },
  createButtonLoading: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
});
