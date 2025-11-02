import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import BorderButton from '@/components/ui/borderbutton';
import FullButton from '@/components/ui/fullbutton';
import GoBackButton from '@/components/ui/gobackbutton';
import OrderDetailItem from '@/components/ui/orderDetailItem';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { router } from 'expo-router';
import React, { FC, useEffect, useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';


const OrderDetailScreen: FC = () => {
    const schemeRaw = useColorScheme();
    const scheme: keyof typeof Colors = (schemeRaw ?? 'light') as keyof typeof Colors;
    const order = {
        items: [{
            id: '1',
            product: {
                id: '1',
                name: 'Badminton Racket',
                price: 500000,
                image: require('@/assets/images/product1.png'),
                discount: 10,
            },
            numberOfItems: 1,
        },
        {
            id: '2',
            product: {
                id: '2',
                name: 'Shuttlecock Pack',
                price: 150000,
                image: require('@/assets/images/product1.png'),
                discount: 5,
            },
            numberOfItems: 2,
        },
        {
            id: '3',
            product: {
                id: '3',
                name: 'Sports Shoes',
                price: 790000,
                image: require('@/assets/images/product1.png'),
                discount: 15,
            },
            numberOfItems: 1,
        },
        ],
        shippingAddress: {
            fullName: 'John Doe',
            phoneNumber: "123-456-7890",
            detailAddress: '123 Main St',
            district: 'District 1',
            city: 'Hanoi',
            country: 'Viet Nam',
        },
        paymentMethod: 'PayPal',
        shippingCost: 20,
        discount: 15,
        status: 'Delivered',
        updatedAt: '2024-06-15T10:30:00Z',
    }
    const [subtotal, setSubtotal] = useState(0);
    const [total, setTotal] = useState(0);
    useEffect(() => {
        const newSubtotal = order.items.reduce((sum, item) => sum + item.product.price * (1 - item.product.discount / 100) * item.numberOfItems, 0);
        setSubtotal(newSubtotal);
        const total = order.shippingCost + newSubtotal * (1 - order.discount / 100);
        setTotal(total);
    }, [order.items, order.shippingCost, order.discount]);

    const updatedDate = new Date(order.updatedAt);

    return (
        <ThemedView style={styles.container}>
            <ThemedView style={styles.headerContainer}>
                <ThemedView style={styles.leftHeader}>
                    <GoBackButton />
                    <ThemedText type="title" style={{ fontSize: 20 }}>Checkout</ThemedText>
                </ThemedView>
            </ThemedView>
            <ScrollView showsVerticalScrollIndicator={false}>
                <ThemedView style={styles.statusContainer}>
                    <ThemedText type="default"
                        style={{
                            fontSize: 14, color: "#fff", paddingHorizontal: 8, paddingVertical: 3, borderRadius: 12,
                            backgroundColor: order.status === 'Delivered' ? 'green' : order.status === 'Pending' ? 'orange' : order.status === 'Cancelled' ? 'red' : 'blue'
                        }}>{order.status}</ThemedText>
                    <ThemedText type='default' style={{ fontSize: 16, color: Colors[scheme].secondaryText }}>{updatedDate.toLocaleDateString('vi-VN')}</ThemedText>
                </ThemedView>
                <ThemedView style={styles.content}>
                    <ThemedView style={{ justifyContent: 'center', alignItems: 'center', width: '100%', marginBottom: 20 }}>
                        <ThemedText type='title' style={{ fontSize: 20, width: '100%', textAlign: 'left' }}>Item ({order.items.length})</ThemedText>
                        {order.items.map((i) => (
                            <OrderDetailItem
                                key={i.id}
                                type='review'
                                product={i.product}
                                numberOfItems={i.numberOfItems}
                            />
                        ))}
                    </ThemedView>
                    <ThemedView >
                        <ThemedText type='title' style={{ fontSize: 20 }}>Shipping Address</ThemedText>
                        <ThemedView style={styles.contentContainer}>
                            <ThemedText type='default' style={{ fontSize: 16, color: Colors[scheme].secondaryText }}>Full Name</ThemedText>
                            <ThemedText type='default' style={{ fontSize: 16, color: Colors[scheme].secondaryText }}>{order.shippingAddress.fullName}</ThemedText>
                        </ThemedView>
                        <ThemedView style={styles.contentContainer}>
                            <ThemedText type='default' style={{ fontSize: 16, color: Colors[scheme].secondaryText }}>Phone Number</ThemedText>
                            <ThemedText type='default' style={{ fontSize: 16, color: Colors[scheme].secondaryText }}>{order.shippingAddress.phoneNumber}</ThemedText>
                        </ThemedView>
                        <ThemedView style={styles.contentContainer}>
                            <ThemedText type='default' style={{ fontSize: 16, color: Colors[scheme].secondaryText }}>Country</ThemedText>
                            <ThemedText type='default' style={{ fontSize: 16, color: Colors[scheme].secondaryText }}>{order.shippingAddress.country}</ThemedText>
                        </ThemedView>
                        <ThemedView style={styles.contentContainer}>
                            <ThemedText type='default' style={{ fontSize: 16, color: Colors[scheme].secondaryText }}>City</ThemedText>
                            <ThemedText type='default' style={{ fontSize: 16, color: Colors[scheme].secondaryText }}>{order.shippingAddress.city}</ThemedText>
                        </ThemedView>
                        <ThemedView style={styles.contentContainer}>
                            <ThemedText type='default' style={{ fontSize: 16, color: Colors[scheme].secondaryText }}>District</ThemedText>
                            <ThemedText type='default' style={{ fontSize: 16, color: Colors[scheme].secondaryText }}>{order.shippingAddress.district}</ThemedText>
                        </ThemedView>
                        <ThemedView style={styles.contentContainer}>
                            <ThemedText type='default' style={{ fontSize: 16, color: Colors[scheme].secondaryText }}>Street Address</ThemedText>
                            <ThemedText type='default' style={{ fontSize: 16, color: Colors[scheme].secondaryText }}>{order.shippingAddress.detailAddress}</ThemedText>
                        </ThemedView>
                    </ThemedView>
                    <ThemedView >
                        <ThemedText type='title' style={{ fontSize: 20 }}>Order Information</ThemedText>
                        <ThemedView style={styles.contentContainer}>
                            <ThemedText type='default' style={{ fontSize: 16, color: Colors[scheme].secondaryText }}>Subtotal</ThemedText>
                            <ThemedText type='default' style={{ fontSize: 16, color: Colors[scheme].secondaryText }}>{subtotal.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</ThemedText>
                        </ThemedView>
                        <ThemedView style={styles.contentContainer}>
                            <ThemedText type='default' style={{ fontSize: 16, color: Colors[scheme].secondaryText }}>Shipping Cost</ThemedText>
                            <ThemedText type='default' style={{ fontSize: 16, color: Colors[scheme].secondaryText }}>{order.shippingCost.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</ThemedText>
                        </ThemedView>
                        <ThemedView style={styles.contentContainer}>
                            <ThemedText type='default' style={{ fontSize: 16, color: Colors[scheme].secondaryText }}>Discount</ThemedText>
                            <ThemedText type='default' style={{ fontSize: 16, color: Colors[scheme].secondaryText }}>{order.discount} %</ThemedText>
                        </ThemedView>
                        <ThemedView style={styles.contentContainer}>
                            <ThemedText type='default' style={{ fontSize: 18, color: Colors[scheme].text }}>Total</ThemedText>
                            <ThemedText type='default' style={{ fontSize: 18, color: Colors[scheme].text }}>{total.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</ThemedText>
                        </ThemedView>
                    </ThemedView>
                </ThemedView>
                {order.status === 'Delivered' ? (
                    <ThemedView style={{ paddingHorizontal: 12, flexDirection: 'row', gap: 12 }}>
                        <BorderButton text='Buy Again' onPress={() => { }} style={{ flex: 1 }} />
                        <FullButton text='Rate' onPress={() => { router.push('/feedback') }} style={{ flex: 1 }} />
                    </ThemedView>
                ) : null}
                {order.status === 'Pending' ? (
                    <ThemedView style={{ paddingHorizontal: 12, justifyContent: 'flex-end', gap: 12 }}>
                        <FullButton text='Cancel' onPress={() => { }} style={{ flex: 1 }} />
                    </ThemedView>
                ) : null}
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