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
import { useRouter } from 'expo-router';
import {
  User,
  Settings,
  Bell,
  Globe,
  Heart,
  HelpCircle,
  LogOut,
  ChevronRight,
  MapPin,
  Calendar,
  X,
  Users,
  FileText,
  Shield,
} from 'lucide-react-native';
import colors from '@/constants/colors';
import { useTrips } from '@/contexts/TripContext';

interface SettingItem {
  id: string;
  icon: typeof Settings;
  label: string;
  subtitle?: string;
  action: () => void;
}

function StatCard({ icon: Icon, label, value }: { icon: typeof MapPin; label: string; value: string | number }) {
  return (
    <View style={styles.statCard}>
      <View style={styles.statIcon}>
        <Icon color={colors.primary} size={20} />
      </View>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function SettingRow({ item }: { item: SettingItem }) {
  const Icon = item.icon;
  return (
    <TouchableOpacity 
      style={styles.settingRow}
      onPress={item.action}
      activeOpacity={0.7}
    >
      <View style={styles.settingLeft}>
        <View style={styles.settingIcon}>
          <Icon color={colors.primary} size={20} />
        </View>
        <View style={styles.settingText}>
          <Text style={styles.settingLabel}>{item.label}</Text>
          {item.subtitle && (
            <Text style={styles.settingSubtitle}>{item.subtitle}</Text>
          )}
        </View>
      </View>
      <ChevronRight color={colors.textSecondary} size={20} />
    </TouchableOpacity>
  );
}

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { trips } = useTrips();

  const totalTrips = trips.length;
  const totalActivities = trips.reduce((sum, trip) => 
    sum + trip.itinerary.reduce((daySum, day) => daySum + day.activities.length, 0), 0
  );
  const destinations = new Set(trips.map(trip => trip.destination)).size;

  const settingsSections: { title: string; items: SettingItem[] }[] = [
    {
      title: 'Account',
      items: [
        {
          id: 'profile',
          icon: User,
          label: 'Edit Profile',
          subtitle: 'Update your personal information',
          action: () => console.log('Edit profile'),
        },
        {
          id: 'friends',
          icon: Users,
          label: 'Friends',
          subtitle: 'Manage your connections',
          action: () => console.log('Friends'),
        },
        {
          id: 'preferences',
          icon: Settings,
          label: 'Settings',
          subtitle: 'Customize your experience',
          action: () => console.log('Settings'),
        },
      ],
    },
    {
      title: 'App',
      items: [
        {
          id: 'notifications',
          icon: Bell,
          label: 'Notifications',
          subtitle: 'Manage your alerts',
          action: () => console.log('Notifications'),
        },
        {
          id: 'language',
          icon: Globe,
          label: 'Language & Region',
          subtitle: 'English (US)',
          action: () => console.log('Language'),
        },
      ],
    },
    {
      title: 'Legal',
      items: [
        {
          id: 'privacy',
          icon: Shield,
          label: 'Privacy Policy',
          action: () => console.log('Privacy'),
        },
        {
          id: 'terms',
          icon: FileText,
          label: 'Terms of Service',
          action: () => console.log('Terms'),
        },
      ],
    },
    {
      title: 'More',
      items: [
        {
          id: 'favorites',
          icon: Heart,
          label: 'Saved Destinations',
          action: () => console.log('Favorites'),
        },
        {
          id: 'help',
          icon: HelpCircle,
          label: 'Help & Support',
          action: () => console.log('Help'),
        },
        {
          id: 'logout',
          icon: LogOut,
          label: 'Sign Out',
          action: () => console.log('Logout'),
        },
      ],
    },
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      <View style={[styles.header, { paddingTop: insets.top + 20 }]}>
        <Text style={styles.headerTitle}>Profile</Text>
        
        <TouchableOpacity 
          style={styles.closeButton}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <X color={colors.text} size={24} strokeWidth={2} />
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.content}
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            <LinearGradient
              colors={[colors.gradient.sunset[0], colors.gradient.sunset[1]]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.avatar}
            >
              <User color={colors.surface} size={48} strokeWidth={1.5} />
            </LinearGradient>
          </View>
          <Text style={styles.userName}>Travel Enthusiast</Text>
          <Text style={styles.userEmail}>traveler@example.com</Text>
        </View>

        <View style={styles.statsContainer}>
          <StatCard icon={MapPin} label="Destinations" value={destinations} />
          <StatCard icon={Calendar} label="Trips" value={totalTrips} />
          <StatCard icon={Heart} label="Activities" value={totalActivities} />
        </View>

        {settingsSections.map((section) => (
          <View key={section.title} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <View style={styles.settingsCard}>
              {section.items.map((item, index) => (
                <View key={item.id}>
                  <SettingRow item={item} />
                  {index < section.items.length - 1 && (
                    <View style={styles.divider} />
                  )}
                </View>
              ))}
            </View>
          </View>
        ))}

        <View style={styles.footer}>
          <Text style={styles.footerText}>Version 1.0.0</Text>
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
  content: {
    flex: 1,
  },
  profileSection: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  avatarContainer: {
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userName: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: colors.text,
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 15,
    color: colors.textSecondary,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: `${colors.primary}15`,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: colors.text,
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  section: {
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  settingsCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: `${colors.primary}15`,
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingText: {
    flex: 1,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: colors.text,
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginLeft: 68,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  footerText: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
});
