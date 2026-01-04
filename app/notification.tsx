
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from "@/hooks/use-color-scheme";
import { getCurrentLanguage } from '@/i18n';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { FlatList, RefreshControl, StyleSheet, TouchableOpacity } from 'react-native';

export default function NotificationsScreen() {
    const language = getCurrentLanguage();
    const router = useRouter();
    const colorScheme = useColorScheme();
    const [notifications, setNotifications] = useState<any[]>([]);
    const [refreshing, setRefreshing] = useState(false);
    const [loading, setLoading] = useState(true);


    const loadNotifications = async () => {
        try {
            const token = await AsyncStorage.getItem('loginToken');
            const decode = jwtDecode(token || "") as any;
            const data = await getNotifications(language, decode.userid);
            setNotifications(data);
        } catch (error) {
            console.error('Failed to load notifications', error);
        } finally {
            setLoading(false);
        }
    };

    const onRefresh = async () => {
        setRefreshing(true);
        await loadNotifications();
        setRefreshing(false);
    };

    const handleMarkAsRead = async (id: string) => {
        try {
            const res = await markAsRead(id);
            if (res) {
                loadNotifications();
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleMarkAllAsRead = async () => {
        try {
            const token = await AsyncStorage.getItem('loginToken');
            if (token) {
                const decode = jwtDecode(token) as any;
                await markAllAsRead(decode.userid);
                loadNotifications();
            }
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        loadNotifications();
    }, []);

    const renderItem = ({ item }: { item: any }) => {
        const iconName = item.type === 'order' ? 'shippingbox.fill' : item.type === 'promotion' ? 'tag.fill' : 'info.circle.fill';
        const iconColor = item.type === 'order' ? '#2196F3' : item.type === 'promotion' ? '#FF9800' : '#4CAF50';

        return (
            <TouchableOpacity
                style={[
                    styles.notificationItem,
                    { backgroundColor: item.isread ? (Colors[colorScheme ?? 'light'].background) : (Colors[colorScheme ?? 'light'].backgroundSecondary) }
                ]}
                onPress={() => {
                    if (!item.isread) handleMarkAsRead(item.id);
                }}
            >
                <ThemedView style={[styles.iconContainer, { backgroundColor: iconColor + '20' }]}>
                    <IconSymbol name={iconName as any} size={24} color={iconColor} />
                </ThemedView>
                <ThemedView style={styles.contentContainer}>
                    <ThemedView style={styles.headerRow}>
                        <ThemedText type="defaultSemiBold" style={styles.title}>{item.title}</ThemedText>
                        {!item.isread && <ThemedView style={styles.dot} />}
                    </ThemedView>
                    <ThemedText style={styles.message} numberOfLines={2}>{item.message}</ThemedText>
                    <ThemedText style={styles.date}>{new Date(item.createdAt).toLocaleDateString()} {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</ThemedText>
                </ThemedView>
            </TouchableOpacity>
        );
    };

    return (
        <ThemedView style={styles.container}>
            {/* Custom Header with back button behavior if needed, or simply title */}
            <ThemedView style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <IconSymbol name="chevron.left" size={28} color={Colors[colorScheme ?? 'light'].text} />
                </TouchableOpacity>
                <ThemedText type="title">Notifications</ThemedText>
                <TouchableOpacity onPress={handleMarkAllAsRead}>
                    <ThemedText type="link">Mark all read</ThemedText>
                </TouchableOpacity>
            </ThemedView>

            <FlatList
                data={notifications}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.listContent}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors[colorScheme ?? 'light'].text} />
                }
                ListEmptyComponent={
                    !loading ? (
                        <ThemedView style={styles.emptyContainer}>
                            <IconSymbol name="bell.slash" size={48} color={Colors[colorScheme ?? 'light'].icon} />
                            <ThemedText style={styles.emptyText}>No notifications yet</ThemedText>
                        </ThemedView>
                    ) : null
                }
            />
        </ThemedView>
    );
}

import { getNotifications, markAllAsRead, markAsRead } from '@/services/notificationService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingTop: 60, // Adjust for status bar
        paddingBottom: 16,
    },
    backButton: {
        padding: 4,
    },
    listContent: {
        paddingBottom: 20,
    },
    notificationItem: {
        flexDirection: 'row',
        padding: 16,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#ccc', // Use theme color ideally
        alignItems: 'center',
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    contentContainer: {
        flex: 1,
        backgroundColor: 'transparent'
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
        backgroundColor: 'transparent'
    },
    title: {
        fontSize: 16,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: 'red',
    },
    message: {
        fontSize: 14,
        opacity: 0.8,
        marginBottom: 4,
    },
    date: {
        fontSize: 12,
        opacity: 0.5,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 100,
    },
    emptyText: {
        marginTop: 16,
        fontSize: 16,
        opacity: 0.6,
    },
});
