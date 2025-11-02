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
    StyleSheet
} from 'react-native';

const ResultCheckoutScreen: React.FC = () => {
    const router = useRouter();
    const schemeRaw = useColorScheme() as ColorSchemeName | undefined | null;
    const scheme: keyof typeof Colors = (schemeRaw ?? 'light') as keyof typeof Colors;

    return (
        <ThemedView style={styles.container}>
            <ThemedView style={styles.content}>
                <ThemedView style={styles.illustrationWrapper}>
                    <Image
                        source={require('@/assets/images/successCheckout.png')}
                        style={styles.illustration}
                        contentFit="contain"
                    />
                </ThemedView>
                <ThemedText type="title" style={styles.heading}>
                    Your order has been placed successfully
                </ThemedText>
                <ThemedText style={[styles.subtitle, { color: Colors[scheme].secondaryText, textAlign: 'center' }]}>
                    Thank you for choosing us! Feel free to continue shopping and explore our wide range of products. Happy Shopping!
                </ThemedText>
                <ThemedView style={styles.buttonsContainer}>
                    <FullButton text="Continue Shopping" onPress={() => { router.push('/') }} />
                </ThemedView>
            </ThemedView>
        </ThemedView>
    );
};

export default ResultCheckoutScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        paddingHorizontal: 16,
        paddingTop: 20,
        paddingBottom: 24,
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
