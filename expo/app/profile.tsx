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
  ChevronRight,
  Users,
  Menu,
  MessageCircle,
  Mail,
  Star,
  Share2,
  Bookmark,
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

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <View style={styles.statCard}>
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
  const savedCount = 0;

  const menuItems: SettingItem[] = [
    {
      id: 'founder',
      icon: MessageCircle,
      label: 'Text the Founder',
      action: () => console.log('Text Founder'),
    },
    {
      id: 'email',
      icon: Mail,
      label: 'Email Us',
      action: () => console.log('Email'),
    },
    {
      id: 'community',
      icon: Users,
      label: 'Join Community',
      action: () => console.log('Community'),
    },
    {
      id: 'review',
      icon: Star,
      label: 'Leave a Review',
      action: () => console.log('Review'),
    },
    {
      id: 'share',
      icon: Share2,
      label: 'Share Roamy',
      action: () => console.log('Share'),
    },
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      <View style={[styles.header, { paddingTop: insets.top + 20 }]}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <ChevronRight color={colors.text} size={28} strokeWidth={2} style={{ transform: [{ rotate: '180deg' }] }} />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.menuButton}
          onPress={() => console.log('Menu')}
          activeOpacity={0.7}
        >
          <Menu color={colors.text} size={28} strokeWidth={2} />
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.content}
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatarShadow}>
              <LinearGradient
                colors={[colors.gradient.sunset[0], colors.gradient.sunset[1]]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.avatar}
              >
                <User color={colors.surface} size={56} strokeWidth={1.5} />
              </LinearGradient>
            </View>
          </View>
          <Text style={styles.userName}>Travel Enthusiast</Text>
          <Text style={styles.userEmail}>Add a short bio</Text>
        </View>

        <View style={styles.statsContainer}>
          <StatCard label="Saved" value={savedCount} />
          <StatCard label="Trips" value={totalTrips} />
        </View>

        <TouchableOpacity 
          style={styles.importCard}
          activeOpacity={0.7}
          onPress={() => console.log('Import History')}
        >
          <View style={styles.importIcon}>
            <Bookmark color="#999" size={40} />
          </View>
          <View style={styles.importText}>
            <Text style={styles.importTitle}>Import History</Text>
            <Text style={styles.importSubtitle}>Save links to build your history</Text>
          </View>
          <ChevronRight color={colors.textSecondary} size={24} />
        </TouchableOpacity>

        <View style={styles.menuCard}>
          {menuItems.map((item, index) => (
            <View key={item.id}>
              <SettingRow item={item} />
              {index < menuItems.length - 1 && (
                <View style={styles.divider} />
              )}
            </View>
          ))}
        </View>

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
  backButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
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
  avatarShadow: {
    backgroundColor: colors.surface,
    borderRadius: 75,
    padding: 12,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userName: {
    fontSize: 28,
    fontWeight: '700' as const,
    color: colors.text,
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  userEmail: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 16,
    marginBottom: 32,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  statValue: {
    fontSize: 40,
    fontWeight: '700' as const,
    color: colors.text,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 15,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  importCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    marginHorizontal: 20,
    marginBottom: 32,
    padding: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  importIcon: {
    width: 80,
    height: 80,
    borderRadius: 16,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  importText: {
    flex: 1,
  },
  importTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: colors.text,
    marginBottom: 4,
  },
  importSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  menuCard: {
    backgroundColor: colors.surface,
    marginHorizontal: 20,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 18,
    paddingHorizontal: 20,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    flex: 1,
  },
  settingIcon: {
    width: 28,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingText: {
    flex: 1,
  },
  settingLabel: {
    fontSize: 17,
    fontWeight: '400' as const,
    color: colors.text,
  },
  settingSubtitle: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  divider: {
    height: 1,
    backgroundColor: '#F0F0F0',
    marginLeft: 60,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  footerText: {
    fontSize: 13,
    color: colors.textSecondary,
  },

});
