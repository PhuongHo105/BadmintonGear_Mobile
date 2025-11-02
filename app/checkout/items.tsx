import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import BorderButton from '@/components/ui/borderbutton';
import CartItem from '@/components/ui/cartItem';
import FullButton from '@/components/ui/fullbutton';
import GoBackButton from '@/components/ui/gobackbutton';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import React, { FC } from 'react';
import { KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView, StyleSheet } from 'react-native';



const CheckoutScreen: FC = () => {
    const schemeRaw = useColorScheme();
    const scheme: keyof typeof Colors = (schemeRaw ?? 'light') as keyof typeof Colors;
    const [isDeleteModalVisible, setIsDeleteModalVisible] = React.useState(false);
    const [selectedToRemove, setSelectedToRemove] = React.useState<string | null>(null);
    const handleChangeQuantity = (id: string, quantity: number) => {
        const updatedItems = item.map(ci => {
            if (ci.product.id === id) {
                return { ...ci, numberOfItems: quantity };
            }
            return ci;
        });
        setItem(updatedItems);
    };
    const cancelDelete = () => {
        setSelectedToRemove(null);
        setIsDeleteModalVisible(false);
    };
    const onDeleteRequest = (id: string) => {
        const filteredItems = item.filter(ci => ci.product.id !== id);
        setItem(filteredItems);
    };

    const confirmDelete = () => {
        if (!selectedToRemove) return;
        handleRemove(selectedToRemove);
        setSelectedToRemove(null);
        setIsDeleteModalVisible(false);
    };

    const handleRemove = (id: string) => {
        const updatedItems = item.filter(ci => ci.product.id !== id);
        setItem(updatedItems);
    };

    const [item, setItem] = React.useState([{
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
            price: 19.99,
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
            price: 79.99,
            image: require('@/assets/images/product1.png'),
            discount: 15,
        },
        numberOfItems: 1,
    },
    ]);

    return (
        <ThemedView style={styles.container}>
            <ThemedView style={styles.headerContainer}>
                <ThemedView style={styles.leftHeader}>
                    <GoBackButton />
                    <ThemedText type="title" style={{ fontSize: 20 }}>Item</ThemedText>
                </ThemedView>
            </ThemedView>
            <ScrollView showsVerticalScrollIndicator={false}>
                {item.map((i) => (
                    <CartItem
                        key={i.id}
                        type='review'
                        product={i.product}
                        numberOfItems={i.numberOfItems}
                        onChangeQuantity={handleChangeQuantity}
                        onDeleteRequest={onDeleteRequest}
                    />
                ))}
            </ScrollView>
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
                        style={[styles.modalOverlay, { backgroundColor: Colors[scheme].modalOverlay }]}
                        onPress={() => setIsDeleteModalVisible(false)}
                    />
                    <ThemedView style={[styles.modalContent, { backgroundColor: Colors[scheme].modalBackground }]}>
                        <ThemedText style={styles.modalTitle}>Delete</ThemedText>
                        <ThemedText style={{ marginTop: 8 }}>Delete product from cart</ThemedText>
                        <FullButton onPress={confirmDelete} text="Delete" />
                        <BorderButton onPress={cancelDelete} text="Cancel" />
                    </ThemedView>
                </KeyboardAvoidingView>
            </Modal>
        </ThemedView>
    )
}

export default CheckoutScreen;

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
    content: {
        flex: 1,
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
});