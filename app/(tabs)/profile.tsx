import { useAuth } from '@/app/providers/AuthProvider';
import { useThemePreference } from '@/app/providers/ThemePreferenceProvider';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import CustomSwitch from '@/components/ui/customSwitch';
import LanguageSelector from '@/components/ui/language-selector';
import ProfileMenuItem from '@/components/ui/profileMenuItem';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React from 'react';
import { useTranslation } from 'react-i18next';
import {
    Alert,
    ColorSchemeName,
    Image,
    ScrollView,
    StatusBar,
    StyleSheet,
    TouchableOpacity,
    View
} from 'react-native';

const ProfileScreen: React.FC = () => {
    const { t } = useTranslation();
    const router = useRouter();
    const { signOut } = useAuth();
    const schemeRaw = useColorScheme() as ColorSchemeName | null | undefined;
    const scheme: keyof typeof Colors = (schemeRaw ?? 'light') as keyof typeof Colors
    const tint: string = Colors[scheme].tint;
    const background: string = Colors[scheme].background;
    const textColor: string = Colors[scheme].text;
    const themePref = useThemePreference();
    const isDarkTheme = themePref?.resolvedScheme === 'dark';
    const setTheme = (v: boolean) => {
        if (!themePref) return;
        themePref.setPreference(v ? 'dark' : 'light');
    };
    const [userInfo, setUserInfo] = React.useState<{ name: string; email: string; avatar?: string }>(
        {
            name: 'Nguyễn Văn A',
            email: 'nguyenvana@gmail.com',
            avatar: undefined,
        }
    );

    const handleLogout = async () => {
        Alert.alert(
            t('profile.logout'),
            t('profile.logoutConfirmation'),
            [
                { text: t('common.cancel'), onPress: () => { }, style: 'cancel' },
                {
                    text: t('profile.logout'), onPress: async () => {
                        await AsyncStorage.removeItem('password');
                        await signOut();
                        // AuthProvider will handle navigation automatically
                    }, style: 'destructive'
                },
            ]
        );
    }

    return (
        <ThemedView style={[styles.container, { backgroundColor: tint }]}>
            <StatusBar barStyle="light-content" />
            <ThemedView style={[styles.header, { backgroundColor: tint }]}>
                <Image
                    source={userInfo.avatar ? { uri: userInfo.avatar } : require('../../assets/images/avatar/dark-avatar.png')}
                    style={styles.avatar}
                />
                <ThemedView style={styles.userInfo}>
                    <ThemedText style={styles.userName}>{userInfo.name}</ThemedText>
                    <ThemedText style={styles.userEmail}>{userInfo.email}</ThemedText>
                </ThemedView>
                <TouchableOpacity onPress={handleLogout}>
                    <Ionicons name="log-out-outline" size={30} color="#FFFFFF" />
                </TouchableOpacity>
            </ThemedView>

            <ScrollView
                style={[styles.contentContainer, { backgroundColor: background }]}
                showsVerticalScrollIndicator={false}>
                <ThemedView style={styles.section}>
                    <ThemedText style={[styles.sectionTitle, { color: textColor }]}>{t('profile.personalInformation')}</ThemedText>
                    <ProfileMenuItem
                        icon="box"
                        name={t('profile.shippingAddress')}
                        onPress={() => router.push('/shippingAddress' as any)}
                    />
                    <ProfileMenuItem
                        icon="clipboard"
                        name={t('profile.orderHistory')}
                        onPress={() => router.push('/orderList' as any)}
                    />
                </ThemedView>

                <ThemedView style={styles.section}>
                    <ThemedText style={[styles.sectionTitle, { color: textColor }]}>{t('profile.supportInformation')}</ThemedText>
                    <ProfileMenuItem
                        icon="shield"
                        name={t('profile.privacyPolicy')}
                        onPress={() => router.push('/privacy' as any)}
                    />
                    <ProfileMenuItem
                        icon="file-text"
                        name={t('profile.termsAndConditions')}
                        onPress={() => router.push('/termcondition' as any)}
                    />
                    <ProfileMenuItem
                        icon="help-circle"
                        name={t('profile.faqs')}
                        onPress={() => router.push('/faqs' as any)}
                    />
                    <ProfileMenuItem
                        icon="message-circle"
                        name={t('profile.chatbot')}
                        onPress={() => router.push('/chat' as any)}
                    />
                </ThemedView>

                <ThemedView style={styles.section}>
                    <ThemedText style={[styles.sectionTitle, { color: textColor }]}>Account Management</ThemedText>
                    <ProfileMenuItem
                        icon="lock"
                        name={t('profile.changePassword')}
                        onPress={() => router.push('/changepassword/01' as any)}
                    />
                    <CustomSwitch
                        icon="moon"
                        name={t('profile.darkTheme')}
                        value={!!isDarkTheme}
                        onValueChange={setTheme}
                    />
                </ThemedView>
                <ThemedView style={styles.section}>
                    <ThemedText style={[styles.sectionTitle, { color: textColor }]}>{t('profile.language')}</ThemedText>
                    <LanguageSelector />
                </ThemedView>
                <View style={{ height: 50 }} />
            </ScrollView>


        </ThemedView>
    );
};
export default ProfileScreen;

const styles = StyleSheet.create({
    container: {
        height: '100%',
        width: '100%',
        paddingTop: 50,
        flex: 1,
    },
    // --- Header ---
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 20,
    },
    avatar: {
        width: 60,
        height: 60,
        borderRadius: 30,
    },
    userInfo: {
        flex: 1,
        marginLeft: 15,
        backgroundColor: 'transparent',
    },
    userName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
    userEmail: {
        fontSize: 14,
        color: '#E0E0E0',
    },
    // --- Content ---
    contentContainer: {
        flex: 1,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingTop: 10,
    },
    section: {
        marginTop: 20,
        paddingHorizontal: 25,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 15,
    },
    // --- Menu Item ---
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 15,
        borderBottomWidth: 1,
    },
});