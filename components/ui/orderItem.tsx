import { Colors } from '@/constants/theme'
import { useColorScheme } from '@/hooks/use-color-scheme'
import { Image } from 'expo-image'
import { router } from 'expo-router'
import React from 'react'
import { Pressable, StyleSheet } from 'react-native'
import Svg, { Path } from 'react-native-svg'
import { ThemedText } from '../themed-text'
import { ThemedView } from '../themed-view'
import BorderButton from './borderbutton'
import FullButton from './fullbutton'

type OrderDetail = {
    productId: string | number
    name: string
    image: any
    discount?: number
    quantity: number
    price: number
}

type Order = {
    id: string | number
    status: string
    details: OrderDetail[]
    updatedAt: string
    discount?: number
}

type Props = {
    order: Order
}

export default function OrderItem({ order }: Props) {
    const schemeRaw = useColorScheme();
    const scheme: keyof typeof Colors = (schemeRaw ?? 'light') as keyof typeof Colors;
    const tint: string = Colors[scheme].tint;
    const textColor: string = Colors[scheme].text;
    const secondaryText: string = Colors[scheme].secondaryText;
    const borderColor: string = Colors[scheme].border;

    const currentPrice: number = (order.details[0].price ?? 0) * (1 - (order.details[0].discount ?? 0) / 100);
    const updatedDate = new Date(order.updatedAt);
    const total = order.details.reduce((sum, item) => {
        const itemPrice = item.price * (1 - (item.discount ?? 0) / 100);
        return sum + itemPrice * item.quantity;
    }, 0) * (1 - (order.discount ?? 0) / 100);

    return (
        <Pressable onPress={() => { router.push(`/order/${order.id}` as any) }}>
            <ThemedView style={[styles.container, { borderColor: borderColor }]}>
                <ThemedView style={styles.statusContainer}>
                    <ThemedText type="default"
                        style={{
                            fontSize: 14, color: "#fff", paddingHorizontal: 8, paddingVertical: 3, borderRadius: 12,
                            backgroundColor: order.status === 'Delivered' ? 'green' : order.status === 'Pending' ? 'orange' : order.status === 'Cancelled' ? 'red' : 'blue'
                        }}>{order.status}</ThemedText>
                    <ThemedText type='default' style={{ fontSize: 16, color: secondaryText }}>{updatedDate.toLocaleDateString('vi-VN')}</ThemedText>
                </ThemedView>
                <ThemedView style={styles.item}>
                    <Image source={order.details[0].image} style={styles.image} />
                    <ThemedView style={styles.contentContainer}>
                        <ThemedView style={styles.info}>
                            <ThemedView style={styles.content}>
                                <ThemedText style={{ fontSize: 16, fontWeight: '600', color: textColor }}>{order.details[0].name}</ThemedText>
                                <ThemedView style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 4 }}>
                                    <ThemedText style={{ marginTop: 4, color: tint }}>
                                        {currentPrice.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                                    </ThemedText>
                                    {typeof order.details[0].discount === 'number' && order.details[0].discount > 0 ? (
                                        <ThemedText type="default" style={{ fontSize: 13, marginTop: 4, color: secondaryText, textDecorationLine: 'line-through' }}>
                                            {order.details[0].price?.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                                        </ThemedText>
                                    ) : null}
                                </ThemedView>
                            </ThemedView>

                        </ThemedView>

                        <ThemedView style={{ gap: 5 }}>
                            <ThemedView style={[styles.numberOfItems, { borderColor: borderColor }]}>
                                <Pressable style={styles.iconBtn} onPress={undefined}>
                                    <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                        <Path d="M18 12.75H6C5.59 12.75 5.25 12.41 5.25 12C5.25 11.59 5.59 11.25 6 11.25H18C18.41 11.25 18.75 11.59 18.75 12C18.75 12.41 18.41 12.75 18 12.75Z" fill={secondaryText} />
                                    </Svg>
                                </Pressable>
                                <ThemedText style={{ textAlign: 'center', marginVertical: 4 }}>{order.details[0].quantity}</ThemedText>
                                <Pressable style={styles.iconBtn} onPress={undefined}>
                                    <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                        <Path d="M18 12C18 12.41 17.66 12.75 17.25 12.75H6C5.59 12.75 5.25 12.41 5.25 12C5.25 11.59 5.59 11.25 6 11.25H17.25C17.66 11.25 18 11.59 18 12Z" fill={secondaryText} />
                                        <Path d="M12 18C11.59 18 11.25 17.66 11.25 17.25V6C11.25 5.59 11.59 5.25 12 5.25C12.41 5.25 12.75 5.59 12.75 6V17.25C12.75 17.66 12.41 18 12 18Z" fill={secondaryText} />
                                    </Svg>
                                </Pressable>
                            </ThemedView>
                            {order.details.length > 1 ? (
                                <ThemedText style={{ fontSize: 12, fontWeight: '600', color: secondaryText }}>+ {order.details.length - 1} products</ThemedText>
                            ) : null}
                            <ThemedView style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                <ThemedText style={{ fontSize: 16, fontWeight: '700', color: textColor }}>Total:</ThemedText>
                                <ThemedText style={{ fontSize: 16, fontWeight: '700', color: textColor }}>{total.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</ThemedText>
                            </ThemedView>
                        </ThemedView>
                    </ThemedView>

                </ThemedView >
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
        width: 'auto',
    },
    item: {
        width: '100%',
        height: 150,
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        marginBottom: 20,
    },
    image: {
        width: 120,
        height: 140,
        marginRight: 12,
        borderRadius: 19,
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
        gap: 1,
    },
    contentContainer: {
        width: 'auto',
        flex: 1,
        gap: 12,
    },
    iconBtn: {
        width: 28,
        height: 28,
        alignItems: 'center',
        justifyContent: 'center',
    }
});
