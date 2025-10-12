import { Colors } from '@/constants/theme';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useRef, useState } from 'react';
import { View } from 'react-native';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';
import WelcomeScreen from './welcome';

export const unstable_settings = {
  anchor: 'welcome',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const segments = useSegments();
  const [stackReady, setStackReady] = useState(false);
  const didForceRef = useRef(false);

  useEffect(() => {
    // Ensure we only force navigation once. If we're already on the welcome
    // route (segments start with 'welcome'), skip the replace and render
    // the stack immediately. This avoids repeated navigation loops.
    if (didForceRef.current) {
      setStackReady(true);
      return;
    }

    const isOnWelcome = segments.length > 0 && segments[0] === 'welcome';
    if (isOnWelcome) {
      didForceRef.current = true;
      setStackReady(true);
      return;
    }

    try {
      const t = setTimeout(() => {
        try {
          router.replace('/welcome' as any);
        } catch (e) {
          // ignore
        } finally {
          didForceRef.current = true;
          setStackReady(true);
        }
      }, 80);
      return () => clearTimeout(t);
    } catch (e) {
      console.warn('Router replace to /welcome failed', e);
      didForceRef.current = true;
      setStackReady(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [segments]);

  // (Removed AppState foreground listener to avoid forcing welcome on every
  // resume — this prevented an unintended reload loop.)

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <View style={{ flex: 1, backgroundColor: Colors[colorScheme ?? 'light'].background }}>
        {/* Render WelcomeScreen directly until the Stack is ready so we don't
            briefly render the tabs on cold start. After initialization we
            render the normal Stack navigator. */}
        {!stackReady ? (
          <WelcomeScreen />
        ) : (
          <Stack>
            <Stack.Screen name="welcome" options={{ headerShown: false }} />
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
          </Stack>
        )}
        <StatusBar style="auto" />
      </View>
    </ThemeProvider>
  );
}
