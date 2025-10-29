import { Colors } from '@/constants/theme'
import { useColorScheme } from '@/hooks/use-color-scheme'
import { Image } from 'expo-image'
import { useRouter } from 'expo-router'
import React from 'react'
import { ColorSchemeName, Dimensions, Pressable, StyleSheet } from 'react-native'
import { ThemedText } from '../themed-text'
import { ThemedView } from '../themed-view'

type Product = {
    id: string | number
    name: string
    image: any
    price: number
    discount?: number
}

type Props = {
    product: Product
}

export default function ProductCard({ product }: Props) {
    const currentPrice: number = product.price * (1 - (product.discount ?? 0) / 100);
    const schemeRaw: ColorSchemeName | undefined = useColorScheme()
    const scheme: keyof typeof Colors = (schemeRaw ?? 'light') as keyof typeof Colors
    const tint: string = Colors[scheme].tint
    const discountColor: string = Colors[scheme].icon;
    const borderColor: string = Colors[scheme].border;
    const router = useRouter();
    const windowWidth = Dimensions.get('window').width;
    const horizontalPadding = 15 * 2; // container padding left + right from screen layout
    const gap = 16; // desired gap between columns
    const cardWidth = Math.floor((windowWidth - horizontalPadding - gap) / 2);

    return (
        <Pressable key={product.id} onPress={() => router.push(`/product/${product.id}` as any)} style={[styles.card, { width: cardWidth, borderColor: borderColor }]}>
            <ThemedView style={styles.inner}>
                <ThemedView style={styles.imageWrapper}>
                    <Image source={product.image} style={styles.image} />
                    {typeof product.discount === 'number' && product.discount > 0 ? (
                        <ThemedView style={[styles.badge, { backgroundColor: tint }]}>
                            <ThemedText style={{ color: '#fff', fontSize: 12 }}>{`-${product.discount}%`}</ThemedText>
                        </ThemedView>
                    ) : null}
                </ThemedView>
                <ThemedText type="defaultSemiBold" style={{ fontSize: 14, marginTop: 8 }}>{product.name}</ThemedText>
                <ThemedText type="default" style={{ fontSize: 13, marginTop: 4, color: tint }}>{currentPrice.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</ThemedText>
                {typeof product.discount === 'number' && product.discount > 0 ? (
                    <ThemedText type="default" style={{ fontSize: 13, marginTop: 4, color: discountColor, textDecorationLine: 'line-through' }}>{product.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</ThemedText>
                ) : null}
            </ThemedView>
        </Pressable>
    )
}

const styles = StyleSheet.create({
    card: {
        marginBottom: 16,
        borderRadius: 12,
        borderWidth: 1,
        shadowColor: '#686868ff',
    },
    inner: {
        padding: 8,
        borderRadius: 12,
    },
    image: {
        width: '100%',
        height: 200,
        borderRadius: 13
    }
    ,
    imageWrapper: {
        position: 'relative'
    },
    badge: {
        position: 'absolute',
        top: 8,
        left: 8,
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center'
    }
});
