import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import BorderButton from '@/components/ui/borderbutton';
import FullButton from '@/components/ui/fullbutton';
import GoBackButton from '@/components/ui/gobackbutton';
import OrderDetailItem from '@/components/ui/orderDetailItem';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { getCurrentLanguage } from '@/i18n';
import { cancelOrder, getOrderById, getOrderDetails } from '@/services/ordersService';
import { router, useLocalSearchParams } from 'expo-router';
import React, { FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, ScrollView, StyleSheet } from 'react-native';
import { useToast } from '../providers/ToastProvider';


const OrderDetailScreen: FC = () => {
    const { t } = useTranslation();
    const toast = useToast();
    const language = getCurrentLanguage();
    const schemeRaw = useColorScheme();
    const scheme: keyof typeof Colors = (schemeRaw ?? 'light') as keyof typeof Colors;
    const params = useLocalSearchParams();
    const [order, setOrder] = useState<any | null>(null);
    const [loading, setLoading] = useState(false);
    const [subtotal, setSubtotal] = useState(0);
    const [total, setTotal] = useState(0);
    const [details, setDetails] = useState<any[]>([]);

    const parseVietnamAddress = (address: string) => {
        const result = { streetAddress: '', district: '', city: '', country: '' };
        if (!address || typeof address !== 'string') return result;
        const parts = address.split(',').map(p => p.trim()).filter(Boolean);
        for (const p of parts) {
            const lower = p.toLowerCase();
            if (!result.country && /(việt\s?nam|vietnam)/.test(lower)) {
                result.country = p;
                continue;
            }
            if (!result.city && /(thành phố|tp\.|tỉnh|city|province)/i.test(p)) {
                result.city = p;
                continue;
            }
            if (!result.district && /(quận|huyện|thị xã|district|county)/i.test(p)) {
                result.district = p;
                continue;
            }
            if (!result.streetAddress) {
                result.streetAddress = p;
            } else {
                result.streetAddress = `${result.streetAddress}, ${p}`;
            }
        }
        return result;
    };

    const fetchOrder = async () => {
        const orderId = params.id as string | undefined;
        if (!orderId) return;
        setLoading(true);
        const data = await getOrderById(orderId);
        if (data) {
            setOrder(data);
        }
        const details = await getOrderDetails(orderId, language);
        setDetails(details);
        setLoading(false);
    };

    useEffect(() => {
        fetchOrder();
    }, [params.id]);

    useEffect(() => {
        if (!order) return;
        const items = Array.isArray(order.items) ? order.items : [];
        const newSubtotal = items.reduce((sum: number, item: any) => {
            const price = item.product?.price ?? item.price ?? 0;
            const discount = item.product?.discount ?? item.discount ?? 0;
            const qty = item.numberOfItems ?? item.quantity ?? 1;
            const netPrice = price * (1 - discount / 100);
            return sum + netPrice * qty;
        }, 0);
        setSubtotal(newSubtotal);

        const shippingCost = order.shipping ?? order.shippingCost ?? order.shipping_fee ?? 0;
        const discountPercent = order.discount ?? order.discountValue ?? 0;
        const computedTotal = shippingCost + newSubtotal * (1 - discountPercent / 100);
        if (order.totalprice !== undefined && order.totalprice !== null) {
            setTotal(order.totalprice);
        } else {
            setTotal(computedTotal);
        }
    }, [order]);

    const updatedDate = order?.updatedAt ? new Date(order.updatedAt) : null;

    const rawStatusCode: number | null = typeof order?.status === 'number' ? order.status : null;

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
                                fetchOrder();
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

    const getStatusColor = (order: any): string => {
        // Cancelled: status === -1
        if (order.status === -1) {
            return 'red';
        }

        // Delivered: delivered === true
        if (order.delivered) {
            return 'green';
        }

        // Shipped: shipping === true && !delivered
        if (order.shipping && !order.delivered) {
            return 'blue';
        }

        // Processing: process === true && !shipping && !delivered
        if (order.process && !order.shipping && !order.delivered) {
            return 'purple';
        }

        // Pending/Not Started: !process && !shipping && !delivered && status !== -1
        return 'orange';
    }


    return (
        <ThemedView style={styles.container}>
            <ThemedView style={styles.headerContainer}>
                <ThemedView style={styles.leftHeader}>
                    <GoBackButton />
                    <ThemedText type="title" style={{ fontSize: 20 }}>{t('order.orderDetail')}</ThemedText>
                </ThemedView>
            </ThemedView>
            <ScrollView showsVerticalScrollIndicator={false}>
                {loading && (
                    <ThemedText type='default' style={{ marginBottom: 12 }}>{t('common.loading')}</ThemedText>
                )}
                {!loading && !order && (
                    <ThemedText type='default' style={{ marginBottom: 12 }}>{t('common.error')}</ThemedText>
                )}
                {order && (
                    <>
                        <ThemedView style={styles.statusContainer}>
                            <ThemedText type="default"
                                style={{
                                    fontSize: 14, color: "#fff", paddingHorizontal: 8, paddingVertical: 3, borderRadius: 12,
                                    backgroundColor: getStatusColor(order)
                                }}>{getOrderStatusText(order)}</ThemedText>
                            {updatedDate && (
                                <ThemedText type='default' style={{ fontSize: 16, color: Colors[scheme].secondaryText }}>{updatedDate.toLocaleDateString('vi-VN')}</ThemedText>
                            )}
                        </ThemedView>
                        <ThemedView style={styles.content}>
                            <ThemedView style={{ justifyContent: 'center', alignItems: 'center', width: '100%', marginBottom: 20 }}>
                                <ThemedText type='title' style={{ fontSize: 20, width: '100%', textAlign: 'left' }}>{t('order.item')} ({details?.length ?? 0})</ThemedText>
                                {details?.map((i: any) => (
                                    <OrderDetailItem
                                        key={i.id}
                                        type='review'
                                        product={i.product ?? i}
                                        numberOfItems={i.numberOfItems ?? i.quantity ?? 1}
                                    />
                                ))}
                            </ThemedView>
                            <ThemedView >
                                <ThemedText type='title' style={{ fontSize: 20 }}>{t('order.shippingAddress')}</ThemedText>
                                {(() => {
                                    const parsed = parseVietnamAddress(order.address ?? '');
                                    return (
                                        <>
                                            <ThemedView style={styles.contentContainer}>
                                                <ThemedText type='default' style={{ fontSize: 16, color: Colors[scheme].secondaryText }}>{t('order.fullName')}</ThemedText>
                                                <ThemedText type='default' style={{ fontSize: 16, color: Colors[scheme].secondaryText }}>{order.User?.name ?? ''}</ThemedText>
                                            </ThemedView>
                                            <ThemedView style={styles.contentContainer}>
                                                <ThemedText type='default' style={{ fontSize: 16, color: Colors[scheme].secondaryText }}>{t('order.phoneNumber')}</ThemedText>
                                                <ThemedText type='default' style={{ fontSize: 16, color: Colors[scheme].secondaryText }}>{order.phonenumber ?? order.User?.phonenumber ?? ''}</ThemedText>
                                            </ThemedView>
                                            <ThemedView style={styles.contentContainer}>
                                                <ThemedText type='default' style={{ fontSize: 16, color: Colors[scheme].secondaryText }}>{t('order.country')}</ThemedText>
                                                <ThemedText type='default' style={{ fontSize: 16, color: Colors[scheme].secondaryText }}>{parsed.country}</ThemedText>
                                            </ThemedView>
                                            <ThemedView style={styles.contentContainer}>
                                                <ThemedText type='default' style={{ fontSize: 16, color: Colors[scheme].secondaryText }}>{t('order.city')}</ThemedText>
                                                <ThemedText type='default' style={{ fontSize: 16, color: Colors[scheme].secondaryText }}>{parsed.city}</ThemedText>
                                            </ThemedView>
                                            <ThemedView style={styles.contentContainer}>
                                                <ThemedText type='default' style={{ fontSize: 16, color: Colors[scheme].secondaryText }}>{t('order.district')}</ThemedText>
                                                <ThemedText type='default' style={{ fontSize: 16, color: Colors[scheme].secondaryText }}>{parsed.district}</ThemedText>
                                            </ThemedView>
                                            <ThemedView style={styles.contentContainer}>
                                                <ThemedText type='default' style={{ fontSize: 16, color: Colors[scheme].secondaryText }}>{t('order.streetAddress')}</ThemedText>
                                                <ThemedText type='default' style={{ fontSize: 16, color: Colors[scheme].secondaryText }}>{parsed.streetAddress}</ThemedText>
                                            </ThemedView>
                                        </>
                                    );
                                })()}
                            </ThemedView>
                            <ThemedView >
                                <ThemedText type='title' style={{ fontSize: 20 }}>{t('order.orderInformation')}</ThemedText>
                                <ThemedView style={styles.contentContainer}>
                                    <ThemedText type='default' style={{ fontSize: 16, color: Colors[scheme].secondaryText }}>{t('order.subtotal')}</ThemedText>
                                    <ThemedText type='default' style={{ fontSize: 16, color: Colors[scheme].secondaryText }}>{subtotal.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</ThemedText>
                                </ThemedView>
                                <ThemedView style={styles.contentContainer}>
                                    <ThemedText type='default' style={{ fontSize: 16, color: Colors[scheme].secondaryText }}>{t('order.shippingCost')}</ThemedText>
                                    <ThemedText type='default' style={{ fontSize: 16, color: Colors[scheme].secondaryText }}>{(order.shippingCost ?? order.shipping_fee ?? 0).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</ThemedText>
                                </ThemedView>
                                <ThemedView style={styles.contentContainer}>
                                    <ThemedText type='default' style={{ fontSize: 16, color: Colors[scheme].secondaryText }}>{t('order.discount')}</ThemedText>
                                    <ThemedText type='default' style={{ fontSize: 16, color: Colors[scheme].secondaryText }}>{order.discount ?? order.discountValue ?? 0} %</ThemedText>
                                </ThemedView>
                                <ThemedView style={styles.contentContainer}>
                                    <ThemedText type='default' style={{ fontSize: 18, color: Colors[scheme].text }}>{t('order.total')}</ThemedText>
                                    <ThemedText type='default' style={{ fontSize: 18, color: Colors[scheme].text }}>{total.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</ThemedText>
                                </ThemedView>
                            </ThemedView>
                        </ThemedView>
                        {(rawStatusCode === 2 || getOrderStatusText(order) === t('orders.status.delivered')) ? (
                            <ThemedView style={{ paddingHorizontal: 12, flexDirection: 'row', gap: 12 }}>
                                <BorderButton text={t('order.buyAgain')} onPress={() => { }} style={{ flex: 1 }} />
                                <FullButton text={t('order.rate')} onPress={() => {
                                    const productsData = details.map(d => {
                                        const productData = {
                                            id: d.product?.id,
                                            name: d.product?.Product?.translations?.[0]?.name || d.name || 'Product',
                                            image: d.product?.Product?.Imagesproducts?.[0]?.url || d.image || '',
                                            orderId: order.id,
                                            quantity: d.quantity || d.numberOfItems || 1
                                        };
                                        console.log('Product data:', productData);
                                        return productData;
                                    });
                                    console.log('All products:', productsData);
                                    const productsJson = encodeURIComponent(JSON.stringify(productsData));
                                    router.push(`/feedback?products=${productsJson}`);
                                }} style={{ flex: 1 }} />
                            </ThemedView>
                        ) : null}
                        {(rawStatusCode === 0 || getOrderStatusText(order) === t('orders.status.pending')) ? (
                            <ThemedView style={{ paddingHorizontal: 12, justifyContent: 'flex-end', gap: 12 }}>
                                <FullButton text={t('order.cancel')} onPress={handleCancelOrder} style={{ flex: 1 }} />
                            </ThemedView>
                        ) : null}
                    </>
                )}
            </ScrollView >
        </ThemedView >
    )
}

export default OrderDetailScreen;

const styles = StyleSheet.create({
    container: {
        height: '100%',
        width: '100%',
        padding: 15,
        paddingTop: 50,
        position: 'relative',
    },
    statusContainer: {
        flexDirection: 'row',
        borderRadius: 8,
        justifyContent: 'space-between',
        width: 'auto',
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
    statusBar: {
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    content: {
        flex: 1,
    },
    fieldGroup: {
        marginTop: 16,
    },
    errorText: {
        marginTop: 8,
        fontSize: 13,
    },
    input: {
        fontSize: 16,
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 15,
        marginTop: 8,
    },
    contentContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        marginBottom: 10,
    }
});