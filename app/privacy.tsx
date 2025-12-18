import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import GoBackButton from '@/components/ui/gobackbutton';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, StyleSheet } from 'react-native';


const PrivacyPolicyScreen: FC = () => {
    const schemeRaw = useColorScheme();
    const scheme: keyof typeof Colors = (schemeRaw ?? 'light') as keyof typeof Colors;
    const textColor: string = Colors[scheme].text;
    const secondaryText: string = Colors[scheme].secondaryText;

    const { t } = useTranslation();

    return (
        <ThemedView style={styles.container}>
            <ThemedView style={styles.headerContainer}>
                <ThemedView style={styles.leftHeader}>
                    <GoBackButton />
                    <ThemedText type="title" style={{ fontSize: 20 }}>
                        {t('privacy.title')}
                    </ThemedText>
                </ThemedView>
            </ThemedView>


            <ScrollView showsVerticalScrollIndicator={false}>
                <ThemedText type="title" style={{ fontSize: 24, marginBottom: 24, color: textColor }}>{t('privacy.title')}</ThemedText>
                <ThemedText type="default" style={{ fontSize: 16, marginBottom: 24, color: secondaryText }}>{t('privacy.intro')} </ThemedText>


                <ThemedText type="title" style={{ fontSize: 18, marginBottom: 5, color: textColor }}> {t('privacy.section1.title')} </ThemedText>
                <ThemedText type="default" style={{ fontSize: 16, marginBottom: 5, color: secondaryText }}>{t('privacy.section1.item1')}</ThemedText>

                <ThemedText type="default" style={{ fontSize: 16, marginBottom: 5, color: secondaryText }}>{t('privacy.section1.item2')}</ThemedText>
                <ThemedText type="default" style={{ fontSize: 16, marginBottom: 24, color: secondaryText }}>{t('privacy.section1.item3')}</ThemedText>

                <ThemedText type="title" style={{ fontSize: 18, marginBottom: 5, color: textColor }}> {t('privacy.section2.title')} </ThemedText>
                <ThemedText type="default" style={{ fontSize: 16, marginBottom: 5, color: secondaryText }}>{t('privacy.section2.item1')}</ThemedText>
                <ThemedText type="default" style={{ fontSize: 16, marginBottom: 5, color: secondaryText }}>{t('privacy.section2.item2')}</ThemedText>
                <ThemedText type="default" style={{ fontSize: 16, marginBottom: 24, color: secondaryText }}>{t('privacy.section2.item3')}</ThemedText>

                <ThemedText type="title" style={{ fontSize: 18, marginBottom: 5, color: textColor }}>{t('privacy.section3.title')}</ThemedText>
                <ThemedText type="default" style={{ fontSize: 16, marginBottom: 5, color: secondaryText }}>{t('privacy.section3.item1')}</ThemedText>
                <ThemedText type="default" style={{ fontSize: 16, marginBottom: 24, color: secondaryText }}>{t('privacy.section3.item2')}</ThemedText>

                <ThemedText type="title" style={{ fontSize: 18, marginBottom: 5, color: textColor }}>{t('privacy.section4.title')}</ThemedText>
                <ThemedText type="default" style={{ fontSize: 16, marginBottom: 5, color: secondaryText }}>{t('privacy.section4.item1')}</ThemedText>
                <ThemedText type="default" style={{ fontSize: 16, marginBottom: 24, color: secondaryText }}>{t('privacy.section4.item2')}</ThemedText>

                <ThemedText type="title" style={{ fontSize: 18, marginBottom: 5, color: textColor }}>{t('privacy.section5.title')}</ThemedText>
                <ThemedText type="default" style={{ fontSize: 16, marginBottom: 5, color: secondaryText }}>{t('privacy.section5.item1')}</ThemedText>
                <ThemedText type="default" style={{ fontSize: 16, marginBottom: 24, color: secondaryText }}>{t('privacy.section5.item2')}</ThemedText>

                <ThemedText type="title" style={{ fontSize: 18, marginBottom: 5, color: textColor }}>{t('privacy.section6.title')}</ThemedText>
                <ThemedText type="default" style={{ fontSize: 16, marginBottom: 24, color: secondaryText }}>{t('privacy.section6.item1')}</ThemedText>

                <ThemedText type="title" style={{ fontSize: 18, marginBottom: 5, color: textColor }}>{t('privacy.section7.title')}</ThemedText>
                <ThemedText type="default" style={{ fontSize: 16, marginBottom: 24, color: secondaryText }}>{t('privacy.section7.item1')}</ThemedText>
                <ThemedText type="default" style={{ fontSize: 16, marginBottom: 24, color: textColor }}>{t('privacy.outro')}</ThemedText>
            </ScrollView>
        </ThemedView>
    );
};

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