import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import FullButton from '@/components/ui/fullbutton';
import GoBackButton from '@/components/ui/gobackbutton';
import OrderItem from '@/components/ui/orderItem';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { getCurrentLanguage } from '@/i18n';
import { getOrderByUserId, getOrderDetails } from '@/services/ordersService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { jwtDecode } from 'jwt-decode';
import React, { FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';


const OrderListScreen: FC = () => {
    const { t } = useTranslation();
    const language = getCurrentLanguage();
    const schemeRaw = useColorScheme();
    const scheme: keyof typeof Colors = (schemeRaw ?? 'light') as keyof typeof Colors;
    const textColor: string = Colors[scheme].text;
    const secondaryText: string = Colors[scheme].secondaryText;
    const [activeTab, setActiveTab] = useState('ongoing');
    const [ongoingOrders, setOngoingOrders] = useState<any[]>([]);
    const [completedOrders, setCompletedOrders] = useState<any[]>([]);
    const loadOrders = async () => {
        try {
            const token = await AsyncStorage.getItem('loginToken');
            const decode = jwtDecode<any>(token || '');
            const userId = decode.id ?? decode.userid;
            const orders = await getOrderByUserId(userId);
            const ordersWithDetails = await Promise.all(orders.map(async (order: any) => {
                const details = await getOrderDetails(order.id, language);
                return { ...order, details };
            }));

            // Ongoing: Not started (0), Processing (1), Shipped (2)
            const ongoing = ordersWithDetails.filter(order =>
                !order.delivered && Number(order.status) !== -1
            );
            // Completed: Delivered (3) or Cancelled (4)
            const completed = ordersWithDetails.filter(order =>
                order.delivered || Number(order.status) === -1
            );
            setOngoingOrders(ongoing);
            setCompletedOrders(completed);
        } catch (error) {
            console.error('Error loading orders:', error);
            setOngoingOrders([]);
            setCompletedOrders([]);
        }
    };

    useEffect(() => {
        loadOrders();
    }, []);

    const renderOrderList = () => {
        const ordersToShow = activeTab === 'ongoing' ? ongoingOrders : completedOrders;

        if (ordersToShow.length === 0) {
            return activeTab === 'ongoing' ? (
                <ThemedView>
                    <Image source={require('@/assets/images/noOrder.png')} style={{ width: '100%', height: 300, marginTop: 50, marginBottom: 20 }} />
                    <ThemedText type="defaultSemiBold" style={{ fontWeight: '600', fontSize: 30, color: textColor, textAlign: 'center', marginTop: 30, padding: 10 }}>{t('orders.noOngoing')}</ThemedText>
                    <ThemedText type="default" style={{ fontSize: 16, color: secondaryText, textAlign: 'center', marginTop: 10, paddingHorizontal: 30 }}>
                        {t('orders.onDescription')}
                    </ThemedText>
                    <FullButton text={t('orders.explore')} onPress={() => { router.push('/') }} style={{ marginTop: 20, flex: 1 }} />
                </ThemedView>
            ) : (
                <ThemedView>
                    <Image source={require('@/assets/images/noOrder.png')} style={{ width: '100%', height: 300, marginTop: 50, marginBottom: 20 }} />
                    <ThemedText type="defaultSemiBold" style={{ fontWeight: '600', fontSize: 30, color: textColor, textAlign: 'center', marginTop: 30, padding: 10 }}>{t('orders.noCompleted')}</ThemedText>
                    <ThemedText type="default" style={{ fontSize: 16, color: secondaryText, textAlign: 'center', marginTop: 10, paddingHorizontal: 30 }}>
                        {t('orders.compDescription')}
                    </ThemedText>
                    <FullButton text={t('orders.explore')} onPress={() => { router.push('/') }} style={{ marginTop: 20, flex: 1 }} />
                </ThemedView>
            );
        }

        // If there are orders, display a simple list
        return (
            <View style={styles.orderListContainer}>
                {ordersToShow.map((order: any) => (
                    <OrderItem key={order.id} order={order} onOrderUpdate={loadOrders} />
                ))}
            </View>
        );
    };
    return (
        <ThemedView style={styles.container}>
            <ThemedView style={styles.headerContainer}>
                <ThemedView style={styles.leftHeader}>
                    <GoBackButton />
                    <ThemedText type="title" style={{ fontSize: 20 }}>{t('orders.title')}</ThemedText>
                </ThemedView>
            </ThemedView>
            <ThemedView style={[styles.tabContainer, { backgroundColor: Colors[scheme].tabBackground }]}>
                {/* Tab "Ongoing" */}
                <Pressable
                    style={[styles.tabButton, activeTab === 'ongoing' && [styles.activeTab, { backgroundColor: Colors[scheme].tabButtonBG }]]}
                    onPress={() => setActiveTab('ongoing')}
                >
                    <ThemedText style={[styles.tabText, activeTab === 'ongoing' && { color: Colors[scheme].activeTabText }]}>
                        {t('orders.ongoing')}
                    </ThemedText>
                </Pressable>
                <Pressable
                    style={[styles.tabButton, activeTab === 'completed' && [styles.activeTab, { backgroundColor: Colors[scheme].tabButtonBG }]]}
                    onPress={() => setActiveTab('completed')}
                >
                    <ThemedText style={[styles.tabText, activeTab === 'completed' && { color: Colors[scheme].activeTabText }]}>
                        {t('orders.completed')}
                    </ThemedText>
                </Pressable>
            </ThemedView>
            <ScrollView showsVerticalScrollIndicator={false}>
                {renderOrderList()}
            </ScrollView>
        </ThemedView>
    );
}

export default OrderListScreen;

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
    tabContainer: {
        flexDirection: 'row',
        borderRadius: 14,
        margin: 16,
        padding: 4,
    },
    tabButton: {
        flex: 1,
        paddingVertical: 10,
        alignItems: 'center',
        borderRadius: 12,
    },
    activeTab: {
        backgroundColor: '#1a1a1a',
    },
    tabText: {
        fontSize: 16,
        fontWeight: '500',
        color: '#666',
    },
    orderListContainer: {
        width: '100%',
    },
    orderItem: {
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 10,
        marginBottom: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
    },
    orderItemTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 5,
    },
    orderItemDetails: {
        fontSize: 14,
        color: '#666',
    },
});