import PasswordInput from '@/components/passwordInput';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import FullButton from '@/components/ui/fullbutton';
import GoBackButton from '@/components/ui/gobackbutton';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { changePassword } from '@/services/userService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, StyleSheet, View } from 'react-native';


const ChangePassword02Screen: FC = () => {
    const { t } = useTranslation();
    const router = useRouter();
    const schemeRaw = useColorScheme();
    const scheme: keyof typeof Colors = (schemeRaw ?? 'light') as keyof typeof Colors;
    const textColor: string = Colors[scheme].text;
    const iconColor: string = Colors[scheme].icon;
    const secondaryText: string = Colors[scheme].secondaryText;
    const [error, setError] = React.useState<string | null>(null);

    const isValidPassword = (password: string) => {
        return (password.length >= 6 && /[A-Z]/.test(password) && /[0-9]/.test(password) && /[a-z]/.test(password) && !/\s/.test(password));
    }
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    useEffect(() => {
        if (!newPassword && !confirmPassword) {
            setError(null);
            return;
        }
        if (!isValidPassword(newPassword)) {
            setError(t('forgotPassword.invalidPassword'));
            return;
        }
        if (confirmPassword.length > 0 && newPassword !== confirmPassword) {
            setError(t('forgotPassword.matchError'));
        } else {
            setError(null);
        }
    }, [newPassword, confirmPassword]);

    const handleChangePassword = async () => {
        if (error !== null) return;
        try {
            const currentPassword = await AsyncStorage.getItem('password');
            const response = await changePassword(currentPassword ?? '', newPassword);
            console.log('Password changed successfully:', response);
            if (response === 'Password changed successfully') {
                await AsyncStorage.setItem('password', newPassword);
                Alert.alert(t('profile.ChangePassSuccessTitle'), t('profile.ChangePassSuccessMessage'), [
                    {
                        text: t('common.ok'),
                        onPress: () => router.push('/profile' as any),
                    },
                ]);
            }
            else {
                Alert.alert(t('profile.ChangePassErrorTitle'), t('profile.errorChangingPassword'), [
                    {
                        text: 'Ok',
                        onPress: () => { },
                    },
                ]);
            }
        }
        catch (err) {
            console.error('Error changing password:', err);
            Alert.alert(t('profile.ChangePassErrorTitle'), t('profile.errorChangingPassword'), [
                {
                    text: 'Ok',
                    onPress: () => { },
                },
            ]);
        }
    }

    return (
        <ThemedView style={styles.container}>
            <ThemedView style={styles.headerContainer}>
                <ThemedView style={styles.leftHeader}>
                    <GoBackButton />
                    <ThemedText type="title" style={{ fontSize: 20 }}>{t('changePassword.title')}</ThemedText>
                </ThemedView>
                <ThemedView style={styles.rightHeader}>
                    <ThemedText type="default" style={{ fontSize: 16, color: textColor }}>02 / </ThemedText>
                    <ThemedText type="default" style={{ fontSize: 16, color: iconColor }}>02</ThemedText>
                </ThemedView>
            </ThemedView>
            <ThemedView>
                <ThemedText type="title" style={{ fontSize: 24, marginBottom: 12, color: textColor }}>{t('forgotPassword.newPassword')}</ThemedText>
                <ThemedText type="default" style={{ fontSize: 14, marginBottom: 24, color: secondaryText }}>{t('forgotPassword.newPasswordDescription')}</ThemedText>
                <ThemedView>
                    <ThemedText type="defaultSemiBold" style={{ fontSize: 16, marginBottom: 8, color: textColor }}>{t('forgotPassword.newPassword')} *</ThemedText>
                    <ThemedView style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <PasswordInput
                            placeholder={t('forgotPassword.newPasswordPlaceholder')}
                            placeholderTextColor={secondaryText}
                            value={newPassword}
                            onChangeText={setNewPassword}
                        />
                    </ThemedView>
                </ThemedView>

                <ThemedView style={{ marginTop: 20 }}>
                    <ThemedText type="defaultSemiBold" style={{ fontSize: 16, marginBottom: 8, color: textColor }}>{t('forgotPassword.confirmNewPassword')} *</ThemedText>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <PasswordInput
                            placeholder={t('forgotPassword.confirmNewPasswordPlaceholder')}
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
                    <ThemedView style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <FullButton onPress={() => {
                            if (!newPassword || !confirmPassword) {
                                setError(t('changePassword.fillAll'));
                                return;
                            }
                            if (newPassword !== confirmPassword) {
                                setError(t('forgotPassword.matchError'));
                                return;
                            }
                            handleChangePassword();
                        }} text={t('common.save')} style={{ flex: 1 }} />
                    </ThemedView>
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