import { useThemePreference } from '@/app/providers/ThemePreferenceProvider';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import CustomSwitch from '@/components/ui/customSwitch';
import ProfileMenuItem from '@/components/ui/profileMenuItem';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
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
    const router = useRouter();
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
                <TouchableOpacity onPress={() => Alert.alert('Đăng xuất!')}>
                    <Ionicons name="log-out-outline" size={30} color="#FFFFFF" />
                </TouchableOpacity>
            </ThemedView>

            <ScrollView
                style={[styles.contentContainer, { backgroundColor: background }]}
                showsVerticalScrollIndicator={false}>
                <ThemedView style={styles.section}>
                    <ThemedText style={[styles.sectionTitle, { color: textColor }]}>Personal Information</ThemedText>
                    <ProfileMenuItem
                        icon="box"
                        name="Shipping Address"
                        onPress={() => Alert.alert('Chuyển đến Shipping Address')}
                    />
                    <ProfileMenuItem
                        icon="credit-card"
                        name="Payment Method"
                        onPress={() => Alert.alert('Chuyển đến Payment Method')}
                    />
                    <ProfileMenuItem
                        icon="clipboard"
                        name="Order History"
                        onPress={() => Alert.alert('Chuyển đến Order History')}
                    />
                </ThemedView>

                <ThemedView style={styles.section}>
                    <ThemedText style={[styles.sectionTitle, { color: textColor }]}>Support & Information</ThemedText>
                    <ProfileMenuItem
                        icon="shield"
                        name="Privacy Policy"
                        onPress={() => router.push('/privacy' as any)}
                    />
                    <ProfileMenuItem
                        icon="file-text"
                        name="Terms & Conditions"
                        onPress={() => router.push('/termcondition' as any)}
                    />
                    <ProfileMenuItem
                        icon="help-circle"
                        name="FAQs"
                        onPress={() => router.push('/faqs' as any)}
                    />
                    <ProfileMenuItem
                        icon="message-circle"
                        name="Chatbot"
                        onPress={() => router.push('/chat' as any)}
                    />
                </ThemedView>

                <ThemedView style={styles.section}>
                    <ThemedText style={[styles.sectionTitle, { color: textColor }]}>Account Management</ThemedText>
                    <ProfileMenuItem
                        icon="lock"
                        name="Change Password"
                        onPress={() => router.push('/changepassword/01' as any)}
                    />
                    <CustomSwitch
                        icon="moon"
                        name="Dark Theme"
                        value={!!isDarkTheme}
                        onValueChange={setTheme}
                    />
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