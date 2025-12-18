import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import GoBackButton from '@/components/ui/gobackbutton';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, StyleSheet } from 'react-native';


const FAQsScreen: FC = () => {
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
                    <ThemedText type="title" style={{ fontSize: 20 }}>{t('faqs.title')}</ThemedText>
                </ThemedView>
            </ThemedView>
            <ScrollView showsVerticalScrollIndicator={false}>
                <ThemedText type="title" style={{ fontSize: 18, marginBottom: 12, color: textColor }}>{t('faqs.question1')}</ThemedText>
                <ThemedText type="default" style={{ fontSize: 16, marginBottom: 24, color: secondaryText }}>{t('faqs.answer1')}</ThemedText>

                <ThemedText type="title" style={{ fontSize: 18, marginBottom: 12, color: textColor }}>{t('faqs.question2')}</ThemedText>
                <ThemedText type="default" style={{ fontSize: 16, marginBottom: 24, color: secondaryText }}>{t('faqs.answer2')}</ThemedText>
                <ThemedText type="title" style={{ fontSize: 18, marginBottom: 12, color: textColor }}>{t('faqs.question3')}</ThemedText>
                <ThemedText type="default" style={{ fontSize: 16, marginBottom: 24, color: secondaryText }}>{t('faqs.answer3')}</ThemedText>

                <ThemedText type="title" style={{ fontSize: 18, marginBottom: 12, color: textColor }}>{t('faqs.question4')}</ThemedText>
                <ThemedText type="default" style={{ fontSize: 16, marginBottom: 24, color: secondaryText }}>{t('faqs.answer4')}</ThemedText>
                <ThemedText type="title" style={{ fontSize: 18, marginBottom: 12, color: textColor }}>{t('faqs.question5')}</ThemedText>
                <ThemedText type="default" style={{ fontSize: 16, marginBottom: 24, color: secondaryText }}>{t('faqs.answer5')}</ThemedText>

                <ThemedText type="default" style={{ fontSize: 16, marginBottom: 24, color: textColor, flex: 1, textAlign: "center" }}>{t('faqs.more')} <ThemedText type="link" >{t('faqs.help')}</ThemedText> {t('faqs.at')}</ThemedText>
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