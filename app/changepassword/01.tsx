import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import FullButton from '@/components/ui/fullbutton';
import GoBackButton from '@/components/ui/gobackbutton';
import PasswordInput from '@/components/ui/passwordInput';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';


const ChangePassword01Screen: FC = () => {
    const { t } = useTranslation();
    const router = useRouter();
    const schemeRaw = useColorScheme();
    const scheme: keyof typeof Colors = (schemeRaw ?? 'light') as keyof typeof Colors;
    const textColor: string = Colors[scheme].text;
    const iconColor: string = Colors[scheme].icon;
    const secondaryText: string = Colors[scheme].secondaryText;
    const [error, setError] = React.useState<string | null>(null);
    const [currentPassword, setCurrentPassword] = React.useState('');
    const handleCheckCurrentPassword = async () => {
        const password = await AsyncStorage.getItem('password');
        if (currentPassword !== password)
            setError(t('changePassword.invalidCurrentPassword'));
        else {
            setError(null);
            router.push("/changepassword/02" as any)
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
                    <ThemedText type="default" style={{ fontSize: 16, color: textColor }}>01 / </ThemedText>
                    <ThemedText type="default" style={{ fontSize: 16, color: iconColor }}>02</ThemedText>
                </ThemedView>
            </ThemedView>
            <ThemedView>
                <ThemedText type="title" style={{ fontSize: 24, marginBottom: 12, color: textColor }}>{t('changePassword.currentPassword')}</ThemedText>
                <ThemedText type="default" style={{ fontSize: 14, marginBottom: 24, color: secondaryText }}>{t('changePassword.currentPasswordDescription')}</ThemedText>
                <ThemedView>
                    <ThemedText type="defaultSemiBold" style={{ fontSize: 16, marginBottom: 8, color: textColor }}>{t('changePassword.currentPassword')} *</ThemedText>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <PasswordInput
                            placeholder={t('changePassword.enterCurrentPassword')}
                            placeholderTextColor={secondaryText}
                            value={currentPassword}
                            onChangeText={setCurrentPassword}
                        />
                    </View>
                </ThemedView>
                {error ? (
                    <ThemedText type="default" style={{ color: 'red', marginTop: 8 }}>{error}</ThemedText>
                ) : null}
                <ThemedView style={{ marginTop: 30 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <FullButton onPress={handleCheckCurrentPassword} text={t('common.continue')} style={{ flex: 1 }} />
                    </View>
                </ThemedView>
            </ThemedView>
        </ThemedView>
    )
}

export default ChangePassword01Screen;

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