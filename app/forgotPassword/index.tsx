import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import FullButton from '@/components/ui/fullbutton';
import GoBackButton from '@/components/ui/gobackbutton';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useRouter } from 'expo-router';
import React from 'react';
import {
    ColorSchemeName,
    StyleSheet,
    TextInput
} from 'react-native';

const ForgotPasswordScreen: React.FC = () => {
    const router = useRouter();
    const schemeRaw = useColorScheme() as ColorSchemeName | undefined | null;
    const scheme: keyof typeof Colors = (schemeRaw ?? 'light') as keyof typeof Colors;
    const [email, setEmail] = React.useState('');
    const [isEmailFocused, setIsEmailFocused] = React.useState(false);

    return (
        <ThemedView style={styles.container}>
            <ThemedView style={styles.headerContainer}>
                <ThemedView style={styles.leftHeader}>
                    <GoBackButton />
                    <ThemedText type="title" style={{ fontSize: 20 }}>Forgot password</ThemedText>
                </ThemedView>
                <ThemedView style={styles.rightHeader}>
                    <ThemedText type="default" style={{ fontSize: 16, color: Colors[scheme].text }}>01 / </ThemedText>
                    <ThemedText type="default" style={{ fontSize: 16, color: Colors[scheme].secondaryText }}>03</ThemedText>
                </ThemedView>
            </ThemedView>

            <ThemedView style={styles.content}>
                <ThemedText type="title" style={styles.heading}>
                    Confirmation Email
                </ThemedText>
                <ThemedText style={[styles.subtitle, { color: Colors[scheme].secondaryText }]}>
                    Enter your email address for verification.
                </ThemedText>

                <ThemedView style={styles.fieldGroup}>
                    <ThemedText>Email *</ThemedText>
                    <TextInput
                        style={[
                            styles.input,
                            {
                                color: Colors[scheme].text,
                                borderColor: isEmailFocused ? Colors[scheme].tint : Colors[scheme].border,
                            },
                        ]}
                        value={email}
                        onChangeText={setEmail}
                        placeholder="Enter your email"
                        placeholderTextColor={Colors[scheme].secondaryText}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        onFocus={() => setIsEmailFocused(true)}
                        onBlur={() => setIsEmailFocused(false)}
                    />
                </ThemedView>

                <ThemedView style={styles.buttonsContainer}>
                    <FullButton text="Send" onPress={() => { router.push('/forgotPassword/emailVerification') }} />
                </ThemedView>
            </ThemedView>
        </ThemedView>
    );
};

export default ForgotPasswordScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        paddingHorizontal: 16,
        paddingTop: 50,
        paddingBottom: 24,
    },
    headerContainer: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    leftHeader: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 12,
    },
    rightHeader: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
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
    heading: {
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
