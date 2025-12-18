import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import GoBackButton from '@/components/ui/gobackbutton';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, StyleSheet } from 'react-native';


const TermsAndConditionsScreen: FC = () => {
    const { t } = useTranslation();
    const schemeRaw = useColorScheme();
    const scheme: keyof typeof Colors = (schemeRaw ?? 'light') as keyof typeof Colors;
    const textColor: string = Colors[scheme].text;
    const secondaryText: string = Colors[scheme].secondaryText;

    return (
        <ThemedView style={styles.container}>
            <ThemedView style={styles.headerContainer}>
                <ThemedView style={styles.leftHeader}>
                    <GoBackButton />
                    <ThemedText type="title" style={{ fontSize: 20 }}>{t('terms.title')}</ThemedText>
                </ThemedView>
            </ThemedView>
            <ScrollView showsVerticalScrollIndicator={false}>
                <ThemedText type="title" style={{ fontSize: 24, marginBottom: 24, color: textColor }}>{t('terms.title')}</ThemedText>
                <ThemedText type="default" style={{ fontSize: 16, marginBottom: 24, color: secondaryText }}>{t('terms.intro')}</ThemedText>

                <ThemedText type="title" style={{ fontSize: 18, marginBottom: 5, color: textColor }}>{t('terms.section1.title')}</ThemedText>
                <ThemedText type="default" style={{ fontSize: 16, marginBottom: 5, color: secondaryText }}>{t('terms.section1.bullet1')}</ThemedText>
                <ThemedText type="default" style={{ fontSize: 16, marginBottom: 5, color: secondaryText }}> {t('terms.section1.bullet2')}</ThemedText>
                <ThemedText type="default" style={{ fontSize: 16, marginBottom: 24, color: secondaryText }}> {t('terms.section1.bullet3')}</ThemedText>

                <ThemedText type="title" style={{ fontSize: 18, marginBottom: 5, color: textColor }}>{t('terms.section2.title')}</ThemedText>
                <ThemedText type="default" style={{ fontSize: 16, marginBottom: 5, color: secondaryText }}>{t('terms.section2.bullet1')}</ThemedText>
                <ThemedText type="default" style={{ fontSize: 16, marginBottom: 5, color: secondaryText }}>{t('terms.section2.bullet2')}</ThemedText>
                <ThemedText type="default" style={{ fontSize: 16, marginBottom: 24, color: secondaryText }}>{t('terms.section2.bullet3')}</ThemedText>

                <ThemedText type="title" style={{ fontSize: 18, marginBottom: 5, color: textColor }}>{t('terms.section3.title')}</ThemedText>
                <ThemedText type="default" style={{ fontSize: 16, marginBottom: 5, color: secondaryText }}>{t('terms.section3.bullet1')}</ThemedText>
                <ThemedText type="default" style={{ fontSize: 16, marginBottom: 5, color: secondaryText }}>{t('terms.section3.bullet2')}</ThemedText>
                <ThemedText type="default" style={{ fontSize: 16, marginBottom: 24, color: secondaryText }}>{t('terms.section3.bullet3')}</ThemedText>

                <ThemedText type="title" style={{ fontSize: 18, marginBottom: 5, color: textColor }}>{t('terms.section4.title')}</ThemedText>
                <ThemedText type="default" style={{ fontSize: 16, marginBottom: 5, color: secondaryText }}>{t('terms.section4.bullet1')}</ThemedText>
                <ThemedText type="default" style={{ fontSize: 16, marginBottom: 5, color: secondaryText }}>{t('terms.section4.bullet2')}</ThemedText>
                <ThemedText type="default" style={{ fontSize: 16, marginBottom: 24, color: secondaryText }}>{t('terms.section4.bullet3')}</ThemedText>

                <ThemedText type="title" style={{ fontSize: 18, marginBottom: 5, color: textColor }}>{t('terms.section5.title')}</ThemedText>
                <ThemedText type="default" style={{ fontSize: 16, marginBottom: 5, color: secondaryText }}>{t('terms.section5.bullet1')}</ThemedText>
                <ThemedText type="default" style={{ fontSize: 16, marginBottom: 5, color: secondaryText }}>{t('terms.section5.bullet2')}</ThemedText>
                <ThemedText type="default" style={{ fontSize: 16, marginBottom: 24, color: secondaryText }}>{t('terms.section5.bullet3')}</ThemedText>

                <ThemedText type="title" style={{ fontSize: 18, marginBottom: 5, color: textColor }}>{t('terms.section6.title')}</ThemedText>
                <ThemedText type="default" style={{ fontSize: 16, marginBottom: 5, color: secondaryText }}>{t('terms.section6.bullet1')}</ThemedText>
                <ThemedText type="default" style={{ fontSize: 16, marginBottom: 24, color: secondaryText }}>{t('terms.section6.bullet2')}</ThemedText>

                <ThemedText type="title" style={{ fontSize: 18, marginBottom: 5, color: textColor }}>{t('terms.section7.title')}</ThemedText>
                <ThemedText type="default" style={{ fontSize: 16, marginBottom: 5, color: secondaryText }}>{t('terms.section7.bullet1')}</ThemedText>
                <ThemedText type="default" style={{ fontSize: 16, marginBottom: 24, color: secondaryText }}>{t('terms.section7.bullet2')}</ThemedText>

                <ThemedText type="title" style={{ fontSize: 18, marginBottom: 5, color: textColor }}>{t('terms.section8.title')}</ThemedText>
                <ThemedText type="default" style={{ fontSize: 16, marginBottom: 5, color: secondaryText }}>{t('terms.section8.bullet1')}</ThemedText>
                <ThemedText type="default" style={{ fontSize: 16, marginBottom: 5, color: secondaryText }}>{t('terms.section8.bullet2')}</ThemedText>
                <ThemedText type="default" style={{ fontSize: 16, marginBottom: 24, color: secondaryText }}>{t('terms.section8.bullet3')}</ThemedText>

                <ThemedText type="title" style={{ fontSize: 18, marginBottom: 5, color: textColor }}>{t('terms.section9.title')}</ThemedText>
                <ThemedText type="default" style={{ fontSize: 16, marginBottom: 5, color: secondaryText }}>{t('terms.section9.bullet1')}</ThemedText>
                <ThemedText type="default" style={{ fontSize: 16, marginBottom: 24, color: secondaryText }}>{t('terms.section9.bullet2')}</ThemedText>

                <ThemedText type="title" style={{ fontSize: 18, marginBottom: 5, color: textColor }}>{t('terms.section10.title')}</ThemedText>
                <ThemedText type="default" style={{ fontSize: 16, marginBottom: 5, color: secondaryText }}>{t('terms.section10.bullet1')}</ThemedText>
                <ThemedText type="default" style={{ fontSize: 16, marginBottom: 24, color: secondaryText }}>{t('terms.section10.bullet2')}.</ThemedText>

                <ThemedText type="default" style={{ fontSize: 16, marginBottom: 24, color: textColor, }}>{t('terms.footer')}</ThemedText>
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