import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import BorderButton from '@/components/ui/borderbutton';
import FullButton from '@/components/ui/fullbutton';
import PasswordInput from '@/components/ui/passwordInput';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { register } from '@/services/authenticationService';
import { useRouter } from 'expo-router';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, ColorSchemeName, Image, ImageSourcePropType, KeyboardAvoidingView, Pressable, ScrollView, StyleSheet, TextInput } from 'react-native';
import Svg, { Path } from 'react-native-svg';

const SignUpScreen: React.FC = () => {
    const { t } = useTranslation();
    const router = useRouter();
    const schemeRaw = useColorScheme() as ColorSchemeName | undefined | null;
    const scheme: keyof typeof Colors = (schemeRaw ?? 'light') as keyof typeof Colors;
    const logoSource: ImageSourcePropType =
        scheme === 'dark'
            ? require('@/assets/images/logo/dark-logo.png')
            : require('@/assets/images/logo/light-logo.png');
    const [email, setEmail] = React.useState<string>('');
    const [password, setPassword] = React.useState<string>('');
    const [fullname, setFullname] = React.useState<string>('');
    const [isFullnameFocused, setIsFullnameFocused] = React.useState(false);
    const [isEmailFocused, setIsEmailFocused] = React.useState(false);
    const [isPasswordFocused, setIsPasswordFocused] = React.useState(false);
    const [phone, setPhone] = React.useState<string>('');
    const [isPhoneFocused, setIsPhoneFocused] = React.useState(false);
    const [username, setUsername] = React.useState<string>('');
    const [isUsernameFocused, setIsUsernameFocused] = React.useState(false);
    const isValidEmail = (email: string): boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    const isValidPassword = (password: string): boolean => {
        return password.length >= 6 && password.length <= 20 && !/\s/.test(password) && /[A-Z]/.test(password) && /[a-z]/.test(password) && /[0-9]/.test(password);
    }
    const handleSignUp = async (fullname: string, email: string, password: string, phone: string) => {
        if (!fullname || !username || !email || !password || !phone) {
            Alert.alert(t('signup.fillAllFields'));
            return;
        }
        if (!isValidEmail(email)) {
            Alert.alert(t('signup.invalidEmail'));
            return;
        }
        if (!isValidPassword(password)) {
            Alert.alert(t('signup.invalidPassword'));
            return;
        }
        try {
            const result = await register(fullname, username, email, phone, password);
            if (result) {
                Alert.alert(t('signup.signupSuccess'));
                router.replace('/login' as any);
            }
            else {
                Alert.alert(t('signup.signupFailed'));
            }
        } catch (error) {
            Alert.alert(t('signup.signupFailed'));
            console.error('Sign up error:', error);
        }
    }

    return (
        <ThemedView style={styles.container}>
            <ThemedView style={styles.logoContainer}>
                <Image source={logoSource} style={styles.logo} />
                <ThemedText type="title" style={[styles.title, { color: Colors[scheme].text }]}>
                    {t('common.appName')}
                </ThemedText>
            </ThemedView>
            <KeyboardAvoidingView behavior="padding">

                <ScrollView showsVerticalScrollIndicator={false} style={styles.content}>

                    <ThemedText type="title" style={styles.heading}>
                        {t('signup.title')}
                    </ThemedText>
                    <ThemedView style={styles.signupRow}>
                        <ThemedText type="default" style={styles.signupPrompt}>
                            {t('signup.alreadyHaveAccount')}
                        </ThemedText>
                        <Pressable onPress={() => router.push('/login')}>
                            <ThemedText type="link" style={[styles.signupLink, { color: Colors[scheme].tint }]}>
                                {t('common.login')}
                            </ThemedText>
                        </Pressable>
                    </ThemedView>

                    <ThemedView>
                        <ThemedView style={styles.fieldGroup}>
                            <ThemedText>{t('common.fullName')} *</ThemedText>
                            <TextInput
                                style={[
                                    styles.input,
                                    {
                                        color: Colors[scheme].text,
                                        borderColor: isFullnameFocused ? Colors[scheme].tint : Colors[scheme].border,
                                    },
                                ]}
                                value={fullname}
                                onChangeText={setFullname}
                                placeholder={t('signup.fullNamePlaceholder')}
                                placeholderTextColor={Colors[scheme].secondaryText}
                                keyboardType="default"
                                autoCapitalize="words"
                                onFocus={() => setIsFullnameFocused(true)}
                                onBlur={() => setIsFullnameFocused(false)}
                            />
                        </ThemedView>
                        <ThemedView style={styles.fieldGroup}>
                            <ThemedText>{t('signup.username')} *</ThemedText>
                            <TextInput
                                style={[
                                    styles.input,
                                    {
                                        color: Colors[scheme].text,
                                        borderColor: isUsernameFocused ? Colors[scheme].tint : Colors[scheme].border,
                                    },
                                ]}
                                value={username}
                                onChangeText={setUsername}
                                placeholder={t('signup.usernamePlaceholder')}
                                placeholderTextColor={Colors[scheme].secondaryText}
                                keyboardType="default"
                                autoCapitalize="words"
                                onFocus={() => setIsUsernameFocused(true)}
                                onBlur={() => setIsUsernameFocused(false)}
                            />
                        </ThemedView>


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
                                placeholder={t('signup.emailPlaceholder')}
                                placeholderTextColor={Colors[scheme].secondaryText}
                                keyboardType="email-address"
                                autoCapitalize="none"
                                onFocus={() => setIsEmailFocused(true)}
                                onBlur={() => setIsEmailFocused(false)}
                            />
                        </ThemedView>

                        <ThemedView style={styles.fieldGroup}>
                            <ThemedText>{t('common.phoneNumber')} *</ThemedText>
                            <TextInput
                                style={[
                                    styles.input,
                                    {
                                        color: Colors[scheme].text,
                                        borderColor: isPhoneFocused ? Colors[scheme].tint : Colors[scheme].border,
                                    },
                                ]}
                                value={phone}
                                onChangeText={setPhone}
                                placeholder={t('signup.phoneNumberPlaceholder')}
                                placeholderTextColor={Colors[scheme].secondaryText}
                                keyboardType="phone-pad"
                                onFocus={() => setIsPhoneFocused(true)}
                                onBlur={() => setIsPhoneFocused(false)}
                            />
                        </ThemedView>

                        <ThemedView style={styles.fieldGroup}>
                            <ThemedText>{t('common.password')} *</ThemedText>
                            <PasswordInput
                                placeholder={t('signup.passwordPlaceholder')}
                                placeholderTextColor={Colors[scheme].secondaryText}
                                value={password}
                                onChangeText={setPassword}
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

                        <ThemedView style={{ marginTop: 32, marginBottom: 40 }}>
                            <FullButton text={t('common.signup')} onPress={() => { handleSignUp(fullname, email, password, phone) }} />
                            <BorderButton
                                text={t('common.signupWithGoogle')}
                                onPress={() => { }}
                                style={{ marginTop: 12 }}
                                icon={
                                    <Svg width="24" height="24" viewBox="0 0 24 24" fill="none" >
                                        <Path d="M12 9.81815V14.4654H18.4582C18.1746 15.96 17.3236 17.2255 16.0472 18.0764L19.9417 21.0982C22.2108 19.0037 23.5199 15.9273 23.5199 12.2728C23.5199 11.4219 23.4436 10.6037 23.3017 9.81828L12 9.81815Z" fill="#4285F4" />
                                        <Path d="M5.27461 14.284L4.39625 14.9564L1.28711 17.3782C3.26165 21.2945 7.30862 24 11.9995 24C15.2394 24 17.9557 22.9309 19.9412 21.0982L16.0467 18.0764C14.9776 18.7964 13.614 19.2328 11.9995 19.2328C8.87951 19.2328 6.22868 17.1273 5.27952 14.291L5.27461 14.284Z" fill="#34A853" />
                                        <Path d="M1.28718 6.62183C0.469042 8.23631 0 10.0581 0 11.9999C0 13.9417 0.469042 15.7636 1.28718 17.378C1.28718 17.3889 5.27997 14.2799 5.27997 14.2799C5.03998 13.5599 4.89812 12.7963 4.89812 11.9998C4.89812 11.2033 5.03998 10.4398 5.27997 9.71976L1.28718 6.62183Z" fill="#FBBC05" />
                                        <Path d="M11.9997 4.77818C13.767 4.77818 15.3379 5.38907 16.5925 6.56727L20.0288 3.13095C17.9452 1.18917 15.2398 0 11.9997 0C7.30887 0 3.26165 2.69454 1.28711 6.62183L5.27978 9.72001C6.22882 6.88362 8.87976 4.77818 11.9997 4.77818Z" fill="#EA4335" />
                                    </Svg>
                                }
                            />
                        </ThemedView>
                    </ThemedView>
                </ScrollView>
            </KeyboardAvoidingView>

        </ThemedView>
    );
};

export default SignUpScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        paddingHorizontal: 16,
        paddingTop: 50,
        paddingBottom: 40,
    },
    logoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
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
        marginBottom: 20,
    },
    heading: {
        fontSize: 30,
        fontWeight: '600',
    },
    signupRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 12,
    },
    signupPrompt: {
        fontSize: 16,
        marginRight: 4,
    },
    signupLink: {
        fontSize: 16,
        fontWeight: '600',
    },
    fieldGroup: {
        marginTop: 24,
    },
    input: {
        fontSize: 18,
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 15,
        marginTop: 8,
    },
    forgotPasswordRow: {
        marginTop: 16,
        alignItems: 'flex-end',
    },
    forgotPasswordLink: {
        fontSize: 14,
        fontWeight: '600',
    },
});