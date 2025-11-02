import { Colors } from "@/constants/theme";
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Image } from "expo-image";
import { FC, useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
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
    type?: 'editable' | 'review';
};

const OrderDetailItem: FC<CartItemProps> = ({ product, checked = false, numberOfItems, onToggle, onChangeQuantity, onDeleteRequest, type }) => {
    const schemeRaw = useColorScheme();
    const scheme: keyof typeof Colors = (schemeRaw ?? 'light') as keyof typeof Colors;
    const tint: string = Colors[scheme].tint;
    const textColor: string = Colors[scheme].text;
    const secondaryText: string = Colors[scheme].secondaryText;
    const borderColor: string = Colors[scheme].border;

    // Local checkbox state synced with prop
    const [localChecked, setLocalChecked] = useState<boolean>(checked);
    useEffect(() => setLocalChecked(checked), [checked]);

    // Local mode that can switch to 'editable' when user taps in review
    const [mode, setMode] = useState<'editable' | 'review'>(type ?? 'editable');
    useEffect(() => setMode(type ?? 'editable'), [type]);

    const currentPrice: number = (product.price ?? 0) * (1 - (product.discount ?? 0) / 100);

    // Local quantity synced with prop
    const [quantity, setQuantity] = useState<number>(numberOfItems ?? 1);
    useEffect(() => setQuantity(numberOfItems ?? 1), [numberOfItems]);

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
                        <ThemedText style={{ fontSize: 16, fontWeight: '600', color: textColor }}>{product.name}</ThemedText>
                        <ThemedText style={{ marginTop: 4, color: tint }}>
                            {currentPrice.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                        </ThemedText>
                        {typeof product.discount === 'number' && product.discount > 0 ? (
                            <ThemedText type="default" style={{ fontSize: 13, marginTop: 4, color: secondaryText, textDecorationLine: 'line-through' }}>
                                {product.price?.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                            </ThemedText>
                        ) : null}
                    </ThemedView>
                    {mode !== 'review' && (
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
                    )}
                </ThemedView>

                <ThemedView style={styles.action}>
                    <ThemedView style={[styles.numberOfItems, { borderColor: borderColor }]}>
                        <Pressable style={styles.iconBtn} onPress={mode === 'review' ? undefined : handleDec}>
                            <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                <Path d="M18 12.75H6C5.59 12.75 5.25 12.41 5.25 12C5.25 11.59 5.59 11.25 6 11.25H18C18.41 11.25 18.75 11.59 18.75 12C18.75 12.41 18.41 12.75 18 12.75Z" fill={secondaryText} />
                            </Svg>
                        </Pressable>
                        <ThemedText style={{ textAlign: 'center', marginVertical: 4 }}>{quantity}</ThemedText>
                        <Pressable style={styles.iconBtn} onPress={mode === 'review' ? undefined : handleInc}>
                            <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                <Path d="M18 12C18 12.41 17.66 12.75 17.25 12.75H6C5.59 12.75 5.25 12.41 5.25 12C5.25 11.59 5.59 11.25 6 11.25H17.25C17.66 11.25 18 11.59 18 12Z" fill={secondaryText} />
                                <Path d="M12 18C11.59 18 11.25 17.66 11.25 17.25V6C11.25 5.59 11.59 5.25 12 5.25C12.41 5.25 12.75 5.59 12.75 6V17.25C12.75 17.66 12.41 18 12 18Z" fill={secondaryText} />
                            </Svg>
                        </Pressable>
                    </ThemedView>

                </ThemedView>
            </ThemedView>
        </ThemedView >
    );
}

export default OrderDetailItem;


const styles = StyleSheet.create({
    item: {
        width: '100%',
        height: 150,
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        marginBottom: 20,
    },
    image: {
        width: 120,
        height: 140,
        marginRight: 12,
        borderRadius: 19,
    },
    numberOfItems: {
        borderRadius: 8,
        borderWidth: 1,
        textAlign: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        gap: 2,
        width: 'auto',
        paddingHorizontal: 4,
        paddingVertical: 2,
        alignSelf: 'flex-start',
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
        width: 28,
        height: 28,
        alignItems: 'center',
        justifyContent: 'center',
    }
});