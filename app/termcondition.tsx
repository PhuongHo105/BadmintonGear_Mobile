import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import GoBackButton from '@/components/ui/gobackbutton';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import React, { FC } from 'react';
import { ScrollView, StyleSheet } from 'react-native';


const TermsAndConditionsScreen: FC = () => {
    const schemeRaw = useColorScheme();
    const scheme: keyof typeof Colors = (schemeRaw ?? 'light') as keyof typeof Colors;
    const textColor: string = Colors[scheme].text;
    const secondaryText: string = Colors[scheme].secondaryText;

    return (
        <ThemedView style={styles.container}>
            <ThemedView style={styles.headerContainer}>
                <ThemedView style={styles.leftHeader}>
                    <GoBackButton />
                    <ThemedText type="title" style={{ fontSize: 20 }}>Terms and Conditions</ThemedText>
                </ThemedView>
            </ThemedView>
            <ScrollView showsVerticalScrollIndicator={false}>
                <ThemedText type="title" style={{ fontSize: 24, marginBottom: 24, color: textColor }}>Terms and Conditions</ThemedText>
                <ThemedText type="default" style={{ fontSize: 16, marginBottom: 24, color: secondaryText }}>Welcome to BadmintonGear! These Terms and Conditions (&quot;Terms&quot;) govern your use of our e-commerce app. By accessing or using BadmintonGear, you agree to be bound by these Terms. Please read them carefully before proceeding.</ThemedText>

                <ThemedText type="title" style={{ fontSize: 18, marginBottom: 5, color: textColor }}>1. Account Registration:</ThemedText>
                <ThemedText type="default" style={{ fontSize: 16, marginBottom: 5, color: secondaryText }}> - You must create an account to use certain features of BadmintonGear.</ThemedText>
                <ThemedText type="default" style={{ fontSize: 16, marginBottom: 5, color: secondaryText }}> - You are responsible for providing accurate and up-to-date information during the registration process.</ThemedText>
                <ThemedText type="default" style={{ fontSize: 16, marginBottom: 24, color: secondaryText }}> - You must safeguard your account credentials and notify us immediately of any unauthorized access or use of your account.</ThemedText>

                <ThemedText type="title" style={{ fontSize: 18, marginBottom: 5, color: textColor }}>2. Product Information and Pricing:</ThemedText>
                <ThemedText type="default" style={{ fontSize: 16, marginBottom: 5, color: secondaryText }}> - BadmintonGear strives to provide accurate product descriptions, images, and pricing information.</ThemedText>
                <ThemedText type="default" style={{ fontSize: 16, marginBottom: 5, color: secondaryText }}> - We reserve the right to modify product details and prices without prior notice.</ThemedText>
                <ThemedText type="default" style={{ fontSize: 16, marginBottom: 24, color: secondaryText }}> - In the event of an error, we may cancel or refuse orders placed for incorrectly priced products.</ThemedText>

                <ThemedText type="title" style={{ fontSize: 18, marginBottom: 5, color: textColor }}>3. Order Placement and Fulfillment:</ThemedText>
                <ThemedText type="default" style={{ fontSize: 16, marginBottom: 5, color: secondaryText }}> - By placing an order on BadmintonGear, you agree to purchase the selected products at the stated price.</ThemedText>
                <ThemedText type="default" style={{ fontSize: 16, marginBottom: 5, color: secondaryText }}> - We reserve the right to accept or reject any order, and we may cancel orders due to product unavailability, pricing errors, or suspected fraudulent activity.</ThemedText>
                <ThemedText type="default" style={{ fontSize: 16, marginBottom: 24, color: secondaryText }}> - Once an order is confirmed, we will make reasonable efforts to fulfill and deliver it in a timely manner.</ThemedText>

                <ThemedText type="title" style={{ fontSize: 18, marginBottom: 5, color: textColor }}>4. Payment:</ThemedText>
                <ThemedText type="default" style={{ fontSize: 16, marginBottom: 5, color: secondaryText }}> - BadmintonGear supports various payment methods, including credit/debit cards and online payment platforms.</ThemedText>
                <ThemedText type="default" style={{ fontSize: 16, marginBottom: 5, color: secondaryText }}> - By providing payment information, you represent and warrant that you are authorized to use the chosen payment method.</ThemedText>
                <ThemedText type="default" style={{ fontSize: 16, marginBottom: 24, color: secondaryText }}> - All payments are subject to verification and approval by relevant financial institutions.</ThemedText>

                <ThemedText type="title" style={{ fontSize: 18, marginBottom: 5, color: textColor }}>5. Shipping and Delivery:</ThemedText>
                <ThemedText type="default" style={{ fontSize: 16, marginBottom: 5, color: secondaryText }}> - BadmintonGear will make reasonable efforts to ensure timely delivery of products.</ThemedText>
                <ThemedText type="default" style={{ fontSize: 16, marginBottom: 5, color: secondaryText }}> - Shipping times may vary based on factors beyond our control, such as location, weather conditions, or carrier delays.</ThemedText>
                <ThemedText type="default" style={{ fontSize: 16, marginBottom: 24, color: secondaryText }}> - Risk of loss or damage to products passes to you upon delivery.</ThemedText>

                <ThemedText type="title" style={{ fontSize: 18, marginBottom: 5, color: textColor }}>6. Returns and Refunds:</ThemedText>
                <ThemedText type="default" style={{ fontSize: 16, marginBottom: 5, color: secondaryText }}> - BadmintonGear&apos;s return and refund policies are outlined separately and govern the process for returning products and seeking refunds.</ThemedText>
                <ThemedText type="default" style={{ fontSize: 16, marginBottom: 24, color: secondaryText }}> - Certain products may be non-returnable or subject to specific conditions.</ThemedText>

                <ThemedText type="title" style={{ fontSize: 18, marginBottom: 5, color: textColor }}>7. Intellectual Property:</ThemedText>
                <ThemedText type="default" style={{ fontSize: 16, marginBottom: 5, color: secondaryText }}> - BadmintonGear and its content, including logos, trademarks, text, images, and software, are protected by intellectual property rights.</ThemedText>
                <ThemedText type="default" style={{ fontSize: 16, marginBottom: 24, color: secondaryText }}> - You may not use, reproduce, modify, distribute, or display any part of BadmintonGear without our prior written consent.</ThemedText>

                <ThemedText type="title" style={{ fontSize: 18, marginBottom: 5, color: textColor }}>8. User Conduct:</ThemedText>
                <ThemedText type="default" style={{ fontSize: 16, marginBottom: 5, color: secondaryText }}> - You agree to use BadmintonGear in compliance with applicable laws and regulations.</ThemedText>
                <ThemedText type="default" style={{ fontSize: 16, marginBottom: 5, color: secondaryText }}> - You will not engage in any activity that disrupts or interferes with the functioning of BadmintonGear or infringes upon the rights of others.</ThemedText>
                <ThemedText type="default" style={{ fontSize: 16, marginBottom: 24, color: secondaryText }}> - Any unauthorized use or attempt to access restricted areas or user accounts is strictly prohibited.</ThemedText>

                <ThemedText type="title" style={{ fontSize: 18, marginBottom: 5, color: textColor }}>9. Limitation of Liability:</ThemedText>
                <ThemedText type="default" style={{ fontSize: 16, marginBottom: 5, color: secondaryText }}> - BadmintonGear and its affiliates shall not be liable for any direct, indirect, incidental, consequential, or punitive damages arising from the use or inability to use our app or any products purchased through it.</ThemedText>
                <ThemedText type="default" style={{ fontSize: 16, marginBottom: 24, color: secondaryText }}> - We do not guarantee the accuracy, completeness, or reliability of information provided on BadmintonGear.</ThemedText>

                <ThemedText type="title" style={{ fontSize: 18, marginBottom: 5, color: textColor }}>10. Governing Law:</ThemedText>
                <ThemedText type="default" style={{ fontSize: 16, marginBottom: 5, color: secondaryText }}> - These Terms shall be governed by and construed in accordance with the laws of [Jurisdiction].</ThemedText>
                <ThemedText type="default" style={{ fontSize: 16, marginBottom: 24, color: secondaryText }}> - Any disputes arising out of or relating to these Terms shall be resolved in the courts of [Jurisdiction].</ThemedText>

                <ThemedText type="default" style={{ fontSize: 16, marginBottom: 24, color: textColor, }}>If you have any questions or concerns regarding these Terms and Conditions, please contact our customer support. By using BadmintonGear, you acknowledge that you have read, understood, and agreed to these Terms and Conditions.</ThemedText>
            </ScrollView>
        </ThemedView>
    )
}

export default TermsAndConditionsScreen;

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