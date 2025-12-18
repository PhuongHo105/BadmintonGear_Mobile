import AsyncStorage from '@react-native-async-storage/async-storage';
import i18n from 'i18next';
import 'intl-pluralrules';
import { initReactI18next } from 'react-i18next';
import en from './locales/en.json';
import vi from './locales/vi.json';

const LANGUAGE_STORAGE_KEY = 'user_language';

// Detect device language
const getDeviceLanguage = async (): Promise<string> => {
    try {
        const savedLanguage = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY);
        if (savedLanguage) {
            return savedLanguage;
        }
        // Default to Vietnamese
        return 'vi';
    } catch (error) {
        return 'vi';
    }
};

const resources = {
    en: { translation: en },
    vi: { translation: vi },
};

// Initialize i18n
const initI18n = async () => {
    const language = await getDeviceLanguage();

    i18n.use(initReactI18next)
        .init({
            resources,
            lng: language,
            fallbackLng: 'en',
            compatibilityJSON: 'v4',
            interpolation: {
                escapeValue: false,
            },
            react: {
                useSuspense: false,
            },
        });
};

// Change language function
export const changeLanguage = async (language: string) => {
    try {
        await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, language);
        await i18n.changeLanguage(language);
    } catch (error) {
        console.error('Error changing language:', error);
    }
};

// Get current language
export const getCurrentLanguage = (): string => {
    return i18n.language;
};

initI18n();

export default i18n;