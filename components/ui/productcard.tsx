import { Colors } from '@/constants/theme'
import { useColorScheme } from '@/hooks/use-color-scheme'
import { getReviewByProductId } from '@/services/reviewService'
import { Image } from 'expo-image'
import { useRouter } from 'expo-router'
import React, { useEffect } from 'react'
import { ColorSchemeName, Dimensions, Pressable, StyleSheet } from 'react-native'
import { ThemedText } from '../themed-text'
import { ThemedView } from '../themed-view'

type Product = {
    id: string | number
    name: string
    Imagesproducts: { url: string }[]
    translations?: {
        name: string,
        description: string
    }[]
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
    const imageUrl = product?.Imagesproducts?.[0]?.url
        ? product.Imagesproducts[0].url
        : "@/assets/images/unimage.png";
    const name = product.translations?.[0]?.name || product.name;
    const [reviews, setReviews] = React.useState<any[]>([]);
    const [rate, setRate] = React.useState<number>(0);

    useEffect(() => {
        async function fetchReviews() {
            try {
                const reponse = await getReviewByProductId(Number(product.id));
                setReviews(reponse);
                // Calculate average rating
                if (reponse && reponse.length > 0) {
                    const totalRate = reponse.reduce((sum: number, review: any) => sum + (review.rate || 0), 0);
                    const avgRate = totalRate / reponse.length;
                    setRate(avgRate);
                } else {
                    setRate(0);
                }
            }
            catch (error) {
                console.error('Error fetching reviews for product', product.id, error);
            }
        }
        fetchReviews();
    }, [product])

    return (
        <Pressable key={product.id} onPress={() => router.push(`/product/${product.id}` as any)} style={[styles.card, { width: cardWidth, borderColor: borderColor }]}>
            <ThemedView style={styles.inner}>
                <ThemedView style={styles.imageWrapper}>
                    <Image source={imageUrl ? { uri: imageUrl } : undefined} style={styles.image} />
                    {typeof product.discount === 'number' && product.discount > 0 ? (
                        <ThemedView style={[styles.badge, { backgroundColor: tint }]}>
                            <ThemedText style={{ color: '#fff', fontSize: 12 }}>{`-${product.discount}%`}</ThemedText>
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
                {typeof product.discount === 'number' && product.discount > 0 ? (
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
