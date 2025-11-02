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
    Pressable,
    StyleSheet,
    TextInput
} from 'react-native';

const EmailVerificationScreen: React.FC = () => {
    const router = useRouter();
    const schemeRaw = useColorScheme() as ColorSchemeName | undefined | null;
    const scheme: keyof typeof Colors = (schemeRaw ?? 'light') as keyof typeof Colors;
    const [codeValues, setCodeValues] = React.useState<string[]>(['', '', '', '', '', '']);
    const [focusedIndex, setFocusedIndex] = React.useState<number | null>(null);
    const inputsRef = React.useRef<(TextInput | null)[]>([]);
    const [error, setError] = React.useState<string | null>(null);

    const handleChange = (value: string, index: number) => {
        const sanitized = value.replace(/[^0-9]/g, '').slice(-1);
        setCodeValues((prev) => {
            const next = [...prev];
            next[index] = sanitized;
            return next;
        });

        if (sanitized && index < inputsRef.current.length - 1) {
            inputsRef.current[index + 1]?.focus();
        }
    };

    const handleKeyPress = (event: { nativeEvent: { key: string } }, index: number) => {
        if (event.nativeEvent.key === 'Backspace' && !codeValues[index] && index > 0) {
            inputsRef.current[index - 1]?.focus();
        }
    };

    const handleSubmit = () => {
        const code = codeValues.join('');
        if (code.length === 6) {
            router.push('/forgotPassword/setNewPassword');
        }
        else {
            setError('Please enter the complete 6-digit code.');
        }
    };

    return (
        <ThemedView style={styles.container}>
            <ThemedView style={styles.headerContainer}>
                <ThemedView style={styles.leftHeader}>
                    <GoBackButton />
                    <ThemedText type="title" style={{ fontSize: 20 }}>Email Verification</ThemedText>
                </ThemedView>
                <ThemedView style={styles.rightHeader}>
                    <ThemedText type="default" style={{ fontSize: 16, color: Colors[scheme].text }}>02 / </ThemedText>
                    <ThemedText type="default" style={{ fontSize: 16, color: Colors[scheme].secondaryText }}>03</ThemedText>
                </ThemedView>
            </ThemedView>

            <ThemedView style={styles.content}>
                <ThemedText type="title" style={styles.heading}>
                    Email Verification
                </ThemedText>
                <ThemedText style={[styles.subtitle, { color: Colors[scheme].secondaryText }]}>
                    Enter the 6-digit verification code sent to your email address.
                </ThemedText>

                <ThemedView style={styles.codeRow}>
                    {codeValues.map((value, index) => (
                        <TextInput
                            key={`code-${index}`}
                            ref={(ref) => {
                                inputsRef.current[index] = ref;
                            }}
                            style={[
                                styles.codeInput,
                                {
                                    color: Colors[scheme].text,
                                    borderColor:
                                        focusedIndex === index || value
                                            ? Colors[scheme].tint
                                            : Colors[scheme].border,
                                },
                            ]}
                            value={value}
                            onChangeText={(text) => handleChange(text, index)}
                            keyboardType="number-pad"
                            maxLength={1}
                            onKeyPress={(event) => handleKeyPress(event, index)}
                            onFocus={() => setFocusedIndex(index)}
                            onBlur={() => setFocusedIndex(null)}
                            textAlign="center"
                            returnKeyType="next"
                            importantForAutofill="no"
                        />
                    ))}
                </ThemedView>
                <Pressable>
                    <ThemedText type="default" style={{ marginTop: 16, color: Colors[scheme].tint, textAlign: 'center' }}>
                        Resend Code
                    </ThemedText>
                </Pressable>

                {error ? (
                    <ThemedText type="default" style={{ color: 'red', marginTop: 8 }}>{error}</ThemedText>
                ) : null}

                <ThemedView style={styles.buttonsContainer}>
                    <FullButton text="Proceed" onPress={handleSubmit} />
                </ThemedView>
            </ThemedView>
        </ThemedView>
    );
};

export default EmailVerificationScreen;

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
    codeRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 32,
        columnGap: 8,
    },
    codeInput: {
        width: 48,
        height: 56,
        borderWidth: 1,
        borderRadius: 12,
        fontSize: 20,
        fontWeight: '600',
    },
    buttonsContainer: {
        marginTop: 32,
    },
});
