import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Search, MapPin, TrendingUp, Star, Home } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import colors from '@/constants/colors';

interface Destination {
  id: string;
  name: string;
  country: string;
  imageUrl: string;
  rating: number;
  description: string;
  popular: boolean;
}

const FEATURED_DESTINATIONS: Destination[] = [
  {
    id: '1',
    name: 'Paris',
    country: 'France',
    imageUrl: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800',
    rating: 4.8,
    description: 'The City of Light awaits with iconic landmarks and romance',
    popular: true,
  },
  {
    id: '2',
    name: 'Tokyo',
    country: 'Japan',
    imageUrl: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800',
    rating: 4.9,
    description: 'Experience the perfect blend of tradition and modernity',
    popular: true,
  },
  {
    id: '3',
    name: 'Bali',
    country: 'Indonesia',
    imageUrl: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800',
    rating: 4.7,
    description: 'Tropical paradise with stunning beaches and culture',
    popular: true,
  },
  {
    id: '4',
    name: 'New York',
    country: 'USA',
    imageUrl: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800',
    rating: 4.6,
    description: 'The city that never sleeps, full of energy and diversity',
    popular: false,
  },
  {
    id: '5',
    name: 'Barcelona',
    country: 'Spain',
    imageUrl: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?w=800',
    rating: 4.8,
    description: 'Art, architecture, and Mediterranean charm',
    popular: false,
  },
  {
    id: '6',
    name: 'Dubai',
    country: 'UAE',
    imageUrl: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800',
    rating: 4.7,
    description: 'Luxury and innovation in the desert',
    popular: false,
  },
];

function DestinationCard({ destination }: { destination: Destination }) {
  return (
    <TouchableOpacity style={styles.destinationCard} activeOpacity={0.8}>
      <Image source={{ uri: destination.imageUrl }} style={styles.destinationImage} />
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.8)']}
        style={styles.destinationGradient}
      >
        <View style={styles.destinationInfo}>
          <View style={styles.destinationHeader}>
            <View style={styles.destinationLocation}>
              <MapPin color={colors.surface} size={16} />
              <Text style={styles.destinationCountry}>{destination.country}</Text>
            </View>
            <View style={styles.ratingBadge}>
              <Star color="#FFD700" size={14} fill="#FFD700" />
              <Text style={styles.ratingText}>{destination.rating}</Text>
            </View>
          </View>
          <Text style={styles.destinationName}>{destination.name}</Text>
          <Text style={styles.destinationDescription}>{destination.description}</Text>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
}

export default function ExploreScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  const popularDestinations = FEATURED_DESTINATIONS.filter(d => d.popular);
  const allDestinations = FEATURED_DESTINATIONS;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      <View style={[styles.header, { paddingTop: insets.top + 20 }]}>
        <View>
          <Text style={styles.headerTitle}>Explore</Text>
          <Text style={styles.headerSubtitle}>Discover your next adventure</Text>
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
            <Home color={colors.surface} size={20} strokeWidth={2} />
          </LinearGradient>
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Search color={colors.textSecondary} size={20} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search destinations..."
            placeholderTextColor={colors.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      <ScrollView 
        style={styles.content}
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <TrendingUp color={colors.primary} size={20} />
            <Text style={styles.sectionTitle}>Popular Destinations</Text>
          </View>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalScroll}
          >
            {popularDestinations.map((destination) => (
              <View key={destination.id} style={styles.popularCard}>
                <DestinationCard destination={destination} />
              </View>
            ))}
          </ScrollView>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>All Destinations</Text>
          <View style={styles.grid}>
            {allDestinations.map((destination) => (
              <View key={destination.id} style={styles.gridItem}>
                <DestinationCard destination={destination} />
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
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
  searchContainer: {
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: colors.surface,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
  },
  content: {
    flex: 1,
  },
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: colors.text,
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  horizontalScroll: {
    paddingHorizontal: 20,
    gap: 16,
  },
  popularCard: {
    width: 300,
  },
  grid: {
    paddingHorizontal: 20,
    gap: 16,
  },
  gridItem: {
    marginBottom: 16,
  },
  destinationCard: {
    height: 240,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: colors.surface,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  destinationImage: {
    width: '100%',
    height: '100%',
  },
  destinationGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '60%',
    justifyContent: 'flex-end',
  },
  destinationInfo: {
    padding: 16,
  },
  destinationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  destinationLocation: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  destinationCountry: {
    fontSize: 13,
    color: colors.surface,
    fontWeight: '600' as const,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  ratingText: {
    fontSize: 13,
    color: colors.surface,
    fontWeight: '700' as const,
  },
  destinationName: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: colors.surface,
    marginBottom: 4,
  },
  destinationDescription: {
    fontSize: 14,
    color: colors.surface,
    opacity: 0.9,
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
});
