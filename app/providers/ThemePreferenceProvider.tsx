import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useColorScheme as systemUseColorScheme } from 'react-native';

type Scheme = 'light' | 'dark' | 'system';

interface ThemePreferenceContextValue {
    preference: Scheme;
    setPreference: (s: Scheme) => void;
    resolvedScheme: 'light' | 'dark';
}

const STORAGE_KEY = 'theme.preference.v1';

const ThemePreferenceContext = createContext<ThemePreferenceContextValue | undefined>(undefined);

export const ThemePreferenceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const system = systemUseColorScheme() ?? 'light';
    const [preference, setPreferenceState] = useState<Scheme>('system');

    useEffect(() => {
        AsyncStorage.getItem(STORAGE_KEY).then((v) => {
            if (v === 'light' || v === 'dark' || v === 'system') {
                setPreferenceState(v);
            }
        }).catch(() => {
            // ignore
        });
    }, []);

    const setPreference = (s: Scheme) => {
        setPreferenceState(s);
        AsyncStorage.setItem(STORAGE_KEY, s).catch(() => {
            // ignore
        });
    };

    const resolvedScheme = useMemo(() => {
        if (preference === 'system') return system;
        return preference;
    }, [preference, system]);

    return (
        <ThemePreferenceContext.Provider value={{ preference, setPreference, resolvedScheme }}>
            {children}
        </ThemePreferenceContext.Provider>
    );
};

export function useThemePreference() {
    const ctx = useContext(ThemePreferenceContext);
    return ctx;
}

export default ThemePreferenceProvider;
