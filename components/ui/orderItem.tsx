import { useToast } from '@/app/providers/ToastProvider'
import { Colors } from '@/constants/theme'
import { useColorScheme } from '@/hooks/use-color-scheme'
import { addCart } from '@/services/cartService'
import { cancelOrder } from '@/services/ordersService'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Image } from 'expo-image'
import { router } from 'expo-router'
import { jwtDecode } from 'jwt-decode'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { Alert, Pressable, StyleSheet } from 'react-native'
import { ThemedText } from '../themed-text'
import { ThemedView } from '../themed-view'
import BorderButton from './borderbutton'
import FullButton from './fullbutton'


export default function OrderItem({ order, onOrderUpdate }: { order: any, onOrderUpdate?: () => void }) {
    const { t } = useTranslation();
    const toast = useToast();
    const schemeRaw = useColorScheme();
    const scheme: keyof typeof Colors = (schemeRaw ?? 'light') as keyof typeof Colors;
    const tint: string = Colors[scheme].tint;
    const textColor: string = Colors[scheme].text;
    const secondaryText: string = Colors[scheme].secondaryText;
    const borderColor: string = Colors[scheme].border;

    // Safety checks for order data
    if (!order || !order.details || !Array.isArray(order.details) || order.details.length === 0) {
        return null;
    }

    const firstItem = order.details[0];
    const currentPrice: number = firstItem.Product.price * (1 - (firstItem.Product.flashsale?.type === 0 ? firstItem.Product.flashsale?.value : 0) / 100) - (firstItem.Product.flashsale?.type === 1 ? firstItem.Product.flashsale?.value : 0);
    const updatedDate = new Date(order.updatedAt);
    const total = order.details.reduce((sum: number, item: any) => {
        const itemPrice = (item?.Product?.price ?? 0) * (1 - (item?.discount ?? 0) / 100);
        return sum + itemPrice * (item?.quantity ?? 0);
    }, 0) * (order.Promotion?.type === 1 ? (1 - (order.Promotion?.value ?? 0) / 100) : 1) - (order.Promotion?.type === 2 ? (order.Promotion?.value ?? 0) : 0);

    const handleCancelOrder = () => {
        Alert.alert(
            t('orders.cancelOrderTitle'),
            t('order.warnCancel'),
            [
                {
                    text: t('common.cancel'),
                    style: 'cancel',
                },
                {
                    text: t('orders.confirmCancel'),
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            const response = await cancelOrder(order.id);
                            if (response) {
                                toast.show(
                                    {
                                        title: t('common.success'),
                                        message: t('order.successCancel'),
                                        type: 'success'
                                    }
                                );
                                // Reload orders after successful cancellation
                                if (onOrderUpdate) {
                                    onOrderUpdate();
                                }
                            } else {
                                toast.show(
                                    {
                                        title: t('common.error'),
                                        message: t('order.errorCancel'),
                                        type: 'error'
                                    }
                                );
                            }
                        } catch (error) {
                            console.error("Error cancelling order:", error);
                            toast.show(
                                {
                                    title: t('common.error'),
                                    message: t('order.errorCancel'),
                                    type: 'error'
                                }
                            );
                        }
                    }
                }
            ]
        );
    };

    const handleBuyAgain = async () => {
        try {
            let userId: string | number | undefined;
            const userData = await AsyncStorage.getItem('loginToken');
            const decode = jwtDecode<any>(userData || '');
            userId = decode?.id || decode?.userid;

            if (!userId) {
                console.warn('No user id found for adding to cart');
                return;
            }

            const result = await order.details.forEach(async (product: any) => {
                const res = await addCart({
                    userid: userId,
                    productid: product.Product.id,
                    quantity: product.quantity,
                    notes: ''
                });
                return res;
            });
            if (result !== null && result.createdAt && result.updatedAt) {
                toast.show({ type: 'success', message: t('product.addToCartSuccess') });
            }
        } catch (e) {
            console.error('Failed to add to cart', e);
        }
    };

    const getOrderStatusText = (order: any): string => {
        // Cancelled: status === -1
        if (order.status === -1) {
            return t('orders.status.cancelled');
        }
        // Delivered: delivered === true
        if (order.delivered) {
            return t('orders.status.delivered');
        }
        // Shipped: shipping === true && !delivered
        if (order.shipping && !order.delivered) {
            return t('orders.status.shipped');
        }
        // Processing: process === true && !shipping && !delivered
        if (order.process && !order.shipping && !order.delivered) {
            return t('orders.status.processing');
        }
        // Pending/Not Started: !process && !shipping && !delivered && status !== -1
        return t('orders.status.pending');
    };

    return (
        <Pressable onPress={() => { router.push(`/order/${order.id}` as any) }}>
            <ThemedView style={[styles.container, { borderColor: borderColor }]}>
                <ThemedView style={styles.statusContainer}>
                    <ThemedText type="default"
                        style={{
                            fontSize: 14, color: "#fff", paddingHorizontal: 8, paddingVertical: 3, borderRadius: 12,
                            backgroundColor: getOrderStatusText(order) === t('orders.status.delivered') ? 'green' : getOrderStatusText(order) === t('orders.status.pending') ? 'orange' : getOrderStatusText(order) === t('orders.status.cancelled') ? 'red' : getOrderStatusText(order) === t('orders.status.shipped') ? 'blue' : 'purple'
                        }}>{getOrderStatusText(order)}</ThemedText>
                    <ThemedText type='default' style={{ fontSize: 16, color: secondaryText }}>{updatedDate.toLocaleDateString('vi-VN')}</ThemedText>
                </ThemedView>
                <ThemedView style={styles.item}>
                    <Image source={firstItem?.Product?.Imagesproducts?.[0]?.url || require('@/assets/images/unimage.png')} style={styles.image} />
                    <ThemedView style={styles.contentContainer}>
                        <ThemedView style={styles.info}>
                            <ThemedView style={styles.content}>
                                <ThemedText style={{ fontSize: 16, fontWeight: '600', color: textColor }}>{firstItem?.Product.translations?.[0]?.name || 'Product'}</ThemedText>
                                <ThemedView style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 4 }}>
                                    <ThemedText style={{ marginTop: 4, color: tint }}>
                                        {currentPrice.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                                    </ThemedText>
                                    {firstItem?.Product.flashsale && firstItem.Product.flashsale.value !== 0 ? (
                                        <ThemedText type="default" style={{ fontSize: 13, marginTop: 4, color: secondaryText, textDecorationLine: 'line-through' }}>
                                            {firstItem?.Product?.price?.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                                        </ThemedText>
                                    ) : null}
                                </ThemedView>
                            </ThemedView>

                        </ThemedView>

                        <ThemedView style={{ gap: 5 }}>
                            <ThemedView style={[styles.numberOfItems, { borderColor: borderColor, paddingHorizontal: 8 }]}>
                                <ThemedText style={{ textAlign: 'center', marginVertical: 4 }}>{firstItem?.quantity || 0}</ThemedText>
                            </ThemedView>
                            {order.details.length > 1 ? (
                                <ThemedText style={{ fontSize: 12, fontWeight: '600', color: secondaryText }}>+ {order.details.length - 1}  {t('orders.products')}</ThemedText>
                            ) : null}
                            <ThemedView style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                <ThemedText style={{ fontSize: 16, fontWeight: '700', color: textColor }}>{t('orders.total')}:</ThemedText>
                                <ThemedText style={{ fontSize: 16, fontWeight: '700', color: textColor }}>{order.totalprice.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</ThemedText>
                            </ThemedView>
                        </ThemedView>
                    </ThemedView>

                </ThemedView >
                {getOrderStatusText(order) === t('orders.status.delivered') || getOrderStatusText(order) === t('orders.status.cancelled') ? (
                    <ThemedView style={{ paddingHorizontal: 12, flexDirection: 'row', gap: 12 }}>
                        <BorderButton text={t('orders.buyAgain')} onPress={handleBuyAgain} style={{ flex: 1 }} />
                        {getOrderStatusText(order) === t('orders.status.delivered') && (
                            <FullButton text={t('orders.rate')} onPress={() => {
                                const productsData = order.details.map((d: any) => ({
                                    id: d.Product?.id,
                                    name: d.Product?.translations?.[0]?.name || 'Product',
                                    image: d.Product?.Imagesproducts?.[0]?.url || '',
                                    orderId: order.id,
                                    quantity: d.quantity || 1
                                }));
                                const productsJson = encodeURIComponent(JSON.stringify(productsData));
                                router.push(`/feedback?products=${productsJson}`);
                            }} style={{ flex: 1 }} />
                        )}
                    </ThemedView>
                ) : null}
                {getOrderStatusText(order) === t('orders.status.pending') ? (
                    <ThemedView style={{ paddingHorizontal: 12, justifyContent: 'flex-end', gap: 12 }}>
                        <FullButton text={t('orders.cancel')} onPress={handleCancelOrder} style={{ flex: 1 }} />
                    </ThemedView>
                ) : null}
            </ThemedView>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: 'auto',
        padding: 12,
        marginBottom: 20,
        borderWidth: 1,
        borderRadius: 20,
    },
    statusContainer: {
        flexDirection: 'row',
        borderRadius: 8,
        justifyContent: 'space-between',
        width: '100%',
        marginBottom: 12,
        paddingHorizontal: 0,
    },
    item: {
        width: '100%',
        minHeight: 150,
        flexDirection: 'row',
        alignItems: 'flex-start',
        padding: 12,
        marginBottom: 20,
        gap: 12,
    },
    image: {
        width: 100,
        height: 130,
        borderRadius: 19,
        flexShrink: 0,
    },
    numberOfItems: {
        flexDirection: 'row',
        width: 'auto',
        paddingHorizontal: 4,
        paddingVertical: 2,
        borderRadius: 8,
        borderWidth: 1,
        textAlign: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2,
        alignSelf: 'flex-start',
    },
    info: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
    },
    checkbox: {
        width: 30,
        height: 30,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ddd',
        alignItems: 'center',
        justifyContent: 'center',
    },
    checkInner: {
        width: 30,
        height: 30,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    checkMark: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '700',
    },
    content: {
        flexDirection: 'column',
        justifyContent: 'center',
        gap: 2,
        flex: 1,
    },
    contentContainer: {
        flex: 1,
        gap: 8,
        justifyContent: 'space-between',
        minWidth: 0,
    },
    iconBtn: {
        width: 28,
        height: 28,
        alignItems: 'center',
        justifyContent: 'center',
    }
});
