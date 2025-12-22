import { ThemedText } from '@/components/themed-text'
import { ThemedView } from '@/components/themed-view'
import BorderButton from '@/components/ui/borderbutton'
import CartItem from '@/components/ui/cartItem'
import FullButton from '@/components/ui/fullbutton'
import GoBackButton from '@/components/ui/gobackbutton'
import { Colors } from '@/constants/theme'
import { useColorScheme } from '@/hooks/use-color-scheme'
import { getCurrentLanguage } from '@/i18n'
import { deleteCart, getCartByUserID } from '@/services/cartService'
import { getProductById } from '@/services/productService'
import { getPromotions } from '@/services/promotionService'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Image } from 'expo-image'
import { useRouter } from 'expo-router'
import { jwtDecode } from 'jwt-decode'
import React, { FC, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView, StyleSheet } from 'react-native'
import { useToast } from '../providers/ToastProvider'


const CartScreen: FC = () => {
    const { t } = useTranslation();
    const language = getCurrentLanguage();
    const toast = useToast();
    const router = useRouter();
    const scheme = useColorScheme() ?? 'light';
    const palette = Colors[scheme];
    const [total, setTotal] = useState(0);
    const [numberOfChecked, setNumberOfChecked] = useState(0);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
    const [selectedToRemove, setSelectedToRemove] = useState<string | null>(null);
    const [discountAmount, setDiscountAmount] = useState(0);
    const [selectedPromotionId, setSelectedPromotionId] = useState<string | null>(null);
    const [appliedPromotionId, setAppliedPromotionId] = useState<string | null>(null);
    const [currentTotal, setCurrentTotal] = useState(0);
    type LocalProduct = { id: string; productid: string; name?: string; price?: number; discount?: number; image?: any };
    type LocalCartItem = { product: LocalProduct; numberOfItems: number; checked: boolean };
    type Promotion = {
        code: string;
        id: string;
        title: string;
        description: string;
        type: 'percent' | 'amount';
        value: number;
        minSubtotal?: number;
        maxDiscount?: number;
    };
    const [cartItems, setCartItems] = useState<LocalCartItem[]>([]);
    const [promotions, setPromotions] = useState<Promotion[]>([]);

    const loadPromotions = async () => {
        const res = await getPromotions();
        return res.map((promo: any) => ({
            id: String(promo.id),
            code: promo.code,
            title: promo.description,
            description: promo.description,
            type: Number(promo.type) === 1 ? 'percent' : 'amount',
            value: promo.value,
            minSubtotal: promo.min_order_value,
            maxDiscount: promo.max_value,
        } as Promotion));
    }

    useEffect(() => {
        loadPromotions().then(setPromotions);
    }, [language]);

    function calculateDiscountAmount(subtotal: number, promo?: Promotion) {
        if (!promo || subtotal <= 0) return 0;
        if (promo.minSubtotal && subtotal < promo.minSubtotal) return 0;

        const rawDiscount = promo.type === 'percent'
            ? (subtotal * promo.value) / 100
            : promo.value;
        const cappedDiscount = promo.maxDiscount ? Math.min(rawDiscount, promo.maxDiscount) : rawDiscount;
        return Math.min(cappedDiscount, subtotal);
    }

    function summarizeCart(items: LocalCartItem[]) {
        let subtotal = 0;
        let checkedCount = 0;
        items.forEach(cartItem => {
            if (cartItem.checked) {
                const itemPrice = (cartItem.product.price ?? 0) * (1 - (cartItem.product.discount ?? 0) / 100);
                subtotal += itemPrice * (cartItem.numberOfItems ?? 1);
                checkedCount += 1;
            }
        });
        return { subtotal, checkedCount };
    }

    const selectedPromo = useMemo(() => promotions.find(p => p.id === selectedPromotionId) ?? null, [promotions, selectedPromotionId]);
    const previewValues = useMemo(() => {
        const { subtotal } = summarizeCart(cartItems);
        const previewDiscount = calculateDiscountAmount(subtotal, selectedPromo ?? undefined);
        const previewTotal = Math.max(subtotal - previewDiscount, 0);
        return { subtotal, previewDiscount, previewTotal };
    }, [cartItems, selectedPromo]);

    const formatCurrency = (value: number) => value.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });

    // Load cart from API based on stored user id (if available)
    useEffect(() => {
        const load = async () => {
            try {
                let userId: string | number | undefined;
                const userData = await AsyncStorage.getItem('loginToken');
                const decode = jwtDecode<any>(userData ?? '');
                userId = decode?.id ?? decode?.userid;

                if (!userId) {
                    toast.show({ type: 'error', message: t('cart.pleaseLogin') });
                    return;
                }

                const serverCart = await getCartByUserID(userId);
                const rawItems: any[] = Array.isArray((serverCart as any)?.items)
                    ? (serverCart as any).items
                    : Array.isArray(serverCart)
                        ? (serverCart as any)
                        : [];

                const enriched: LocalCartItem[] = await Promise.all(
                    rawItems.map(async (item: any) => {
                        const pid = item.productId ?? item.productid ?? item.product?.id ?? item.product?.productId;
                        let productData: any = item.product;
                        if (!productData && pid != null) {
                            try {
                                productData = await getProductById(pid, language);
                            } catch (e) {
                                console.warn('Failed to fetch product', pid, e);
                            }
                        }
                        const image = productData?.Imagesproducts?.[0]?.url
                            ? { uri: productData.Imagesproducts[0].url }
                            : require('@/assets/images/product1.png');
                        const localProduct: LocalProduct = {
                            id: String(item?.id),
                            productid: String(productData?.id ?? pid ?? Math.random().toString(36).slice(2)),
                            name: productData?.translations?.[0]?.name ?? item.name,
                            price: productData?.price ?? item.price,
                            discount: productData?.discount ?? item.discount,
                            image,
                        };
                        const qty = Number(item.quantity ?? item.numberOfItems ?? 1) || 1;
                        return { product: localProduct, numberOfItems: qty, checked: false };
                    })
                );

                setCartItems(enriched);
                recalcTotals(enriched as any);
            } catch (error) {
                console.error('Error fetching cart items:', error);
            }
        };
        load();
    }, [language, t, toast]);

    const recalcTotals = (items: LocalCartItem[], promoId: string | null = appliedPromotionId) => {
        const { subtotal, checkedCount } = summarizeCart(items);
        const promo = promotions.find(p => p.id === promoId);
        const computedDiscount = calculateDiscountAmount(subtotal, promo);
        setTotal(subtotal);
        setDiscountAmount(computedDiscount);
        setCurrentTotal(Math.max(subtotal - computedDiscount, 0));
        setNumberOfChecked(checkedCount);
    };

    const handleToggle = (id: string) => {
        const updatedItems = cartItems.map(cartItem => {
            if (cartItem.product.id === id) {
                return { ...cartItem, checked: !cartItem.checked };
            }
            return cartItem;
        });
        setCartItems(updatedItems);
        recalcTotals(updatedItems);
    };

    const handleChangeQuantity = (id: string, quantity: number) => {
        const updatedItems = cartItems.map(ci => {
            if (ci.product.id === id) {
                return { ...ci, numberOfItems: quantity };
            }
            return ci;
        });
        setCartItems(updatedItems);
        recalcTotals(updatedItems);
    };



    const handleRemove = async (id: string) => {
        const result = await deleteCart(Number(id));
        if (result !== 'Cart deleted successfully') {
            toast.show({ type: 'error', message: t('cart.deleteFailed') });
            return;
        }
        toast.show({ type: 'success', message: t('cart.deleteSuccess') });
        const updatedItems = cartItems.filter(ci => ci.product.id !== id);
        setCartItems(updatedItems);
        recalcTotals(updatedItems);
    };

    const onDeleteRequest = (id: string) => {
        setSelectedToRemove(id);
        setIsDeleteModalVisible(true);
    };

    const confirmDelete = () => {
        if (!selectedToRemove) return;
        handleRemove(selectedToRemove);
        setSelectedToRemove(null);
        setIsDeleteModalVisible(false);
    };

    const cancelDelete = () => {
        setSelectedToRemove(null);
        setIsDeleteModalVisible(false);
    };

    const handleCheckout = () => {
        const selected = cartItems
            .filter(ci => ci.checked)
            .map(ci => ({
                productId: ci.product.productid,
                quantity: ci.numberOfItems,
                price: ci.product.price ?? 0,
                name: ci.product.name ?? '',
            }));

        if (selected.length === 0) {
            toast.show({ type: 'error', message: t('cart.selectItemsFirst') });
            return;
        }

        const promo = promotions.find(p => p.id === appliedPromotionId);

        router.push({
            pathname: '/checkout',
            params: {
                items: JSON.stringify(selected),
                promoId: promo?.id ?? '',
                promoCode: promo?.code ?? '',
            },
        } as any);
    }

    const handleApplyVoucher = () => {
        const promo = selectedPromo;
        if (!promo) {
            toast.show({ type: 'error', message: t('cart.promotionInvalid') });
            return;
        }

        const { subtotal } = summarizeCart(cartItems);
        const computedDiscount = calculateDiscountAmount(subtotal, promo);

        if (computedDiscount <= 0) {
            toast.show({ type: 'error', message: t('cart.promotionInvalid') });
            return;
        }
        setAppliedPromotionId(promo.id);
        recalcTotals(cartItems, promo.id);
        setIsModalVisible(false);
        toast.show({ type: 'success', message: t('cart.promotionApplied') });
    };

    return cartItems.length === 0 ? (
        <ThemedView style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
            <Image source={require('@/assets/images/emptyCart.png')} style={{ width: '100%', height: 350 }} />
            <ThemedText type="title" style={{ textAlign: 'center', marginTop: 30, fontSize: 20 }}>{t('cart.empty')}</ThemedText>
            <FullButton onPress={() => { router.push('/productList') }} text={t('cart.explore')} style={{ width: "100%", marginTop: 16 }} />
        </ThemedView>
    ) : (
        <ThemedView>
            <ThemedView style={styles.container}>
                <ThemedView style={styles.headerContainer}>
                    <ThemedView style={styles.leftHeader}>
                        <GoBackButton />
                        <ThemedText type="title" style={{ fontSize: 20 }}>{t('cart.title')}</ThemedText>
                    </ThemedView>
                    <Pressable onPress={() => { setSelectedPromotionId(appliedPromotionId); setIsModalVisible(true); }}>
                        <ThemedText style={{ color: palette.tint }}>{t('cart.voucherCode')}</ThemedText>
                    </Pressable>
                </ThemedView>
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 24 }}>
                    {cartItems.map((item) => (
                        <CartItem
                            key={item.product.id}
                            product={item.product}
                            numberOfItems={item.numberOfItems}
                            checked={item.checked}
                            onToggle={handleToggle}
                            onChangeQuantity={handleChangeQuantity}
                            onDeleteRequest={onDeleteRequest}
                        />
                    ))}
                </ScrollView>
                <ThemedView style={styles.orderinfo}>
                    <ThemedView style={{ gap: 5 }}>
                        <ThemedText type="title" style={{ fontSize: 18 }}>{t('cart.orderInfo')}</ThemedText>
                        <ThemedView style={styles.info}>
                            <ThemedText type="default" style={{ fontSize: 16, color: palette.secondaryText }}>{t('cart.subtotal')}: </ThemedText>
                            <ThemedText type="default" style={{ fontSize: 16, color: palette.secondaryText }}>{total.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</ThemedText>
                        </ThemedView>
                        <ThemedView style={styles.info}>
                            <ThemedText type="default" style={{ fontSize: 16, color: palette.secondaryText }}>{t('cart.shippingCost')}: </ThemedText>
                            <ThemedText type="default" style={{ fontSize: 16, color: palette.secondaryText }}>{formatCurrency(0)}</ThemedText>
                        </ThemedView>
                        {appliedPromotionId && (
                            <ThemedView style={styles.info}>
                                <ThemedText type="default" style={{ fontSize: 16, color: palette.secondaryText }}>{t('cart.appliedPromotion')}: </ThemedText>
                                <ThemedText type="default" style={{ fontSize: 16, color: palette.secondaryText }}>{appliedPromotionId}</ThemedText>
                            </ThemedView>
                        )}
                        {discountAmount > 0 && (
                            <ThemedView style={styles.info}>
                                <ThemedText type="default" style={{ fontSize: 16, color: palette.secondaryText }}>{t('cart.discount')}: </ThemedText>
                                <ThemedText type="default" style={{ fontSize: 16, color: palette.secondaryText }}>- {formatCurrency(discountAmount)}</ThemedText>
                            </ThemedView>
                        )}
                        <ThemedView style={styles.info}>
                            <ThemedText type="title" style={{ fontSize: 18 }}>{t('cart.total')}: </ThemedText>
                            <ThemedText type="title" style={{ fontSize: 18 }}>{formatCurrency(currentTotal)}</ThemedText>
                        </ThemedView>
                    </ThemedView>
                    <FullButton onPress={() => { handleCheckout() }} text={`${t('cart.checkout')} (${numberOfChecked})`} />
                </ThemedView>
            </ThemedView>
            <Modal
                animationType="slide"
                transparent={true}
                visible={isModalVisible}
                onRequestClose={() => {
                    setIsModalVisible(false);
                }}
            >
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={styles.keyboardAvoid}
                >
                    <Pressable
                        style={[styles.modalOverlay, { backgroundColor: palette.modalOverlay }]}
                        onPress={() => setIsModalVisible(false)}
                    />
                    <ThemedView style={[styles.modalContent, { backgroundColor: palette.modalBackground }]}>
                        <ThemedText style={styles.modalTitle}>{t('cart.availablePromotions')}</ThemedText>
                        <ScrollView style={{ maxHeight: 360 }} showsVerticalScrollIndicator={false}>
                            {promotions.length === 0 && (
                                <ThemedText style={{ color: palette.secondaryText }}>{t('cart.noPromotions')}</ThemedText>
                            )}
                            {promotions.map((promo, index) => {
                                const isSelected = promo.id === selectedPromotionId;
                                const isApplied = promo.id === appliedPromotionId;
                                const minSpendText = promo.minSubtotal ? `${t('cart.minSpend')} ${formatCurrency(promo.minSubtotal)}` : undefined;
                                const benefitText = promo.type === 'percent'
                                    ? `-${promo.value}%`
                                    : `-${formatCurrency(promo.value)}`;

                                return (
                                    <Pressable key={`${promo.id}-${index}`} onPress={() => setSelectedPromotionId(promo.id)}>
                                        <ThemedView style={[styles.promotionCard, isSelected ? { borderColor: palette.tint, backgroundColor: '#e8f5e9' } : { borderColor: '#e0e0e0' }]}>
                                            <ThemedView style={styles.promotionHeader}>
                                                <ThemedText type="title" style={{ fontSize: 16 }}>{promo.title}</ThemedText>
                                                <ThemedView style={[styles.badge, isSelected || isApplied ? { backgroundColor: palette.tint } : { backgroundColor: '#f0f0f0' }]}>
                                                    <ThemedText style={[styles.badgeText, isSelected || isApplied ? { color: '#fff' } : { color: '#333' }]}>{benefitText}</ThemedText>
                                                </ThemedView>
                                            </ThemedView>
                                            <ThemedText style={{ color: palette.secondaryText, marginTop: 6 }}>{promo.description}</ThemedText>
                                            {minSpendText && (
                                                <ThemedText style={{ color: palette.secondaryText, marginTop: 4 }}>{minSpendText}</ThemedText>
                                            )}
                                            {isApplied && (
                                                <ThemedText style={{ marginTop: 6, color: palette.tint }}>{t('cart.appliedPromotion')}</ThemedText>
                                            )}
                                            <ThemedView style={styles.radioRow}>
                                                <ThemedView style={[styles.radioOuter, isSelected ? { borderColor: palette.tint } : null]}>
                                                    {isSelected && <ThemedView style={[styles.radioInner, { backgroundColor: palette.tint }]} />}
                                                </ThemedView>
                                                <ThemedText style={{ color: palette.secondaryText }}>{isSelected ? t('cart.selected') : t('cart.select')}</ThemedText>
                                            </ThemedView>
                                        </ThemedView>
                                    </Pressable>
                                );
                            })}
                        </ScrollView>
                        <ThemedView style={{ gap: 6 }}>
                            <ThemedText type="title" style={{ fontSize: 16 }}>{t('cart.orderInfo')}</ThemedText>
                            <ThemedView style={styles.info}>
                                <ThemedText style={{ color: palette.secondaryText }}>{t('cart.subtotal')}</ThemedText>
                                <ThemedText style={{ color: palette.secondaryText }}>{formatCurrency(previewValues.subtotal)}</ThemedText>
                            </ThemedView>
                            <ThemedView style={styles.info}>
                                <ThemedText style={{ color: palette.secondaryText }}>{t('cart.discount')}</ThemedText>
                                <ThemedText style={{ color: palette.secondaryText }}>- {formatCurrency(previewValues.previewDiscount)}</ThemedText>
                            </ThemedView>
                            <ThemedView style={styles.info}>
                                <ThemedText type="title" style={{ fontSize: 16 }}>{t('cart.total')}</ThemedText>
                                <ThemedText type="title" style={{ fontSize: 16 }}>{formatCurrency(previewValues.previewTotal)}</ThemedText>
                            </ThemedView>
                        </ThemedView>
                        <FullButton
                            onPress={() => selectedPromotionId && handleApplyVoucher()}
                            text={t('cart.apply')}
                        />
                        <BorderButton onPress={() => setIsModalVisible(false)} text={t('common.cancel')} />
                    </ThemedView>
                </KeyboardAvoidingView>
            </Modal>

            <Modal animationType="slide"
                transparent={true}
                visible={isDeleteModalVisible}
                onRequestClose={() => {
                    cancelDelete();
                    setIsDeleteModalVisible(false);
                }}>
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={styles.keyboardAvoid}
                >
                    <Pressable
                        style={[styles.modalOverlay, { backgroundColor: palette.modalOverlay }]}
                        onPress={() => setIsDeleteModalVisible(false)}
                    />
                    <ThemedView style={[styles.modalContent, { backgroundColor: palette.modalBackground }]}>
                        <ThemedText style={styles.modalTitle}>{t('cart.delete')}</ThemedText>
                        <ThemedText style={{ marginTop: 8 }}>{t('cart.deleteProductFromCart')}</ThemedText>
                        <FullButton onPress={confirmDelete} text={t('common.delete')} />
                        <BorderButton onPress={cancelDelete} text={t('common.cancel')} />
                    </ThemedView>
                </KeyboardAvoidingView>
            </Modal>
        </ThemedView>

    );
}

export default CartScreen

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
    orderinfo: {
        width: '100%',
        position: 'relative',
        bottom: 0,
        gap: 12,
    },
    info: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    keyboardAvoid: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    modalOverlay: {
        ...StyleSheet.absoluteFillObject,
    },
    modalContent: {
        padding: 22,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 5,
        gap: 12,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 16,
        textAlign: 'left',
    },
    promotionCard: {
        borderWidth: 1,
        borderRadius: 12,
        padding: 14,
        marginBottom: 12,
        gap: 6,
    },
    promotionHeader: {
        backgroundColor: 'transparent',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    badge: {
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 20,
    },
    badgeText: {
        fontWeight: 'bold',
        fontSize: 12,
    },
    radioRow: {
        backgroundColor: 'transparent',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginTop: 10,
    },
    radioOuter: {
        width: 18,
        height: 18,
        borderRadius: 9,
        borderWidth: 2,
        borderColor: '#c0c0c0',
        alignItems: 'center',
        justifyContent: 'center',
    },
    radioInner: {
        width: 10,
        height: 10,
        borderRadius: 5,
    },
})