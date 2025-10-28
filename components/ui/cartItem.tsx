import { Colors } from "@/constants/theme";
import { Image } from "expo-image";
import { FC, useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, useColorScheme, View } from "react-native";
import Svg, { Path } from "react-native-svg";
import { ThemedText } from "../themed-text";
import { ThemedView } from "../themed-view";

type Product = {
    id: string;
    name?: string;
    price?: number;
    image?: any;
    discount?: number;
}
type CartItemProps = {
    product: Product;
    checked?: boolean;
    numberOfItems?: number;
    onToggle?: (id: string) => void;
    onChangeQuantity?: (id: string, quantity: number) => void;
    onDeleteRequest?: (id: string) => void;
};

const CartItem: FC<CartItemProps> = ({ product, checked = false, numberOfItems, onToggle, onChangeQuantity, onDeleteRequest }) => {
    const schemeRaw = useColorScheme();
    const scheme: keyof typeof Colors = (schemeRaw ?? 'light') as keyof typeof Colors;
    const tint: string = Colors[scheme].tint;
    const discountColor: string = Colors[scheme].icon;
    const [localChecked, setLocalChecked] = useState<boolean>(checked);
    useEffect(() => {
        setLocalChecked(checked);
    }, [checked]);
    const currentPrice: number = (product.price ?? 0) * (1 - (product.discount ?? 0) / 100);
    // Local quantity state (optimistic). Sync when prop changes.
    const [quantity, setQuantity] = useState<number>(numberOfItems ?? 1);
    useEffect(() => {
        setQuantity(numberOfItems ?? 1);
    }, [numberOfItems]);
    const handleToggle = () => {
        setLocalChecked((v) => !v);
        onToggle?.(product.id);
    };

    const handleInc = () => {
        setQuantity((q) => {
            const nq = q + 1;
            onChangeQuantity?.(product.id, nq);
            return nq;
        });
    };

    const handleDec = () => {
        // If quantity is 1, request parent to confirm removal via modal
        if (quantity <= 1) {
            onDeleteRequest?.(product.id);
            return;
        }

        setQuantity((q) => {
            const nq = Math.max(1, q - 1);
            onChangeQuantity?.(product.id, nq);
            return nq;
        });
    };

    return (
        <ThemedView style={styles.item}>
            <Image source={product.image} style={styles.image} />
            <ThemedView style={styles.contentContainer}>
                <ThemedView style={styles.info}>
                    <ThemedView style={styles.content}>
                        <Text style={{ fontSize: 16, fontWeight: '600' }}>{product.name}</Text>
                        <Text style={{ marginTop: 4, color: tint }}>{currentPrice.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</Text>
                        {typeof product.discount === 'number' && product.discount > 0 ? (
                            <ThemedText type="default" style={{ fontSize: 13, marginTop: 4, color: discountColor, textDecorationLine: 'line-through' }}>{product.price?.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</ThemedText>
                        ) : null}
                    </ThemedView>
                    <ThemedView style={styles.iconBtn}>
                        <Pressable onPress={handleToggle} style={styles.checkbox} accessibilityRole="checkbox" accessibilityState={{ checked: !!localChecked }}>
                            {localChecked ? (
                                <View style={[styles.checkInner, { backgroundColor: tint }]}>
                                    <Text style={styles.checkMark}>✓</Text>
                                </View>
                            ) : (
                                <View style={styles.checkInner} />
                            )}
                        </Pressable>
                    </ThemedView>
                </ThemedView>
                <ThemedView style={styles.action}>
                    <ThemedView style={styles.numberOfItems}>
                        <Pressable style={styles.iconBtn} onPress={handleDec}>
                            <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                <Path d="M18 12.75H6C5.59 12.75 5.25 12.41 5.25 12C5.25 11.59 5.59 11.25 6 11.25H18C18.41 11.25 18.75 11.59 18.75 12C18.75 12.41 18.41 12.75 18 12.75Z" fill={scheme === "light" ? "#000" : "#fff"} />
                            </Svg>
                        </Pressable>
                        <ThemedText style={{ textAlign: 'center', marginVertical: 4 }}>{quantity}</ThemedText>
                        <Pressable style={styles.iconBtn} onPress={handleInc}>
                            <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                <Path d="M18 12C18 12.41 17.66 12.75 17.25 12.75H6C5.59 12.75 5.25 12.41 5.25 12C5.25 11.59 5.59 11.25 6 11.25H17.25C17.66 11.25 18 11.59 18 12Z" fill={scheme === "light" ? "#000" : "#fff"} />
                                <Path d="M12 18C11.59 18 11.25 17.66 11.25 17.25V6C11.25 5.59 11.59 5.25 12 5.25C12.41 5.25 12.75 5.59 12.75 6V17.25C12.75 17.66 12.41 18 12 18Z" fill={scheme === "light" ? "#000" : "#fff"} />
                            </Svg>
                        </Pressable>
                    </ThemedView>
                    <Pressable style={styles.iconBtn}
                        onPress={() => {
                            onDeleteRequest?.(product.id);
                        }}
                    >
                        <Svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                            <Path d="M20.9997 6.72998C20.9797 6.72998 20.9497 6.72998 20.9197 6.72998C15.6297 6.19998 10.3497 5.99998 5.11967 6.52998L3.07967 6.72998C2.65967 6.76998 2.28967 6.46998 2.24967 6.04998C2.20967 5.62998 2.50967 5.26998 2.91967 5.22998L4.95967 5.02998C10.2797 4.48998 15.6697 4.69998 21.0697 5.22998C21.4797 5.26998 21.7797 5.63998 21.7397 6.04998C21.7097 6.43998 21.3797 6.72998 20.9997 6.72998Z" fill={tint} />
                            <Path d="M8.49977 5.72C8.45977 5.72 8.41977 5.72 8.36977 5.71C7.96977 5.64 7.68977 5.25 7.75977 4.85L7.97977 3.54C8.13977 2.58 8.35977 1.25 10.6898 1.25H13.3098C15.6498 1.25 15.8698 2.63 16.0198 3.55L16.2398 4.85C16.3098 5.26 16.0298 5.65 15.6298 5.71C15.2198 5.78 14.8298 5.5 14.7698 5.1L14.5498 3.8C14.4098 2.93 14.3798 2.76 13.3198 2.76H10.6998C9.63977 2.76 9.61977 2.9 9.46977 3.79L9.23977 5.09C9.17977 5.46 8.85977 5.72 8.49977 5.72Z" fill={tint} />
                            <Path d="M15.2104 22.7501H8.79039C5.30039 22.7501 5.16039 20.8201 5.05039 19.2601L4.40039 9.19007C4.37039 8.78007 4.69039 8.42008 5.10039 8.39008C5.52039 8.37008 5.87039 8.68008 5.90039 9.09008L6.55039 19.1601C6.66039 20.6801 6.70039 21.2501 8.79039 21.2501H15.2104C17.3104 21.2501 17.3504 20.6801 17.4504 19.1601L18.1004 9.09008C18.1304 8.68008 18.4904 8.37008 18.9004 8.39008C19.3104 8.42008 19.6304 8.77007 19.6004 9.19007L18.9504 19.2601C18.8404 20.8201 18.7004 22.7501 15.2104 22.7501Z" fill={tint} />
                            <Path d="M13.6601 17.25H10.3301C9.92008 17.25 9.58008 16.91 9.58008 16.5C9.58008 16.09 9.92008 15.75 10.3301 15.75H13.6601C14.0701 15.75 14.4101 16.09 14.4101 16.5C14.4101 16.91 14.0701 17.25 13.6601 17.25Z" fill={tint} />
                            <Path d="M14.5 13.25H9.5C9.09 13.25 8.75 12.91 8.75 12.5C8.75 12.09 9.09 11.75 9.5 11.75H14.5C14.91 11.75 15.25 12.09 15.25 12.5C15.25 12.91 14.91 13.25 14.5 13.25Z" fill={tint} />
                        </Svg>
                    </Pressable>
                </ThemedView>
            </ThemedView>
        </ThemedView >
    );
}

export default CartItem;


const styles = StyleSheet.create({
    item: {
        width: '100%',
        height: 120,
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        marginBottom: 20,
    },
    image: {
        width: 100,
        height: 100,
    },
    numberOfItems: {
        borderRadius: 8,
        borderColor: '#F4F5FD',
        borderWidth: 1,
        textAlign: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        gap: 2,
    },
    info: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
    },
    checkbox: {
        width: 30,
        height: 30,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ddd',
        alignItems: 'center',
        justifyContent: 'center',
    },
    checkInner: {
        width: 30,
        height: 30,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    checkMark: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '700',
    },
    content: {
        flexDirection: 'column',
        justifyContent: 'center',
        gap: 1,
    },
    contentContainer: {
        width: 'auto',
        flex: 1,
        gap: 12,
    },
    action: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
    },
    iconBtn: {
        width: 34,
        height: 34,
        alignItems: 'center',
        justifyContent: 'center',
    }
});