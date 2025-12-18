import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { changeLanguage } from '@/i18n';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet } from 'react-native';

interface LanguageSelectorProps {
    onLanguageChange?: (language: string) => void;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ onLanguageChange }) => {
    const { i18n } = useTranslation();
    const scheme = useColorScheme() ?? 'light';
    const [currentLanguage, setCurrentLanguage] = useState(i18n.language);

    useEffect(() => {
        // Subscribe to language changes
        const handleLanguageChanged = (lng: string) => {
            setCurrentLanguage(lng);
        };

        i18n.on('languageChanged', handleLanguageChanged);

        return () => {
            i18n.off('languageChanged', handleLanguageChanged);
        };
    }, [i18n]);

    const languages = [
        { code: 'en', label: 'English', flag: '🇺🇸' },
        { code: 'vi', label: 'Tiếng Việt', flag: '🇻🇳' },
    ];

    const handleLanguageChange = async (languageCode: string) => {
        await changeLanguage(languageCode);
        onLanguageChange?.(languageCode);
    };

    return (
        <ThemedView style={styles.container}>
            {languages.map((lang) => (
                <Pressable
                    key={lang.code}
                    style={[
                        styles.languageButton,
                        {
                            backgroundColor:
                                currentLanguage === lang.code
                                    ? Colors[scheme].tint
                                    : Colors[scheme].icon,
                            borderColor: Colors[scheme].border,
                        },
                    ]}
                    onPress={() => handleLanguageChange(lang.code)}
                >
                    <ThemedText style={styles.flag}>{lang.flag}</ThemedText>
                    <ThemedText
                        style={[
                            styles.label,
                            {
                                color:
                                    currentLanguage === lang.code
                                        ? '#fff'
                                        : Colors[scheme].text,
                            },
                        ]}
                    >
                        {lang.label}
                    </ThemedText>
                </Pressable>
            ))}
        </ThemedView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        gap: 12,
        marginVertical: 16,
    },
    languageButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 8,
        borderWidth: 1,
        gap: 8,
    },
    flag: {
        fontSize: 20,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
    },
});

export default LanguageSelector;