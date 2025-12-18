import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Animated, ImageSourcePropType, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function WelcomeScreen(): React.ReactElement {
    const router = useRouter();
    useEffect(() => {
        console.log('WelcomeScreen mounted');
    }, []);
    const [progress, setProgress] = useState<number>(0);
    const [done, setDone] = useState<boolean>(false);
    const [checking, setChecking] = useState<boolean>(true);
    const animated = useRef<Animated.Value>(new Animated.Value(0)).current;

    useEffect(() => {
        (async function checkSeen() {
            try {
                await AsyncStorage.getItem('@has_seen_welcome');
            } catch (e) {
                console.warn('AsyncStorage check failed', e);
            }
            setChecking(false);
        })();

        const hasWork: boolean = false;
        const workDuration: number = hasWork ? 10000 : 2000; // ms

        const start: number = Date.now();
        const tick: number = 50; // ms
        const id: ReturnType<typeof setInterval> = setInterval(() => {
            const elapsed = Date.now() - start;
            const p = Math.min(1, elapsed / workDuration);
            setProgress(p);
            Animated.timing(animated, {
                toValue: p,
                duration: tick,
                useNativeDriver: false,
            }).start();

            if (p >= 1) {
                clearInterval(id);
                setDone(true);
                (async () => {
                    try {
                        await AsyncStorage.setItem('@has_seen_welcome', 'true');
                    } catch (e) {
                        console.warn('Failed to save welcome flag', e);
                    }
                    router.replace('/onboarding' as any);
                })();
            }
        }, tick);

        return () => clearInterval(id);
    }, [animated, router]);

    const widthInterpolation: Animated.AnimatedInterpolation<string> = animated.interpolate({
        inputRange: [0, 1],
        outputRange: ['0%', '100%'],
    });

    const scheme = useColorScheme() ?? 'light';
    const tint = Colors[scheme].tint;
    const logoSrc: ImageSourcePropType = scheme === 'dark'
        ? require('../assets/images/logo/dark-logo.png')
        : require('../assets/images/logo/light-logo.png');

    if (checking) {
        return (
            <ThemedView style={styles.container}>
                <ActivityIndicator size="large" color={tint} />
            </ThemedView>
        );
    }

    return (
        <ThemedView style={styles.container}>
            <ThemedView>
                <Image source={logoSrc} style={{ width: 200, height: 200 }} />
            </ThemedView>
            <ThemedText type="title">BadmintonGear</ThemedText>
            <View style={styles.progressContainer} pointerEvents="none">
                <ThemedView style={styles.progressBackground}>
                    <Animated.View style={[styles.progressFill, { width: widthInterpolation, backgroundColor: tint }]} />
                </ThemedView>
                <ThemedText style={[styles.percent, { color: tint }]}>{Math.round(progress * 100)}%</ThemedText>
            </View>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    subtitle: {
        marginTop: 8,
    },
    progressBackground: {

        height: 6,
        width: '70%',
        borderRadius: 8,
        marginTop: 20,
        backgroundColor: 'rgba(0,0,0,0.08)',
        overflow: 'hidden',
    },
    progressContainer: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 40,
        alignItems: 'center',
    },
    progressFill: {
        height: '100%',
    },
    percent: {
        marginTop: 12,
    },
    skip: {
        marginTop: 16,
        paddingVertical: 10,
        paddingHorizontal: 16,
    },
    continue: {
        marginTop: 12,
        paddingVertical: 12,
        paddingHorizontal: 20,
        backgroundColor: '#e6f0ff',
        borderRadius: 8,
    },
});
