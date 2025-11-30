import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Stack, useRouter, usePathname } from 'expo-router';
import { Map, Plus, Plane, User } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import colors from '@/constants/colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import React from 'react';

function CustomTabBar() {
  const router = useRouter();
  const pathname = usePathname();
  const insets = useSafeAreaInsets();

  const isActiveRoute = (route: string) => {
    if (route === '/') return pathname === '/';
    return pathname.startsWith(route);
  };

  return (
    <View style={[styles.tabBarContainer, { paddingBottom: insets.bottom + 16 }]}>
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tabCard, isActiveRoute('/explore') && styles.tabCardActive]}
          onPress={() => router.push('/explore')}
          activeOpacity={0.8}
        >
          <View style={[styles.iconContainer, isActiveRoute('/explore') && styles.iconContainerActive]}>
            <Map color={isActiveRoute('/explore') ? colors.surface : colors.primary} size={24} strokeWidth={2} />
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.centerButton}
          onPress={() => router.push('/create-trip' as any)}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={[colors.gradient.sunset[0], colors.gradient.sunset[1]]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.centerButtonGradient}
          >
            <Plus color={colors.surface} size={32} strokeWidth={2.5} />
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabCard, isActiveRoute('/') && styles.tabCardActive]}
          onPress={() => router.push('/')}
          activeOpacity={0.8}
        >
          <View style={[styles.iconContainer, isActiveRoute('/') && styles.iconContainerActive]}>
            <Plane color={isActiveRoute('/') ? colors.surface : colors.primary} size={24} strokeWidth={2} />
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function ProfileButton() {
  const router = useRouter();
  
  return (
    <TouchableOpacity
      onPress={() => router.push('/profile')}
      activeOpacity={0.7}
      style={styles.profileButton}
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
  );
}

export default function TabLayout() {
  return (
    <View style={{ flex: 1 }}>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="explore" />
        <Stack.Screen name="groups" options={{ headerShown: false }} />
        <Stack.Screen name="profile" options={{ headerShown: false }} />
      </Stack>
      <CustomTabBar />
    </View>
  );
}

const styles = StyleSheet.create({
  tabBarContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  tabBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  tabCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    height: 64,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  tabCardActive: {
    backgroundColor: colors.primary,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: `${colors.primary}15`,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainerActive: {
    backgroundColor: 'transparent',
  },
  centerButton: {
    borderRadius: 32,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    marginHorizontal: 8,
  },
  centerButtonGradient: {
    width: 64,
    height: 64,
    justifyContent: 'center',
    alignItems: 'center',
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

export { ProfileButton };
