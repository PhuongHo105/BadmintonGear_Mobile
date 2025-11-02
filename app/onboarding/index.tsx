import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import FullButton from '@/components/ui/fullbutton';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import React from 'react';
import {
    ColorSchemeName,
    ImageSourcePropType,
    Pressable,
    StyleSheet
} from 'react-native';

const Onboarding1Screen: React.FC = () => {
    const router = useRouter();
    const schemeRaw = useColorScheme() as ColorSchemeName | undefined | null;
    const scheme: keyof typeof Colors = (schemeRaw ?? 'light') as keyof typeof Colors;
    const logoSource: ImageSourcePropType = scheme === 'dark'
        ? require('@/assets/images/logo/dark-logo.png')
        : require('@/assets/images/logo/light-logo.png')

    return (
        <ThemedView style={styles.container}>
            <ThemedView style={styles.content}>
                <ThemedView style={styles.illustrationWrapper}>
                    <ThemedView style={styles.headerContainer}>
                        <ThemedView style={styles.logoContainer}>
                            <Image source={logoSource} style={styles.logo} />
                            <ThemedText type="title" style={[styles.title, { color: Colors[scheme].text }]}>BadmintonGear</ThemedText>
                        </ThemedView>
                        <Pressable onPress={() => { router.push('/login') }} >
                            <ThemedText type="link" style={{ color: Colors[scheme].tint, fontSize: 16 }}>Skip for now</ThemedText>
                        </Pressable>
                    </ThemedView>
                    <Image
                        source={require('@/assets/images/pre1.png')}
                        style={styles.illustration}
                        contentFit="contain"
                    />
                </ThemedView>
                <ThemedText type="title" style={styles.heading}>
                    Explore a wide range of products
                </ThemedText>
                <ThemedText style={[styles.subtitle, { color: Colors[scheme].secondaryText, textAlign: 'center' }]}>
                    Explore a wide range of products at your fingertips. QuickMart offers an extensive collection to suit your needs.
                </ThemedText>
                <ThemedView style={styles.buttonsContainer}>
                    <FullButton text="Next" onPress={() => { router.push('/onboarding/02') }} />
                </ThemedView>
            </ThemedView>
        </ThemedView>
    );
};

export default Onboarding1Screen;

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
