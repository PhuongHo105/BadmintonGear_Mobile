import PasswordInput from '@/components/passwordInput';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import FullButton from '@/components/ui/fullbutton';
import GoBackButton from '@/components/ui/gobackbutton';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useRouter } from 'expo-router';
import React, { FC, useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';


const ChangePassword02Screen: FC = () => {
    const router = useRouter();
    const schemeRaw = useColorScheme();
    const scheme: keyof typeof Colors = (schemeRaw ?? 'light') as keyof typeof Colors;
    const textColor: string = Colors[scheme].text;
    const iconColor: string = Colors[scheme].icon;
    const secondaryText: string = Colors[scheme].secondaryText;
    const [error, setError] = React.useState<string | null>(null);

    const isValidPassword = (password: string) => {
        return (password.length >= 6 && /[A-Z]/.test(password) && /[0-9]/.test(password));
    }
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

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

    return (
        <ThemedView style={styles.container}>
            <ThemedView style={styles.headerContainer}>
                <ThemedView style={styles.leftHeader}>
                    <GoBackButton />
                    <ThemedText type="title" style={{ fontSize: 20 }}>Change password</ThemedText>
                </ThemedView>
                <ThemedView style={styles.rightHeader}>
                    <ThemedText type="default" style={{ fontSize: 16, color: textColor }}>01 / </ThemedText>
                    <ThemedText type="default" style={{ fontSize: 16, color: iconColor }}>02</ThemedText>
                </ThemedView>
            </ThemedView>
            <ThemedView>
                <ThemedText type="title" style={{ fontSize: 24, marginBottom: 12, color: textColor }}>New Password</ThemedText>
                <ThemedText type="default" style={{ fontSize: 14, marginBottom: 24, color: secondaryText }}>Enter your new password and remember it.</ThemedText>
                <ThemedView>
                    <ThemedText type="defaultSemiBold" style={{ fontSize: 16, marginBottom: 8, color: textColor }}>New Password *</ThemedText>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <PasswordInput
                            placeholder="Enter your new password"
                            placeholderTextColor={secondaryText}
                            value={newPassword}
                            onChangeText={setNewPassword}
                        />
                    </View>
                </ThemedView>

                <ThemedView style={{ marginTop: 20 }}>
                    <ThemedText type="defaultSemiBold" style={{ fontSize: 16, marginBottom: 8, color: textColor }}>Confirm Password *</ThemedText>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <PasswordInput
                            placeholder="Confirm your new password"
                            placeholderTextColor={secondaryText}
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                        />
                    </View>
                </ThemedView>
                {error ? (
                    <ThemedText type="default" style={{ color: 'red', marginTop: 8 }}>{error}</ThemedText>
                ) : null}
                <ThemedView style={{ marginTop: 30 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <FullButton onPress={() => {
                            if (!newPassword || !confirmPassword) {
                                setError('Please fill both fields');
                                return;
                            }
                            if (newPassword !== confirmPassword) {
                                setError('Passwords do not match');
                                return;
                            }
                            // proceed
                            router.push('/changepassword/03' as any);
                        }} text='Continue' />
                    </View>
                </ThemedView>
            </ThemedView>
        </ThemedView>
    )
}

export default ChangePassword02Screen;

const styles = StyleSheet.create({
    container: {
        height: '100%',
        width: '100%',
        padding: 15,
        paddingTop: 50,
        position: 'relative',
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
});