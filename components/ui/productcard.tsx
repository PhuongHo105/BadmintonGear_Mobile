import { Colors } from '@/constants/theme'
import { useColorScheme } from '@/hooks/use-color-scheme'
import { getReviewByProductId } from '@/services/reviewService'
import { Image } from 'expo-image'
import { useRouter } from 'expo-router'
import React, { useEffect, useMemo } from 'react'
import { ColorSchemeName, Dimensions, Pressable, StyleSheet } from 'react-native'
import { ThemedText } from '../themed-text'
import { ThemedView } from '../themed-view'


export default function ProductCard({ product }: { product: any }) {
    const currentPrice: number = product.price * (1 - (product.flashsale?.type === 0 ? product?.flashsale?.value : 0) / 100) - (product.flashsale?.type === 1 ? product?.flashsale?.value : 0);
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
    const imageUrl = product?.Imagesproducts?.[0]?.url
        ? product.Imagesproducts[0].url
        : "@/assets/images/unimage.png";
    const name = product.translations?.[0]?.name || product.name;
    const [reviews, setReviews] = React.useState<any[]>([]);
    const acceptedReviews = useMemo(() => reviews.filter(r => r.status === 'approved'), [reviews]);
    const [rate, setRate] = React.useState<number>(0);

    useEffect(() => {
        async function fetchReviews() {
            try {
                const response = await getReviewByProductId(Number(product.id));
                setReviews(response);
            }
            catch (error) {
                console.error('Error fetching reviews for product', product.id, error);
            }
        }
        fetchReviews();
    }, [product])

    useEffect(() => {
        if (acceptedReviews.length === 0) {
            setRate(0);
            return;
        }
        const total = acceptedReviews.reduce((sum, r) => sum + (r.rating || 0), 0);
        setRate(total / acceptedReviews.length);
    }, [acceptedReviews]);

    return (
        <Pressable key={product.id} onPress={() => router.push(`/product/${product.id}` as any)} style={[styles.card, { width: cardWidth, borderColor: borderColor }]}>
            <ThemedView style={styles.inner}>
                <ThemedView style={styles.imageWrapper}>
                    <Image source={imageUrl ? { uri: imageUrl } : undefined} style={styles.image} />
                    {product.flashsale && product.flashsale.value !== 0 ? (
                        <ThemedView style={[styles.badge, { backgroundColor: tint }]}>
                            <ThemedText style={{ color: '#fff', fontSize: 12 }}>{`-${product.flashsale.value.toLocaleString('vi-VN')}${product.flashsale.type === 0 ? '%' : ''}`}</ThemedText>
                        </ThemedView>
                    ) : null}
                </ThemedView>
                <ThemedText
                    type="defaultSemiBold"
                    numberOfLines={1}
                    ellipsizeMode="tail"
                    style={{ fontSize: 14, marginTop: 8 }}
                >
                    {name}
                </ThemedText>
                <ThemedText type="default" style={{ fontSize: 13, marginTop: 4, color: tint }}>{currentPrice.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</ThemedText>
                {product.flashsale && product.flashsale.value !== 0 ? (
                    <ThemedText type="default" style={{ fontSize: 13, marginTop: 4, color: discountColor, textDecorationLine: 'line-through' }}>{product.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</ThemedText>
                ) : null}
                <ThemedView style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4, gap: 4 }}>
                    <ThemedText type="default" style={{ fontSize: 14, color: '#FFD700' }}>★</ThemedText>
                    <ThemedText type="default" style={{ fontSize: 12, color: tint }}>
                        {rate > 0 ? rate.toFixed(1) : '0.0'} ({reviews.length})
                    </ThemedText>
                </ThemedView>
            </ThemedView>
        </Pressable>
    )
}

const styles = StyleSheet.create({
    card: {
        marginBottom: 16,
        borderRadius: 12,
        borderWidth: 1,
        height: 310,
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
