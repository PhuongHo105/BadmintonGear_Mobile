import { ThemedText } from '@/components/themed-text'
import { ThemedView } from '@/components/themed-view'
import BorderButton from '@/components/ui/borderbutton'
import CartItem from '@/components/ui/cartItem'
import FullButton from '@/components/ui/fullbutton'
import GoBackButton from '@/components/ui/gobackbutton'
import { Colors } from '@/constants/theme'
import { useColorScheme } from '@/hooks/use-color-scheme'
import { Image } from 'expo-image'
import { useRouter } from 'expo-router'
import React, { FC, useState } from 'react'
import { KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native'


const CartScreen: FC = () => {
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
    const [cartItems, setCartItems] = useState([
        {
            product: {
                id: '1',
                name: 'Badminton Racket',
                price: 500000,
                image: require('../../assets/images/product1.png'),
                discount: 10,
            },
            numberOfItems: 2,
            checked: false,
        },
        {
            product: {
                id: '2',
                name: 'Shuttlecock',
                price: 100000,
                image: require('../../assets/images/product1.png'),
                discount: 5,
            },
            numberOfItems: 1,
            checked: false,
        },
    ]);

    const recalcTotals = (items: typeof cartItems) => {
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

    return cartItems.length === 0 ? (
        <ThemedView style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
            <Image source={require('@/assets/images/emptyCart.png')} style={{ width: '100%', height: 350 }} />
            <ThemedText type="title" style={{ textAlign: 'center', marginTop: 30, fontSize: 20 }}>Your cart is empty</ThemedText>
            <FullButton onPress={() => { router.push('/productList') }} text="Explore Products" />
        </ThemedView>
    ) : (
        <View>
            <ThemedView style={styles.container}>
                <ThemedView style={styles.headerContainer}>
                    <ThemedView style={styles.leftHeader}>
                        <GoBackButton />
                        <ThemedText type="title" style={{ fontSize: 20 }}>My Cart</ThemedText>
                    </ThemedView>
                    <Pressable onPress={() => setIsModalVisible(true)}>
                        <ThemedText style={{ color: palette.tint }}>Voucher Code</ThemedText>
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
                        <ThemedText type="title" style={{ fontSize: 18 }}>Order Info</ThemedText>
                        <ThemedView style={styles.info}>
                            <ThemedText type="default" style={{ fontSize: 16, color: palette.secondaryText }}>Total: </ThemedText>
                            <ThemedText type="default" style={{ fontSize: 16, color: palette.secondaryText }}>{total.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</ThemedText>
                        </ThemedView>
                        <ThemedView style={styles.info}>
                            <ThemedText type="default" style={{ fontSize: 16, color: palette.secondaryText }}>Shipping cost: </ThemedText>
                            <ThemedText type="default" style={{ fontSize: 16, color: palette.secondaryText }}>{(0).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</ThemedText>
                        </ThemedView>
                        {discount > 0 && (
                            <ThemedView style={styles.info}>
                                <ThemedText type="default" style={{ fontSize: 16, color: palette.secondaryText }}>Discount: </ThemedText>
                                <ThemedText type="default" style={{ fontSize: 16, color: palette.secondaryText }}>- {discount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</ThemedText>
                            </ThemedView>
                        )}
                        <ThemedView style={styles.info}>
                            <ThemedText type="title" style={{ fontSize: 18 }}>Total: </ThemedText>
                            <ThemedText type="title" style={{ fontSize: 18 }}>{currentTotal.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</ThemedText>
                        </ThemedView>
                    </ThemedView>
                    <FullButton onPress={() => { }} text={`Checkout (${numberOfChecked})`} />
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
                        <ThemedText style={styles.modalTitle}>Voucher Code</ThemedText>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter Voucher Code"
                            placeholderTextColor="#999"
                        />
                        <FullButton
                            onPress={() => setIsModalVisible(false)}
                            text="Apply"
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
                        onPress={() => setIsModalVisible(false)}
                    />
                    <ThemedView style={[styles.modalContent, { backgroundColor: palette.modalBackground }]}>
                        <ThemedText style={styles.modalTitle}>Delete</ThemedText>
                        <ThemedText style={{ marginTop: 8 }}>Delete product from cart</ThemedText>
                        <FullButton onPress={confirmDelete} text="Delete" />
                        <BorderButton onPress={cancelDelete} text="Cancel" />
                    </ThemedView>
                </KeyboardAvoidingView>
            </Modal>
        </View>

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