import PasswordInput from '@/components/passwordInput';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import FullButton from '@/components/ui/fullbutton';
import GoBackButton from '@/components/ui/gobackbutton';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useRouter } from 'expo-router';
import React, { FC } from 'react';
import { StyleSheet, View } from 'react-native';


const ChangePassword01Screen: FC = () => {
    const router = useRouter();
    const schemeRaw = useColorScheme();
    const scheme: keyof typeof Colors = (schemeRaw ?? 'light') as keyof typeof Colors;
    const textColor: string = Colors[scheme].text;
    const iconColor: string = Colors[scheme].icon;
    const secondaryText: string = Colors[scheme].secondaryText;
    const [error, setError] = React.useState<string | null>(null);

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
                <ThemedText type="title" style={{ fontSize: 24, marginBottom: 12, color: textColor }}>Old Password</ThemedText>
                <ThemedText type="default" style={{ fontSize: 14, marginBottom: 24, color: secondaryText }}>Enter old password to change the password.</ThemedText>
                <ThemedView>
                    <ThemedText type="defaultSemiBold" style={{ fontSize: 16, marginBottom: 8, color: textColor }}>Old Password *</ThemedText>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <PasswordInput
                            placeholder="Enter your old password"
                            placeholderTextColor={secondaryText}
                        />
                    </View>
                </ThemedView>
                {error ? (
                    <ThemedText type="default" style={{ color: 'red', marginTop: 8 }}>{error}</ThemedText>
                ) : null}
                <ThemedView style={{ marginTop: 30 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <FullButton onPress={() => { router.push("/changepassword/02") }} text='Continue' style={{ flex: 1 }} />
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