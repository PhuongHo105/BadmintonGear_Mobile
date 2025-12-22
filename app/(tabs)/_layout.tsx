import { Tabs } from 'expo-router';
import React from 'react';

import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useTranslation } from 'react-i18next';

export default function TabLayout() {
  const { t } = useTranslation();
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        tabBarInactiveTintColor: Colors[colorScheme ?? 'light'].tabIconDefault,
        tabBarStyle: { backgroundColor: Colors[colorScheme ?? 'light'].background },
        headerShown: false,
        tabBarButton: HapticTab,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: t('layout.home'),
          tabBarIcon: ({ color }: { color: string }) => (
            <IconSymbol size={28} name="house.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="categories"
        options={{
          title: t('layout.categories'),
          tabBarIcon: ({ color }: { color: string }) => (
            <IconSymbol size={28} name="category.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          title: t('layout.cart'),
          tabBarIcon: ({ color }: { color: string }) => (
            <IconSymbol size={28} name="shopping-cart.fill" color={color} />
          ),
        }}
      />
      {/* <Tabs.Screen
        name="wishlist"
        options={{
          title: t('layout.wishlist'),
          tabBarIcon: ({ color }: { color: string }) => (
            <IconSymbol size={28} name="heart.fill" color={color} />
          ),
        }}
      /> */}
      <Tabs.Screen
        name="profile"
        options={{
          title: t('layout.profile'),
          tabBarIcon: ({ color }: { color: string }) => (
            <IconSymbol size={28} name="account-box" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
