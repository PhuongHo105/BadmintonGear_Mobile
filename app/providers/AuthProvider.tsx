import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter, useSegments } from 'expo-router';
import React, { createContext, useContext, useEffect, useState } from 'react';

type AuthContextType = {
    isAuthenticated: boolean;
    isLoading: boolean;
    signIn: (token: string) => Promise<void>;
    signOut: () => Promise<void>;
    checkAuth: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();
    const segments = useSegments();

    const checkAuth = async () => {
        try {
            const token = await AsyncStorage.getItem('loginToken');
            setIsAuthenticated(!!token);
        } catch (error) {
            console.error('Error checking auth:', error);
            setIsAuthenticated(false);
        } finally {
            setIsLoading(false);
        }
    };

    const signIn = async (token: string) => {
        await AsyncStorage.setItem('loginToken', token);
        setIsAuthenticated(true);
    };

    const signOut = async () => {
        await AsyncStorage.removeItem('loginToken');
        setIsAuthenticated(false);
    };

    useEffect(() => {
        checkAuth();
    }, []);

    // Auth protection logic
    useEffect(() => {
        if (isLoading) return;

        const inAuthGroup = segments[0] === '(tabs)' ||
            segments[0] === 'checkout' ||
            segments[0] === 'orderList' ||
            segments[0] === 'order' ||
            segments[0] === 'shippingAddress' ||
            segments[0] === 'changepassword' ||
            segments[0] === 'feedback';

        const inPublicRoute = segments[0] === 'welcome' ||
            segments[0] === 'login' ||
            segments[0] === 'signup' ||
            segments[0] === 'onboarding' ||
            segments[0] === 'forgotPassword';

        if (!isAuthenticated && inAuthGroup) {
            // User not logged in but trying to access protected route
            router.replace('/login');
        } else if (isAuthenticated && (segments[0] === 'login' || segments[0] === 'signup' || segments[0] === 'welcome' || segments[0] === 'onboarding')) {
            // User already logged in, redirect to home from login/signup/welcome/onboarding
            router.replace('/(tabs)');
        }
    }, [isAuthenticated, segments, isLoading]);

    return (
        <AuthContext.Provider value={{ isAuthenticated, isLoading, signIn, signOut, checkAuth }}>
            {children}
        </AuthContext.Provider>
    );
}
