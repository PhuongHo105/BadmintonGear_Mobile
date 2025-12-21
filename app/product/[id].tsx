import { useToast } from '@/app/providers/ToastProvider';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import BorderButton from '@/components/ui/borderbutton';
import FullButton from '@/components/ui/fullbutton';
import GoBackButton from '@/components/ui/gobackbutton';
import { IconSymbol } from '@/components/ui/icon-symbol';
import ProductCard from '@/components/ui/productcard';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { getCurrentLanguage } from '@/i18n';
import { addCart } from '@/services/cartService';
import { getAllProducts } from '@/services/productService';
import { getReviewByProductId } from '@/services/reviewService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router, useLocalSearchParams } from 'expo-router';
import { jwtDecode } from 'jwt-decode';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    Dimensions,
    ImageBackground,
    NativeScrollEvent,
    NativeSyntheticEvent,
    ScrollView,
    StatusBar,
    StyleSheet,
    TouchableOpacity
} from 'react-native';
import Svg, { Path } from 'react-native-svg';

type ProductRouteParams = {
    id?: string;
};

const { width } = Dimensions.get('window');
const IMAGE_HEIGHT = width * 0.9;

type ApiProduct = {
    id: string | number;
    name?: string;
    price?: number;
    discount?: number;
    brand?: string;
    description?: string;
    Imagesproducts?: { url: string }[];
    images?: any[];
    rating?: number;
    reviews?: number;
    [key: string]: any;
};

