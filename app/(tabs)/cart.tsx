import { ThemedText } from '@/components/themed-text'
import { ThemedView } from '@/components/themed-view'
import BorderButton from '@/components/ui/borderbutton'
import CartItem from '@/components/ui/cartItem'
import FullButton from '@/components/ui/fullbutton'
import GoBackButton from '@/components/ui/gobackbutton'
import { Colors } from '@/constants/theme'
import { useColorScheme } from '@/hooks/use-color-scheme'
import { getCartByUserID } from '@/services/cartService'
import { getProductById } from '@/services/productService'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Image } from 'expo-image'
import { useRouter } from 'expo-router'
import React, { FC, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView, StyleSheet, TextInput } from 'react-native'


const CartScreen: FC = () => {
    const { t } = useTranslation();
    const router = useRouter();
    const scheme = useColorScheme() ?? 'light';
    const palette = Colors[scheme];
    const [total, setTotal] = useState(0);
    const [numberOfChecked, setNumberOfChecked] = useState(0);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
    const [selectedToRemove, setSelectedToRemove] = useState<string | null>(null);
    const [discount] = useState(0);
    const [currentTotal, setCurrentTotal] = useState(0);
    type LocalProduct = { id: string; name?: string; price?: number; discount?: number; image?: any };
    type LocalCartItem = { product: LocalProduct; numberOfItems: number; checked: boolean };
    const [cartItems, setCartItems] = useState<LocalCartItem[]>([]);

    // Load cart from API based on stored user id (if available)
    useEffect(() => {
        const load = async () => {
            try {
                let userId: string | number | undefined;
                const userData = await AsyncStorage.getItem('userData');
                if (userData) {
                    try {
                        const parsed = JSON.parse(userData);
                        userId = parsed?.id ?? parsed?._id;
                    } catch { }
                }
                // Optional: try a plain userId key
                if (!userId) {
                    const storedId = await AsyncStorage.getItem('userId');
                    if (storedId) userId = storedId;
                }

                if (!userId) {
                    // No user id available; keep empty cart view
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
                                productData = await getProductById(pid);
                            } catch (e) {
                                console.warn('Failed to fetch product', pid, e);
                            }
                        }
                        const image = productData?.Imagesproducts?.[0]?.url
                            ? { uri: productData.Imagesproducts[0].url }
                            : require('@/assets/images/product1.png');
                        const localProduct: LocalProduct = {
                            id: String(productData?.id ?? pid ?? Math.random().toString(36).slice(2)),
                            name: productData?.name ?? item.name,
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const recalcTotals = (items: LocalCartItem[]) => {
        let newTotal = 0;
        let newNumberOfChecked = 0;
        items.forEach(cartItem => {
            if (cartItem.checked) {
                const itemPrice = (cartItem.product.price ?? 0) * (1 - (cartItem.product.discount ?? 0) / 100);
                newTotal += itemPrice * (cartItem.numberOfItems ?? 1);
                newNumberOfChecked += 1;
            }
        });
        setTotal(newTotal);
        setCurrentTotal(newTotal * (1 - discount / 100));
        setNumberOfChecked(newNumberOfChecked);
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

    const handleRemove = (id: string) => {
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
        router.push('/checkout' as any);
    }

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
                    <Pressable onPress={() => setIsModalVisible(true)}>
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
                            <ThemedText type="default" style={{ fontSize: 16, color: palette.secondaryText }}>{(0).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</ThemedText>
                        </ThemedView>
                        {discount > 0 && (
                            <ThemedView style={styles.info}>
                                <ThemedText type="default" style={{ fontSize: 16, color: palette.secondaryText }}>{t('cart.discount')}: </ThemedText>
                                <ThemedText type="default" style={{ fontSize: 16, color: palette.secondaryText }}>- {discount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</ThemedText>
                            </ThemedView>
                        )}
                        <ThemedView style={styles.info}>
                            <ThemedText type="title" style={{ fontSize: 18 }}>{t('cart.total')}: </ThemedText>
                            <ThemedText type="title" style={{ fontSize: 18 }}>{currentTotal.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</ThemedText>
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
                        <ThemedText style={styles.modalTitle}>{t('cart.voucherCode')}</ThemedText>
                        <TextInput
                            style={styles.input}
                            placeholder={t('cart.enterVoucherCode')}
                            placeholderTextColor="#999"
                        />
                        <FullButton
                            onPress={() => setIsModalVisible(false)}
                            text={t('cart.apply')}
                        />
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
    input: {
        height: 50,
        borderColor: '#e0e0e0',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 16,
        marginBottom: 20,
        fontSize: 16,
    },
})