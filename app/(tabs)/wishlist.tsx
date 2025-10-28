import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import BorderButton from "@/components/ui/borderbutton";
import FullButton from "@/components/ui/fullbutton";
import GoBackButton from "@/components/ui/gobackbutton";
import WishlistItem from "@/components/ui/wishlistItem";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { FC, useState } from "react";
import { KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView, StyleSheet, View } from "react-native";

const WishlistScreen: FC = () => {
    const router = useRouter();
    const [wishlistItems, setWishlistItems] = useState([
        { id: '1', name: 'Racket A', price: 120000, image: require('@/assets/images/product1.png'), discount: 10 },
        { id: '2', name: 'Shoe B', price: 80000, image: require('@/assets/images/product1.png'), discount: 5 },
    ]);

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedToRemove, setSelectedToRemove] = useState<string | null>(null);

    const onDeleteRequest = (id: string) => {
        setSelectedToRemove(id);
        setIsModalVisible(true);
    };

    const confirmRemove = () => {
        if (!selectedToRemove) return;
        setWishlistItems(items => items.filter(i => i.id !== selectedToRemove));
        setSelectedToRemove(null);
        setIsModalVisible(false);
    };

    const cancelRemove = () => {
        setSelectedToRemove(null);
        setIsModalVisible(false);
    };

    return wishlistItems.length === 0 ? (
        <ThemedView style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
            <Image source={require('@/assets/images/emptyWishlist.png')} style={{ width: '100%', height: 350 }} />
            <ThemedText type="title" style={{ textAlign: 'center', marginTop: 30, fontSize: 20 }}>Your wishlist is empty</ThemedText>
            <ThemedText type="default" style={{ textAlign: 'center', marginTop: 10, color: '#666666' }}>Tap heart button to start saving your favorite items.</ThemedText>
            <FullButton onPress={() => { router.push('/products') }} text="Explore Products" />
        </ThemedView>
    ) : (
        <View>
            <ThemedView style={styles.container}>
                <ThemedView style={styles.headerContainer}>
                    <GoBackButton />
                    <ThemedText type="title" style={{ fontSize: 20 }}>My Wishlist</ThemedText>
                </ThemedView>
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 24 }}>
                    {wishlistItems.map((item) => (
                        <WishlistItem key={item.id} {...item} onDeleteRequest={onDeleteRequest} />
                    ))}
                </ScrollView>
                <Modal animationType="slide"
                    transparent={true}
                    visible={isModalVisible}
                    onRequestClose={() => {
                        setIsModalVisible(false);
                    }}>
                    <KeyboardAvoidingView
                        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                        style={styles.keyboardAvoid}
                    >
                        <Pressable style={styles.modalOverlay} onPress={cancelRemove} />
                        <View style={styles.modalContent}>
                            <ThemedText style={styles.modalTitle}>Delete product from wishlist</ThemedText>
                            <FullButton onPress={confirmRemove} text="Delete" />
                            <BorderButton onPress={cancelRemove} text="Cancel" />
                        </View>
                    </KeyboardAvoidingView>
                </Modal>
            </ThemedView>
        </View>
    )
}

export default WishlistScreen

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
        alignItems: 'center',
        marginBottom: 20,
        gap: 12,
    },
    keyboardAvoid: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    modalOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: 'white',
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
        marginBottom: 0,
        textAlign: 'left',
    },
})