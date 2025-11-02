import { Colors } from '@/constants/theme';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useRef, useState } from 'react';
import { View } from 'react-native';
import 'react-native-reanimated';

import { ThemePreferenceProvider } from '@/app/providers/ThemePreferenceProvider';
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
        } catch {
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
  }, [segments, router]);


  return (
    <ThemePreferenceProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <View style={{ flex: 1, backgroundColor: Colors[colorScheme ?? 'light'].background }}>
          {!stackReady ? (
            <WelcomeScreen />
          ) : (
            <Stack>
              <Stack.Screen name="welcome" options={{ headerShown: false, gestureEnabled: false }} />
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
              <Stack.Screen name="changepassword/01" options={{ headerShown: false }} />
              <Stack.Screen name="changepassword/02" options={{ headerShown: false }} />
              <Stack.Screen name="faqs" options={{ headerShown: false }} />
              <Stack.Screen name="chat" options={{ headerShown: false }} />
              <Stack.Screen name="termcondition" options={{ headerShown: false }} />
              <Stack.Screen name="privacy" options={{ headerShown: false }} />
              <Stack.Screen name="productList" options={{ headerShown: false }} />
              <Stack.Screen name="search" options={{ headerShown: false }} />
              <Stack.Screen name="product/[id]" options={{ headerShown: false }} />
              <Stack.Screen name="login" options={{ headerShown: false }} />
              <Stack.Screen name="signup" options={{ headerShown: false }} />
              <Stack.Screen name="forgotPassword/index" options={{ headerShown: false }} />
              <Stack.Screen name="forgotPassword/emailVerification" options={{ headerShown: false }} />
              <Stack.Screen name="forgotPassword/setNewPassword" options={{ headerShown: false }} />
              <Stack.Screen name="forgotPassword/success" options={{ headerShown: false }} />
              <Stack.Screen name="onboarding/index" options={{ headerShown: false }} />
              <Stack.Screen name="onboarding/02" options={{ headerShown: false }} />
              <Stack.Screen name="onboarding/03" options={{ headerShown: false }} />
              <Stack.Screen name="checkout/index" options={{ headerShown: false }} />
              <Stack.Screen name="checkout/payment" options={{ headerShown: false }} />
              <Stack.Screen name="checkout/review" options={{ headerShown: false }} />
              <Stack.Screen name="checkout/items" options={{ headerShown: false }} />
              <Stack.Screen name="checkout/result" options={{ headerShown: false }} />
            </Stack>
          )}
          <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
        </View>
      </ThemeProvider>
    </ThemePreferenceProvider>
  );
}
