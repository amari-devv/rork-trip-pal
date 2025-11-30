import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Users, Plus, UserPlus, Calendar, MapPin } from 'lucide-react-native';
import colors from '@/constants/colors';

interface TravelGroup {
  id: string;
  name: string;
  members: number;
  upcomingTrips: number;
  destination?: string;
  nextTripDate?: string;
}

const MOCK_GROUPS: TravelGroup[] = [
  {
    id: '1',
    name: 'Adventure Squad',
    members: 5,
    upcomingTrips: 2,
    destination: 'Iceland',
    nextTripDate: '2025-11-15',
  },
  {
    id: '2',
    name: 'Family Vacation',
    members: 8,
    upcomingTrips: 1,
    destination: 'Orlando',
    nextTripDate: '2025-12-20',
  },
  {
    id: '3',
    name: 'College Friends',
    members: 6,
    upcomingTrips: 0,
  },
];

function GroupCard({ group }: { group: TravelGroup }) {
  return (
    <TouchableOpacity style={styles.groupCard} activeOpacity={0.7}>
      <View style={styles.groupHeader}>
        <View style={styles.groupIcon}>
          <LinearGradient
            colors={[colors.gradient.ocean[0], colors.gradient.ocean[1]]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.groupIconGradient}
          >
            <Users color={colors.surface} size={24} />
          </LinearGradient>
        </View>
        <View style={styles.groupInfo}>
          <Text style={styles.groupName}>{group.name}</Text>
          <View style={styles.groupMeta}>
            <View style={styles.metaItem}>
              <UserPlus color={colors.textSecondary} size={14} />
              <Text style={styles.metaText}>{group.members} members</Text>
            </View>
            {group.upcomingTrips > 0 && (
              <View style={styles.metaItem}>
                <Calendar color={colors.textSecondary} size={14} />
                <Text style={styles.metaText}>{group.upcomingTrips} upcoming</Text>
              </View>
            )}
          </View>
        </View>
      </View>

      {group.destination && group.nextTripDate && (
        <View style={styles.nextTrip}>
          <View style={styles.nextTripHeader}>
            <MapPin color={colors.primary} size={16} />
            <Text style={styles.nextTripLabel}>Next Trip</Text>
          </View>
          <Text style={styles.nextTripDestination}>{group.destination}</Text>
          <Text style={styles.nextTripDate}>
            {new Date(group.nextTripDate).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

function EmptyState() {
  return (
    <View style={styles.emptyState}>
      <LinearGradient
        colors={[colors.gradient.sunset[0], colors.gradient.sunset[1]]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.emptyIcon}
      >
        <Users color={colors.surface} size={48} strokeWidth={1.5} />
      </LinearGradient>
      
      <Text style={styles.emptyTitle}>No groups yet</Text>
      <Text style={styles.emptyDescription}>
        Create or join a group to plan trips together with friends and family
      </Text>
      
      <TouchableOpacity 
        style={styles.emptyButton}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={[colors.gradient.sunset[0], colors.gradient.sunset[1]]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.emptyButtonGradient}
        >
          <Plus color={colors.surface} size={24} strokeWidth={2.5} />
          <Text style={styles.emptyButtonText}>Create Your First Group</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
}

export default function GroupsScreen() {
  const insets = useSafeAreaInsets();
  const hasGroups = MOCK_GROUPS.length > 0;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      <View style={[styles.header, { paddingTop: insets.top + 20 }]}>
        <View>
          <Text style={styles.headerTitle}>Groups</Text>
          <Text style={styles.headerSubtitle}>
            {hasGroups ? `${MOCK_GROUPS.length} ${MOCK_GROUPS.length === 1 ? 'group' : 'groups'}` : 'Plan trips together'}
          </Text>
        </View>
        
        {hasGroups && (
          <TouchableOpacity 
            style={styles.addButton}
            activeOpacity={0.7}
          >
            <LinearGradient
              colors={[colors.gradient.sunset[0], colors.gradient.sunset[1]]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.addButtonGradient}
            >
              <Plus color={colors.surface} size={24} strokeWidth={2.5} />
            </LinearGradient>
          </TouchableOpacity>
        )}
      </View>

      {!hasGroups ? (
        <EmptyState />
      ) : (
        <ScrollView 
          style={styles.content}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        >
          {MOCK_GROUPS.map((group) => (
            <GroupCard key={group.id} group={group} />
          ))}
        </ScrollView>
      )}
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
  addButton: {
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  addButtonGradient: {
    width: 56,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
  },
  listContent: {
    padding: 20,
    paddingTop: 8,
  },
  groupCard: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  groupHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  groupIcon: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  groupIconGradient: {
    width: 56,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
  },
  groupInfo: {
    flex: 1,
  },
  groupName: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: colors.text,
    marginBottom: 4,
  },
  groupMeta: {
    flexDirection: 'row',
    gap: 16,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  nextTrip: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  nextTripHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  nextTripLabel: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: colors.primary,
  },
  nextTripDestination: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: colors.text,
    marginBottom: 2,
  },
  nextTripDate: {
    fontSize: 14,
    color: colors.textSecondary,
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
