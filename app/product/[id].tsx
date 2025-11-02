import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import BorderButton from '@/components/ui/borderbutton';
import FullButton from '@/components/ui/fullbutton';
import GoBackButton from '@/components/ui/gobackbutton';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useLocalSearchParams } from 'expo-router';
import React, { useCallback, useState } from 'react';
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

const PRODUCT_MOCK = {
    id: "1",
    name: "Vợt Yonex Astrox 88D",
    price: 3200000,
    discount: 20,
    category: 1,
    brand: "Yonex",
    rating: 4.5,
    reviews: 2495,
    description:
        'Constructed with high-quality silicone material, the Loop Silicone Strong Magnetic Watch ensures a comfortable and secure fit on your wrist. The soft and flexible silicone is gentle on the skin, making it ideal for...',
    images: [
        require("@/assets/images/product1.png"),
        require("@/assets/images/product1.png"),
        require("@/assets/images/product1.png"),
    ],
};

const ProductDetailScreen: React.FC = () => {
    const { id } = useLocalSearchParams<ProductRouteParams>();
    const [quantity, setQuantity] = useState(1);
    const [activeSlide, setActiveSlide] = useState(0);
    const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
    const scheme = useColorScheme() ?? 'light';
    const palette = Colors[scheme];
    const currentPrice: number = (PRODUCT_MOCK.price) * (1 - (PRODUCT_MOCK.discount ?? 0) / 100);
    const product = PRODUCT_MOCK;
    const DESCRIPTION_PREVIEW_LENGTH = 160;
    const isDescriptionLong = product.description.length > DESCRIPTION_PREVIEW_LENGTH;
    const descriptionText = isDescriptionExpanded || !isDescriptionLong
        ? product.description
        : `${product.description.slice(0, DESCRIPTION_PREVIEW_LENGTH).trimEnd()}...`;

    const toggleDescription = () => setIsDescriptionExpanded((prev) => !prev);

    const decreaseQuantity = () => setQuantity((prev) => (prev > 0 ? prev - 1 : 0));
    const increaseQuantity = () => setQuantity((prev) => prev + 1);

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
                <ThemedView style={styles.carouselWrapper}>
                    <ScrollView
                        horizontal
                        pagingEnabled
                        showsHorizontalScrollIndicator={false}
                        onMomentumScrollEnd={handleImageMomentum}
                    >
                        {product.images.map((imageUrl, i) => (
                            <ImageBackground
                                key={i}
                                source={imageUrl}
                                style={[styles.imageBackground, { width }]}
                                resizeMode="cover"
                            />
                        ))}
                    </ScrollView>
                    <ThemedView style={styles.paginationDots}>
                        {product.images.map((_, index) => (
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
                            <ThemedText style={styles.tagText}>Top Rated</ThemedText>
                        </ThemedView>
                        <ThemedView style={[styles.tag, styles.tagFreeShipping]}>
                            <ThemedText style={styles.tagText}>Free Shipping</ThemedText>
                        </ThemedView>
                    </ThemedView>

                    <ThemedView style={styles.titlePriceContainer}>
                        <ThemedText type='title' style={styles.title}>{product.name}</ThemedText>
                        <ThemedView style={styles.priceContainer}>
                            <ThemedText style={[styles.price, { color: palette.text }]}>{currentPrice.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</ThemedText>
                            <ThemedText style={[styles.originalPrice, { color: palette.secondaryText }]}>
                                {product.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                            </ThemedText>
                        </ThemedView>
                    </ThemedView>

                    <ThemedView style={styles.ratingContainer}>
                        {renderStars(product.rating)}
                        <ThemedText style={styles.reviews}>({product.reviews.toLocaleString()} reviews)</ThemedText>
                    </ThemedView>
                    <ThemedView style={{ flexDirection: 'row', marginBottom: 16 }}>
                        <ThemedText type='defaultSemiBold' style={{ fontSize: 18, marginBottom: 10 }}>Brand: </ThemedText>
                        <ThemedText style={{ fontSize: 18, color: palette.text }}>{product.brand}</ThemedText>
                    </ThemedView>
                    <ThemedText style={styles.description}>
                        {descriptionText}
                    </ThemedText>
                    {isDescriptionLong && (
                        <TouchableOpacity onPress={toggleDescription}>
                            <ThemedText style={[styles.readMoreText, { color: palette.tint }]}>
                                {isDescriptionExpanded ? 'Show less' : 'Read more'}
                            </ThemedText>
                        </TouchableOpacity>
                    )}

                    <ThemedView style={styles.quantityContainer}>
                        <ThemedText style={styles.quantityLabel}>Quantity</ThemedText>
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

                    {id && (
                        <ThemedText style={[styles.productId, { color: palette.secondaryText }]}>Product ID: {id}</ThemedText>
                    )}
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
                    onPress={() => { }}
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
