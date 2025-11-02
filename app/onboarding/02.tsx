import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import FullButton from '@/components/ui/fullbutton';
import GoBackButton from '@/components/ui/gobackbutton';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import React from 'react';
import {
    ColorSchemeName,
    Pressable,
    StyleSheet
} from 'react-native';

const Onboarding2Screen: React.FC = () => {
    const router = useRouter();
    const schemeRaw = useColorScheme() as ColorSchemeName | undefined | null;
    const scheme: keyof typeof Colors = (schemeRaw ?? 'light') as keyof typeof Colors;

    return (
        <ThemedView style={styles.container}>
            <ThemedView style={styles.content}>
                <ThemedView style={styles.illustrationWrapper}>
                    <ThemedView style={styles.headerContainer}>
                        <GoBackButton />
                        <Pressable onPress={() => { router.push('/login') }} >
                            <ThemedText type="link" style={{ color: Colors[scheme].tint, fontSize: 16 }}>Skip for now</ThemedText>
                        </Pressable>
                    </ThemedView>
                    <Image
                        source={require('@/assets/images/pre2.png')}
                        style={styles.illustration}
                        contentFit="contain"
                    />
                </ThemedView>
                <ThemedText type="title" style={styles.heading}>
                    Unlock exclusive offers and discounts
                </ThemedText>
                <ThemedText style={[styles.subtitle, { color: Colors[scheme].secondaryText, textAlign: 'center' }]}>
                    Get access to limited-time deals and special promotions available only to our valued customers.
                </ThemedText>
                <ThemedView style={styles.buttonsContainer}>
                    <FullButton text="Next" onPress={() => { router.push('/onboarding/03') }} />
                </ThemedView>
            </ThemedView>
        </ThemedView>
    );
};

export default Onboarding2Screen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        paddingHorizontal: 16,
        paddingTop: 20,
        paddingBottom: 24,
    },
    headerContainer: {
        width: '100%',
        backgroundColor: 'transparent',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },

    rightContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },

    logoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'transparent',
    },

    logo: {
        height: 48,
        width: 48,
    },

    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginLeft: 8,
    },
    content: {
        marginTop: 32,
        flex: 1,
    },
    illustrationWrapper: {
        backgroundColor: '#F9E0E0',
        borderRadius: 50,
        padding: 20,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 24,
    },
    illustration: {
        width: '75%',
        height: 330,
        maxWidth: 300,
    },
    heading: {
        textAlign: 'center',
        fontSize: 30,
        fontWeight: '600',
    },
    subtitle: {
        fontSize: 15,
        lineHeight: 22,
        marginTop: 12,
    },
    fieldGroup: {
        marginTop: 32,
    },
    input: {
        fontSize: 16,
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 15,
        marginTop: 8,
    },
    buttonsContainer: {
        marginTop: 32,
    },
});