const ProductDetailScreen: React.FC = () => {
    const { t } = useTranslation();
    const toast = useToast();
    const language = getCurrentLanguage();
    const [products, setProducts] = useState<any[]>([]);
    const { id } = useLocalSearchParams<ProductRouteParams>();
    const [quantity, setQuantity] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [product, setProduct] = useState<ApiProduct | null>(null);
    const [activeSlide, setActiveSlide] = useState(0);
    const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
    const [visibleReviews, setVisibleReviews] = useState(2);
    const [adding, setAdding] = useState(false);
    const scheme = useColorScheme() ?? 'light';
    const palette = Colors[scheme];
    const currentPrice: number = useMemo(() => {
        const price = Number(product?.price ?? 0);
        const disc = Number(product?.discount ?? 0);
        return price * (1 - disc / 100);
    }, [product?.price, product?.discount]);
    const DESCRIPTION_PREVIEW_LENGTH = 160;
    const description = product?.translations?.[0]?.description ?? '';
    const isDescriptionLong = description.length > DESCRIPTION_PREVIEW_LENGTH;
    const descriptionText = isDescriptionExpanded || !isDescriptionLong
        ? description
        : `${description.slice(0, DESCRIPTION_PREVIEW_LENGTH).trimEnd()}...`;
    const showMoreReviews = () => setVisibleReviews((prev) => prev + 2);
    const showLessReviews = () => setVisibleReviews(2);
    const toggleDescription = () => setIsDescriptionExpanded((prev) => !prev);

    const decreaseQuantity = () => setQuantity((prev) => (prev > 0 ? prev - 1 : 0));
    const increaseQuantity = () => setQuantity((prev) => prev + 1);
    const [reviews, setReviews] = useState<any[]>([]);
    const relatedProducts = useMemo(() => {
        if (!product) return [];
        return products.filter((p) => p.id !== product.id && (p.brand === product.brand || p.categoriesid === product.categoriesid)).slice(0, 10);
    }, [products, product]);
    const rate = useMemo(() => {
        if (reviews.length === 0) return 0;
        const totalRate = reviews.reduce((sum: number, review: any) => sum + (review.rate || 0), 0);
        return totalRate / reviews.length;
    }, [reviews]);

    const handleImageMomentum = useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
        const offsetX = event.nativeEvent.contentOffset.x;
        const nextIndex = Math.round(offsetX / width);
        if (!Number.isNaN(nextIndex)) {
            setActiveSlide(nextIndex);
        }
    }, []);

    const renderStars = (rating: number) => {
        const stars = [];
        for (let i = 1; i <= 5; i += 1) {
            if (i <= rating) {
                stars.push(<IconSymbol key={i} name="star" color="yellow" style={styles.starIcon} />);
            } else if (i - 0.5 <= rating) {
                stars.push(<IconSymbol key={i} name="star-half" color="yellow" style={styles.starIcon} />);
            } else {
                stars.push(<IconSymbol key={i} name="star-border" color="yellow" style={styles.starIcon} />);
            }
        }
        return stars;
    };

    const handleAddToCart = useCallback(async () => {
        if (adding) return;
        if (!product?.id) return;
        try {
            setAdding(true);
            let userId: string | number | undefined;
            const token = await AsyncStorage.getItem('loginToken');
            const userData = jwtDecode(token ?? '') as any;
            if (userData) {
                try {
                    userId = userData.userid;
                } catch { }
            }

            if (!userId) {
                console.warn('No user id found for adding to cart');
                toast.show({ message: t('common.loginRequired') ?? 'Vui lòng đăng nhập để thêm vào giỏ', type: 'info' });
                return;
            }

            const response = await addCart({
                userid: userId,
                productid: product?.id,
                quantity: quantity,
                notes: ''
            });
            console.log('Add to cart response:', response);
            if (response && response.id !== undefined) {
                toast.show({ message: t('product.addedToCart') ?? 'Đã thêm vào giỏ hàng', type: 'success' });
            } else {
                toast.show({ message: t('product.addToCartFailed') ?? 'Thêm vào giỏ hàng thất bại', type: 'error' });
            }
        } catch (e) {
            console.error('Failed to add to cart', e);
            toast.show({ message: t('product.addToCartFailed') ?? 'Thêm vào giỏ hàng thất bại', type: 'error' });
        } finally {
            setAdding(false);
        }
    }, [adding, product?.id, quantity]);

    // Load product from API
    useEffect(() => {
        const load = async () => {
            if (!id) {
                setError('Missing product id');
                setLoading(false);
                return;
            }
            try {
                setLoading(true);
                const data = await getAllProducts(language);
                const reviewsData = await getReviewByProductId(Number(id));
                setProducts(data);
                setProduct(data.find((p) => String(p.id) === String(id)) || null);
                setReviews(reviewsData);
                setError(null);
            } catch (e: any) {
                setError(e?.message || 'Failed to load product');
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [id, language]);

    // Prepare images array (from API Imagesproducts or images); fallback to local asset
    const imagesArray = useMemo(() => {
        const apiImages = product?.Imagesproducts?.map((img) => ({ uri: img.url })) ?? [];
        const legacyImages = (product?.images ?? []).map((img: any) => img);
        const combined = [...apiImages, ...legacyImages];
        if (combined.length === 0) {
            return [require('@/assets/images/product1.png')];
        }
        return combined;
    }, [product?.Imagesproducts, product?.images]);

    return (
        <ThemedView style={styles.container}>
            <StatusBar barStyle="dark-content" />

            <ThemedView style={styles.header}>
                <TouchableOpacity style={[styles.headerButton, { backgroundColor: palette.background }]}>
                    <GoBackButton />
                </TouchableOpacity>
                <TouchableOpacity style={[styles.headerButton, styles.heartButton, { backgroundColor: palette.background }]}>
                    <IconSymbol name="heart" size={24} color={palette.text} />
                </TouchableOpacity>
            </ThemedView>

            <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
                {loading && (
                    <ThemedView style={{ padding: 16 }}>
                        <ThemedText>{t('common.loading')}</ThemedText>
                    </ThemedView>
                )}
                {error && !loading && (
                    <ThemedView style={{ padding: 16 }}>
                        <ThemedText style={{ color: 'red' }}>{error}</ThemedText>
                    </ThemedView>
                )}
                <ThemedView style={styles.carouselWrapper}>
                    <ScrollView
                        horizontal
                        pagingEnabled
                        showsHorizontalScrollIndicator={false}
                        onMomentumScrollEnd={handleImageMomentum}
                    >
                        {imagesArray.map((imageUrl, i) => (
                            <ImageBackground
                                key={i}
                                source={imageUrl}
                                style={[styles.imageBackground, { width }]}
                                resizeMode="cover"
                            />
                        ))}
                    </ScrollView>
                    <ThemedView style={styles.paginationDots}>
                        {imagesArray.map((_, index) => (
                            <ThemedView
                                key={`pagination-dot-${index}`}
                                style={[
                                    styles.dot,
                                    activeSlide === index && styles.activeDot,
                                ]}
                            />
                        ))}
                    </ThemedView>
                </ThemedView>

                <ThemedView style={styles.contentContainer}>
                    <ThemedView style={styles.tagsContainer}>
                        <ThemedView style={[styles.tag, styles.tagTopRated]}>
                            <ThemedText style={styles.tagText}>{t('product.topRated')}</ThemedText>
                        </ThemedView>
                        <ThemedView style={[styles.tag, styles.tagFreeShipping]}>
                            <ThemedText style={styles.tagText}>{t('product.freeShipping')}</ThemedText>
                        </ThemedView>
                    </ThemedView>

                    <ThemedView style={styles.titlePriceContainer}>
                        <ThemedText type='title' style={styles.title}>{product?.translations?.[0]?.name ?? ''}</ThemedText>
                        <ThemedView style={styles.priceContainer}>
                            <ThemedText style={[styles.price, { color: palette.text }]}>{currentPrice.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</ThemedText>
                            {typeof product?.price === 'number' && product?.discount ? (
                                <ThemedText style={[styles.originalPrice, { color: palette.secondaryText }]}>
                                    {Number(product?.price).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                                </ThemedText>
                            ) : null}
                        </ThemedView>
                    </ThemedView>

                    {(typeof product?.rating === 'number' || typeof product?.reviews === 'number') && (
                        <ThemedView style={styles.ratingContainer}>
                            {renderStars(Number(rate ?? 0))}
                            {typeof product?.reviews === 'number' && (
                                <ThemedText style={styles.reviews}>({Number(reviews.length).toLocaleString()} {t('product.reviews')})</ThemedText>
                            )}
                        </ThemedView>
                    )}
                    <ThemedView style={{ flexDirection: 'row', marginBottom: 16 }}>
                        <ThemedText type='defaultSemiBold' style={{ fontSize: 18, marginBottom: 10 }}>{t('product.brand')}: </ThemedText>
                        <ThemedText style={{ fontSize: 18, color: palette.text }}>{product?.brand ?? ''}</ThemedText>

                    </ThemedView>
                    {id && (
                        <ThemedText style={[styles.productId, { color: palette.secondaryText, marginBottom: 10 }]}>{t('product.productId')}: {id}</ThemedText>
                    )}
                    <ThemedText style={styles.description}>
                        {descriptionText}
                    </ThemedText>
                    {isDescriptionLong && (
                        <TouchableOpacity onPress={toggleDescription}>
                            <ThemedText style={[styles.readMoreText, { color: palette.tint }]}>
                                {isDescriptionExpanded ? t('product.showLess') : t('product.readMore')}
                            </ThemedText>
                        </TouchableOpacity>
                    )}

                    <ThemedView style={styles.quantityContainer}>
                        <ThemedText style={styles.quantityLabel}>{t('product.quantity')}</ThemedText>
                        <ThemedView style={[styles.quantitySelector, { borderColor: palette.border }]}>
                            <TouchableOpacity onPress={decreaseQuantity} style={styles.quantityButton}>
                                <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                    <Path d="M18 12.75H6C5.59 12.75 5.25 12.41 5.25 12C5.25 11.59 5.59 11.25 6 11.25H18C18.41 11.25 18.75 11.59 18.75 12C18.75 12.41 18.41 12.75 18 12.75Z" fill={palette.secondaryText} />
                                </Svg>
                            </TouchableOpacity>
                            <ThemedText type='default' style={styles.quantityValue}>{quantity}</ThemedText>
                            <TouchableOpacity onPress={increaseQuantity} style={styles.quantityButton}>
                                <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                    <Path d="M18 12C18 12.41 17.66 12.75 17.25 12.75H6C5.59 12.75 5.25 12.41 5.25 12C5.25 11.59 5.59 11.25 6 11.25H17.25C17.66 11.25 18 11.59 18 12Z" fill={palette.secondaryText} />
                                    <Path d="M12 18C11.59 18 11.25 17.66 11.25 17.25V6C11.25 5.59 11.59 5.25 12 5.25C12.41 5.25 12.75 5.59 12.75 6V17.25C12.75 17.66 12.41 18 12 18Z" fill={palette.secondaryText} />
                                </Svg>
                            </TouchableOpacity>
                        </ThemedView>
                    </ThemedView>

                    <ThemedView style={styles.reviewsContainer}>
                        <ThemedText type='title' style={styles.reviewsTitle}>
                            {reviews.length} {reviews.length === 1 ? t('product.review') : t('product.reviews')}
                        </ThemedText>
                        <ThemedView style={styles.starsContainer}>{renderStars(product?.rating ?? 0)}</ThemedView>

                        {/* Display actual reviews from API */}
                        <ThemedView style={styles.reviewsList}>
                            {reviews.slice(0, visibleReviews).map((review: any, index: number) => (
                                <ThemedView key={review.id || index} style={[styles.reviewItem, { borderBottomColor: palette.border }]}>
                                    <ThemedView style={styles.reviewHeader}>
                                        <ThemedText type='defaultSemiBold'>{review.customerName || review.name || 'Anonymous'}</ThemedText>
                                        <ThemedView style={styles.reviewStars}>
                                            {renderStars(review.rate || 0)}
                                        </ThemedView>
                                    </ThemedView>
                                    <ThemedText style={[styles.reviewComment, { color: palette.secondaryText }]}>
                                        {review.comment || review.text || 'No comment'}
                                    </ThemedText>
                                </ThemedView>
                            ))}
                        </ThemedView>

                        {/* Show More/Less buttons */}
                        <ThemedView style={styles.reviewButtonsContainer}>
                            {visibleReviews < reviews.length && (
                                <TouchableOpacity onPress={showMoreReviews} style={styles.expandReviewsButton}>
                                    <ThemedText style={[styles.expandReviewsText, { color: palette.tint }]}>
                                        {t('product.showMore')}
                                    </ThemedText>
                                </TouchableOpacity>
                            )}
                            {visibleReviews > 2 && (
                                <TouchableOpacity onPress={showLessReviews} style={styles.expandReviewsButton}>
                                    <ThemedText style={[styles.expandReviewsText, { color: palette.tint }]}>
                                        {t('product.showLess')}
                                    </ThemedText>
                                </TouchableOpacity>
                            )}
                        </ThemedView>
                    </ThemedView>

                    <ThemedView style={styles.relatedProductsContainer}>
                        <ThemedText type='title' style={styles.relatedProductsTitle}>{t('product.relatedProducts')}</ThemedText>
                        {relatedProducts.length === 0 && !loading && (
                            <ThemedText style={{ color: palette.secondaryText }}>{t('product.noRelatedProducts')}</ThemedText>
                        )}
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 20 }}>
                            {relatedProducts.map((product) =>
                            (<ThemedView key={product.id} style={{ marginRight: 12 }}>
                                <ProductCard key={product.id} product={product} />
                            </ThemedView>)
                            )}
                        </ScrollView>
                        <FullButton text={t('common.seeAll')} onPress={() => { router.push('/products' as any) }} />
                    </ThemedView>

                </ThemedView>
            </ScrollView>

            <ThemedView
                style={[
                    styles.footer,
                    {
                        borderTopColor: palette.border,
                        backgroundColor: palette.background,
                    },
                ]}
            >
                <BorderButton
                    text='Buy Now'
                    onPress={() => { }}
                    style={[styles.footerButton, styles.footerButtonLeft]}
                />
                <FullButton
                    onPress={handleAddToCart}
                    text="Add to Cart"
                    style={styles.footerButton}
                />
            </ThemedView>
        </ThemedView>
    );
};

export default ProductDetailScreen;

const styles = StyleSheet.create({
    container: {
        height: '100%',
        width: '100%',
        position: 'relative',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingTop: 10,
        position: 'absolute',
        backgroundColor: 'transparent',
        top: 40,
        left: 0,
        right: 0,
        zIndex: 10,
    },
    headerButton: {
        width: 44,
        height: 44,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 22,
    },
    heartButton: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    scrollContainer: {
        flex: 1,
    },
    carouselWrapper: {
        position: 'relative',
    },
    imageBackground: {
        height: IMAGE_HEIGHT,
        justifyContent: 'flex-end',
    },
    paginationDots: {
        position: 'absolute',
        bottom: 28,
        left: 0,
        right: 0,
        backgroundColor: 'transparent',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#ccc',
        marginHorizontal: 4,
    },
    activeDot: {
        backgroundColor: '#888',
    },
    contentContainer: {
        borderTopLeftRadius: 36,
        borderTopRightRadius: 36,
        marginTop: -20,
        padding: 15,
        paddingBottom: 100,
    },
    tagsContainer: {
        flexDirection: 'row',
        marginBottom: 16,
    },
    tag: {
        paddingHorizontal: 12,
        paddingVertical: 5,
        borderRadius: 8,
        marginRight: 8,
    },
    tagText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 12,
    },
    tagTopRated: {
        backgroundColor: '#007AFF',
    },
    tagFreeShipping: {
        backgroundColor: '#34C759',
    },
    titlePriceContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 8,
    },
    title: {
        fontSize: 24,
        flex: 1,
        marginRight: 12,
    },
    priceContainer: {
        alignItems: 'flex-end',
    },
    price: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    originalPrice: {
        fontSize: 16,
        textDecorationLine: 'line-through',
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    starIcon: {
        fontSize: 18,
        color: '#FFCC00',
        marginRight: 2,
    },
    reviews: {
        fontSize: 14,
        color: '#8E8E93',
        marginLeft: 8,
    },
    description: {
        fontSize: 16,
        lineHeight: 24,
        marginBottom: 20,
    },
    readMoreText: {
        fontSize: 15,
        fontWeight: '600',
        marginBottom: 20,
    },
    quantityContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    quantityLabel: {
        fontSize: 18,
        fontWeight: '600',
    },
    quantitySelector: {
        borderWidth: 1,
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 10,
    },
    quantityButton: {
        padding: 12,
    },
    quantityValue: {
        fontSize: 18,
        fontWeight: '600',
        minWidth: 40,
        textAlign: 'center',
    },
    reviewsContainer: {
        marginBottom: 20,
    },
    reviewsTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 12,
    },
    starsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    reviewsList: {
        marginVertical: 16,
    },
    reviewItem: {
        paddingVertical: 12,
        borderBottomWidth: 1,
    },
    reviewHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    reviewStars: {
        flexDirection: 'row',
    },
    reviewComment: {
        fontSize: 14,
        lineHeight: 20,
    },
    expandReviewsButton: {
        paddingVertical: 12,
    },
    expandReviewsText: {
        fontSize: 15,
        fontWeight: '600',
        textAlign: 'center',
    },
    reviewButtonsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 16,
    },
    relatedProductsContainer: {
        marginTop: 24,
    },
    relatedProductsTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    productId: {
        marginTop: 12,
        fontSize: 14,
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingTop: 16,
        paddingBottom: 24,
        borderTopWidth: 1,
    },
    footerButton: {
        flex: 1,
    },
    footerButtonLeft: {
        marginRight: 12,
    },
});
