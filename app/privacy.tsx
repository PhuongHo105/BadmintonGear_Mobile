import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import GoBackButton from '@/components/ui/gobackbutton';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import React, { FC } from 'react';
import { ScrollView, StyleSheet } from 'react-native';


const PrivacyPolicyScreen: FC = () => {
    const schemeRaw = useColorScheme();
    const scheme: keyof typeof Colors = (schemeRaw ?? 'light') as keyof typeof Colors;
    const textColor: string = Colors[scheme].text;
    const secondaryText: string = Colors[scheme].secondaryText;

    return (
        <ThemedView style={styles.container}>
            <ThemedView style={styles.headerContainer}>
                <ThemedView style={styles.leftHeader}>
                    <GoBackButton />
                    <ThemedText type="title" style={{ fontSize: 20 }}>Privacy Policy</ThemedText>
                </ThemedView>
            </ThemedView>
            <ScrollView showsVerticalScrollIndicator={false}>
                <ThemedText type="title" style={{ fontSize: 24, marginBottom: 24, color: textColor }}>Privacy Policy</ThemedText>
                <ThemedText type="default" style={{ fontSize: 16, marginBottom: 24, color: secondaryText }}>At BadmintonGear, we are committed to protecting the privacy and security of our users&apos; personal information. This Privacy Policy outlines how we collect, use, disclose, and safeguard the information obtained through our e-commerce app. By using BadmintonGear, you consent to the practices described in this policy.</ThemedText>

                <ThemedText type="title" style={{ fontSize: 18, marginBottom: 5, color: textColor }}>1. Information Collection:</ThemedText>
                <ThemedText type="default" style={{ fontSize: 16, marginBottom: 5, color: secondaryText }}> - Personal Information: We may collect personal information such as name, address, email, and phone number when you create an account, make a purchase, or interact with our services.</ThemedText>
                <ThemedText type="default" style={{ fontSize: 16, marginBottom: 5, color: secondaryText }}> - Transaction Details: We collect information related to your purchases, including order history, payment method, and shipping details.</ThemedText>
                <ThemedText type="default" style={{ fontSize: 16, marginBottom: 24, color: secondaryText }}> - Usage Data: We may collect data on how you interact with our app, such as browsing activity, search queries, and preferences.</ThemedText>

                <ThemedText type="title" style={{ fontSize: 18, marginBottom: 5, color: textColor }}>2. Information Use:</ThemedText>
                <ThemedText type="default" style={{ fontSize: 16, marginBottom: 5, color: secondaryText }}> - Provide Services: We use the collected information to process orders, deliver products, and provide customer support.</ThemedText>
                <ThemedText type="default" style={{ fontSize: 16, marginBottom: 5, color: secondaryText }}> - Personalization: We may use your information to personalize your shopping experience, recommend products, and display targeted advertisements.</ThemedText>
                <ThemedText type="default" style={{ fontSize: 16, marginBottom: 24, color: secondaryText }}> - Communication: We may use your contact information to send important updates, promotional offers, and newsletters. You can opt-out of these communications at any time.</ThemedText>

                <ThemedText type="title" style={{ fontSize: 18, marginBottom: 5, color: textColor }}>3. Information Sharing:</ThemedText>
                <ThemedText type="default" style={{ fontSize: 16, marginBottom: 5, color: secondaryText }}> - Third-Party Service Providers: We may share your information with trusted third-party service providers who assist us in operating our app, fulfilling orders, and improving our services.</ThemedText>
                <ThemedText type="default" style={{ fontSize: 16, marginBottom: 24, color: secondaryText }}> - Legal Compliance: We may disclose personal information if required by law or in response to a valid legal request from authorities.</ThemedText>

                <ThemedText type="title" style={{ fontSize: 18, marginBottom: 5, color: textColor }}>4. Data Security:</ThemedText>
                <ThemedText type="default" style={{ fontSize: 16, marginBottom: 5, color: secondaryText }}> - We implement appropriate security measures to protect your information from unauthorized access, alteration, disclosure, or destruction.</ThemedText>
                <ThemedText type="default" style={{ fontSize: 16, marginBottom: 24, color: secondaryText }}> - However, please note that no data transmission over the internet or electronic storage is 100% secure. We cannot guarantee absolute security of your information.</ThemedText>

                <ThemedText type="title" style={{ fontSize: 18, marginBottom: 5, color: textColor }}>5. User Rights:</ThemedText>
                <ThemedText type="default" style={{ fontSize: 16, marginBottom: 5, color: secondaryText }}> - Access and Update: You have the right to access, correct, or update your personal information stored in our app.</ThemedText>
                <ThemedText type="default" style={{ fontSize: 16, marginBottom: 24, color: secondaryText }}> - Data Retention: We retain your personal information as long as necessary to provide our services and comply with legal obligations.</ThemedText>

                <ThemedText type="title" style={{ fontSize: 18, marginBottom: 5, color: textColor }}>6. Children&apos;s Privacy:</ThemedText>
                <ThemedText type="default" style={{ fontSize: 16, marginBottom: 24, color: secondaryText }}> - BadmintonGear is not intended for children under the age of 13. We do not knowingly collect or solicit personal information from children.</ThemedText>

                <ThemedText type="title" style={{ fontSize: 18, marginBottom: 5, color: textColor }}>7. Updates to the Privacy Policy:</ThemedText>
                <ThemedText type="default" style={{ fontSize: 16, marginBottom: 24, color: secondaryText }}> - We reserve the right to update this Privacy Policy from time to time. Any changes will be posted on our app, and the revised policy will be effective upon posting.</ThemedText>

                <ThemedText type="default" style={{ fontSize: 16, marginBottom: 24, color: textColor, }}>If you have any questions or concerns about our Privacy Policy, please contact our customer support. By using BadmintonGear, you acknowledge that you have read and understood this Privacy Policy and agree to its terms and conditions.</ThemedText>
            </ScrollView>
        </ThemedView>
    )
}

export default PrivacyPolicyScreen;

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