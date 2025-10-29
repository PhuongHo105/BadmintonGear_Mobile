import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import GoBackButton from '@/components/ui/gobackbutton';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import React, { FC } from 'react';
import { ScrollView, StyleSheet } from 'react-native';


const FAQsScreen: FC = () => {
    const schemeRaw = useColorScheme();
    const scheme: keyof typeof Colors = (schemeRaw ?? 'light') as keyof typeof Colors;
    const textColor: string = Colors[scheme].text;
    const secondaryText: string = Colors[scheme].secondaryText;

    return (
        <ThemedView style={styles.container}>
            <ThemedView style={styles.headerContainer}>
                <ThemedView style={styles.leftHeader}>
                    <GoBackButton />
                    <ThemedText type="title" style={{ fontSize: 20 }}>FAQs</ThemedText>
                </ThemedView>
            </ThemedView>
            <ScrollView showsVerticalScrollIndicator={false}>
                <ThemedText type="title" style={{ fontSize: 18, marginBottom: 12, color: textColor }}>Can I cancel my order?</ThemedText>
                <ThemedText type="default" style={{ fontSize: 16, marginBottom: 24, color: secondaryText }}>Yes only if the order is not dispatched yet. You can contact our customer service department to get your order canceled.</ThemedText>

                <ThemedText type="title" style={{ fontSize: 18, marginBottom: 12, color: textColor }}>Will I receive the same product I see in the photo?</ThemedText>
                <ThemedText type="default" style={{ fontSize: 16, marginBottom: 24, color: secondaryText }}>Actual product color may vary from the images shown. Every monitor or mobile display has a different capability to display colors, and every individual may see these colors differently. In addition, lighting conditions at the time the photo was taken can also affect an image&apos;s color.</ThemedText>

                <ThemedText type="title" style={{ fontSize: 18, marginBottom: 12, color: textColor }}>How can I recover the forgotten password?</ThemedText>
                <ThemedText type="default" style={{ fontSize: 16, marginBottom: 24, color: secondaryText }}>If you have forgotten your password, you can recover it from &quot;Login - Forgotten your password?&quot; section. You will receive an e-mail with a link to enter and confirm your new password.</ThemedText>

                <ThemedText type="title" style={{ fontSize: 18, marginBottom: 12, color: textColor }}>Is my personal information confidential?</ThemedText>
                <ThemedText type="default" style={{ fontSize: 16, marginBottom: 24, color: secondaryText }}>Your personal information is confidential. We do not rent, sell, barter or trade email addresses. When you place an order with us, we collect your name, address, telephone number, credit card information and your email address. We use this information to fulfill your order and to communicate with you about your order. All your information is kept confidential and will not be disclosed to anybody unless ordered by government authorities.</ThemedText>

                <ThemedText type="title" style={{ fontSize: 18, marginBottom: 12, color: textColor }}>What payment methods can I use to make purchases?</ThemedText>
                <ThemedText type="default" style={{ fontSize: 16, marginBottom: 24, color: secondaryText }}>We offer the following payment methods: PayPal, VNPay and Voucher code, if applicable.</ThemedText>

                <ThemedText type="default" style={{ fontSize: 16, marginBottom: 24, color: textColor, flex: 1, textAlign: "center" }}>For any query, you can visit our website for <ThemedText type="link" >Help Center</ThemedText> at BadmintonGear.com</ThemedText>
            </ScrollView>
        </ThemedView>
    )
}

export default FAQsScreen;

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
});