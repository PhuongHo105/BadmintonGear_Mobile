import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import React, { createContext, useCallback, useContext, useRef, useState } from 'react';
import { Animated, Easing, Pressable, StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export type ToastOptions = {
    message: string;
    type?: ToastType;
    duration?: number; // ms
    title?: string;
};

type ToastContextValue = {
    show: (opts: ToastOptions | string) => void;
};

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
    const schemeRaw = useColorScheme();
    const scheme: keyof typeof Colors = (schemeRaw ?? 'light') as keyof typeof Colors;

    const [message, setMessage] = useState<string>('');
    const [title, setTitle] = useState<string>('');
    const [type, setType] = useState<ToastType>('info');
    const [visible, setVisible] = useState(false);

    const opacity = useRef(new Animated.Value(0)).current;
    const translateY = useRef(new Animated.Value(-20)).current;
    const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    const show = useCallback((opts: ToastOptions | string) => {
        const normalized: ToastOptions = typeof opts === 'string' ? { message: opts } : opts;
        const duration = normalized.duration ?? 3000;
        setMessage(normalized.message);
        setTitle(normalized.title || '');
        setType(normalized.type ?? 'info');
        setVisible(true);

        if (hideTimer.current) {
            clearTimeout(hideTimer.current);
            hideTimer.current = null;
        }

        Animated.parallel([
            Animated.timing(opacity, { toValue: 1, duration: 250, easing: Easing.out(Easing.ease), useNativeDriver: true }),
            Animated.timing(translateY, { toValue: 0, duration: 250, easing: Easing.out(Easing.ease), useNativeDriver: true }),
        ]).start();

        hideTimer.current = setTimeout(() => {
            if (hideTimer.current) {
                clearTimeout(hideTimer.current);
                hideTimer.current = null;
            }
            Animated.parallel([
                Animated.timing(opacity, { toValue: 0, duration: 200, easing: Easing.in(Easing.ease), useNativeDriver: true }),
                Animated.timing(translateY, { toValue: -30, duration: 200, easing: Easing.in(Easing.ease), useNativeDriver: true }),
            ]).start(() => {
                setVisible(false);
            });
        }, duration);
    }, [opacity, translateY]);

    const getToastConfig = () => {
        console.log(message)
        switch (type) {
            case 'success':
                return {
                    borderColor: '#10b981',
                    iconBg: '#10b981',
                    iconComponent: (
                        <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                            <Path d="M9 11L12 14L22 4" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <Path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </Svg>
                    ),
                    defaultTitle: 'Success!',
                };
            case 'error':
                return {
                    borderColor: '#ef4444',
                    iconBg: '#ef4444',
                    iconComponent: (
                        <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                            <Circle cx="12" cy="12" r="10" stroke="#ffffff" strokeWidth="2" />
                            <Path d="M15 9l-6 6M9 9l6 6" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
                        </Svg>
                    ),
                    defaultTitle: 'Error!',
                };
            case 'warning':
                return {
                    borderColor: '#f59e0b',
                    iconBg: '#f59e0b',
                    iconComponent: (
                        <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                            <Path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <Path d="M12 9v4M12 17h.01" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </Svg>
                    ),
                    defaultTitle: 'Warning!',
                };
            case 'info':
            default:
                return {
                    borderColor: '#3b82f6',
                    iconBg: '#3b82f6',
                    iconComponent: (
                        <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                            <Circle cx="12" cy="12" r="10" stroke="#ffffff" strokeWidth="2" />
                            <Path d="M12 16v-4M12 8h.01" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </Svg>
                    ),
                    defaultTitle: 'Info',
                };
        }
    };

    const toastConfig = getToastConfig();
    const titleText = title || toastConfig.defaultTitle;

    return (
        <ToastContext.Provider value={{ show }}>
            {children}
            {visible && (
                <Animated.View
                    style={[
                        styles.container,
                        {
                            opacity,
                            transform: [{ translateY }],
                        },
                    ]}
                >
                    <View style={[styles.toast, { borderLeftColor: toastConfig.borderColor, backgroundColor: Colors[scheme].background }]}>
                        <Pressable style={styles.row}>
                            <View style={[styles.iconBubble, { backgroundColor: toastConfig.iconBg }]}>
                                {toastConfig.iconComponent}
                            </View>
                            <View >
                                <Text style={[styles.text, { color: Colors[scheme].text }]} numberOfLines={1}>
                                    {titleText}
                                </Text>
                                {message ? (
                                    <Text style={[styles.messageText, { color: Colors[scheme].secondaryText }]} numberOfLines={3}>
                                        {message}
                                    </Text>
                                ) : null}
                            </View>
                            <Pressable style={styles.closeBtn} onPress={() => setVisible(false)} hitSlop={8}>
                                <Svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                    <Path d="M18 6L6 18M6 6l12 12" stroke={Colors[scheme].secondaryText} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </Svg>
                            </Pressable>
                        </Pressable>
                    </View>
                </Animated.View>
            )}
        </ToastContext.Provider>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 50,
        left: 0,
        right: 0,
        alignItems: 'center',
        zIndex: 9999,
    },
    toast: {
        paddingHorizontal: 14,
        paddingVertical: 12,
        borderRadius: 12,
        borderLeftWidth: 4,
        shadowColor: '#000',
        shadowOpacity: 0.18,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 4 },
        elevation: 5,
        maxWidth: '94%',
    },
    text: {
        fontSize: 15,
        fontWeight: '700',
        marginBottom: 4,
        lineHeight: 20,
    },
    messageText: {
        fontSize: 14,
        fontWeight: '400',
        lineHeight: 18,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 12,
    },
    iconBubble: {
        width: 36,
        height: 36,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
    },
    iconText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#fff',
    },
    textWrap: {
        flex: 1,
        paddingRight: 4,
    },
    closeBtn: {
        padding: 4,
    },
    closeText: {
        fontSize: 18,
        fontWeight: '800',
    },
});

export function useToast() {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
}

