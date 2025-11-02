import PasswordInput from '@/components/passwordInput';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import FullButton from '@/components/ui/fullbutton';
import GoBackButton from '@/components/ui/gobackbutton';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import {
    ColorSchemeName,
    StyleSheet,
    TextInput
} from 'react-native';

const SetNewPasswordScreen: React.FC = () => {
    const router = useRouter();
    const schemeRaw = useColorScheme() as ColorSchemeName | undefined | null;
    const scheme: keyof typeof Colors = (schemeRaw ?? 'light') as keyof typeof Colors;
    const [codeValues, setCodeValues] = React.useState<string[]>(['', '', '', '', '', '']);
    const inputsRef = React.useRef<(TextInput | null)[]>([]);
    const [error, setError] = React.useState<string | null>(null);
    const [newPassword, setNewPassword] = React.useState('');
    const [confirmPassword, setConfirmPassword] = React.useState('');
    const [isPasswordFocused, setIsPasswordFocused] = React.useState(false);

    const isValidPassword = (password: string) => {
        return (password.length >= 6 && /[A-Z]/.test(password) && /[0-9]/.test(password));
    }

    useEffect(() => {
        if (!newPassword && !confirmPassword) {
            setError(null);
            return;
        }
        if (!isValidPassword(newPassword)) {
            setError('Invalid password');
            return;
        }
        if (confirmPassword.length > 0 && newPassword !== confirmPassword) {
            setError('Passwords do not match');
        } else {
            setError(null);
        }
    }, [newPassword, confirmPassword]);

    const handleSubmit = () => {
        if (!error && newPassword && confirmPassword) {
            router.push('/forgotPassword/success');
        }
    };


    return (
        <ThemedView style={styles.container}>
            <ThemedView style={styles.headerContainer}>
                <ThemedView style={styles.leftHeader}>
                    <GoBackButton />
                    <ThemedText type="title" style={{ fontSize: 20 }}>Create Password</ThemedText>
                </ThemedView>
                <ThemedView style={styles.rightHeader}>
                    <ThemedText type="default" style={{ fontSize: 16, color: Colors[scheme].text }}>03 / </ThemedText>
                    <ThemedText type="default" style={{ fontSize: 16, color: Colors[scheme].secondaryText }}>03</ThemedText>
                </ThemedView>
            </ThemedView>

            <ThemedView style={styles.content}>
                <ThemedText type="title" style={styles.heading}>
                    New Password
                </ThemedText>
                <ThemedText style={[styles.subtitle, { color: Colors[scheme].secondaryText }]}>
                    Enter your new password and remember it.
                </ThemedText>

                <ThemedView style={styles.fieldGroup}>
                    <ThemedText>Password *</ThemedText>
                    <PasswordInput
                        placeholder="Enter your new password"
                        placeholderTextColor={Colors[scheme].secondaryText}
                        value={newPassword}
                        onChangeText={setNewPassword}
                        onFocus={() => setIsPasswordFocused(true)}
                        onBlur={() => setIsPasswordFocused(false)}
                        style={[
                            styles.input,
                            {
                                borderColor: isPasswordFocused ? Colors[scheme].tint : Colors[scheme].border,
                            },
                        ]}
                    />
                </ThemedView>
                <ThemedView style={styles.fieldGroup}>
                    <ThemedText>Confirm Password *</ThemedText>
                    <PasswordInput
                        placeholder="Confirm your new password"
                        placeholderTextColor={Colors[scheme].secondaryText}
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        onFocus={() => setIsPasswordFocused(true)}
                        onBlur={() => setIsPasswordFocused(false)}
                        style={[
                            styles.input,
                            {
                                borderColor: isPasswordFocused ? Colors[scheme].tint : Colors[scheme].border,
                            },
                        ]}
                    />
                </ThemedView>

                {error ? (
                    <ThemedText type="default" style={{ color: 'red', marginTop: 8 }}>{error}</ThemedText>
                ) : null}

                <ThemedView style={styles.buttonsContainer}>
                    <FullButton text="Save" onPress={handleSubmit} />
                </ThemedView>
            </ThemedView>
        </ThemedView>
    );
};

export default SetNewPasswordScreen;

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
    fieldGroup: {
        marginTop: 32,
    },
    input: {
        fontSize: 18,
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 15,
        marginTop: 8,
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
