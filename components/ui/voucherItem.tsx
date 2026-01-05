import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Ionicons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, StyleSheet, TouchableOpacity, View } from 'react-native';

interface VoucherItemProps {
    voucher: any;
    isUsed?: boolean;
}

const VoucherItem: React.FC<VoucherItemProps> = ({ voucher, isUsed = false }) => {
    const { t } = useTranslation();
    const theme = useColorScheme() ?? 'light';
    const textColor = Colors[theme].text;
    const secondaryText = Colors[theme].secondaryText;
    const borderColor = Colors[theme].border;
    const backgroundColor = theme === 'dark' ? '#1C1C1EFF' : '#FFFFFF';

    const copyToClipboard = async () => {
        if (isUsed) return;
        await Clipboard.setStringAsync(voucher.code);
        Alert.alert(t('common.success'), t('myVouchers.copySuccess'));
    };

    return (
        <ThemedView style={[styles.container, { backgroundColor, borderRadius: 12, borderColor: borderColor, borderWidth: 1 }]}>
            <View style={styles.leftSection}>
                <View style={[styles.iconContainer, isUsed && styles.usedIconContainer]}>
                    <Ionicons name="ticket-outline" size={24} color={isUsed ? '#999' : '#FF6B00'} />
                </View>
                <View style={styles.content}>
                    <ThemedText style={[styles.title, isUsed && styles.usedText]} numberOfLines={1}>
                        {voucher.description}
                    </ThemedText>
                    <ThemedText style={[styles.code, isUsed && styles.usedText]}>
                        Code: {voucher.code}
                    </ThemedText>
                    <ThemedText style={styles.expiry}>
                        {t('myVouchers.expiry')}: {new Date(voucher.end).toLocaleDateString()}
                    </ThemedText>
                    {voucher.min_order_value > 0 && (
                        <ThemedText style={styles.minOrder}>
                            Min: {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(voucher.min_order_value)}
                        </ThemedText>
                    )}
                </View>
            </View>

            <TouchableOpacity
                style={[styles.copyButton, isUsed && styles.usedButton]}
                onPress={copyToClipboard}
                disabled={isUsed}
            >
                <ThemedText style={[styles.copyButtonText, isUsed && styles.usedButtonText]}>
                    {isUsed ? t('myVouchers.used') : t('myVouchers.use')}
                </ThemedText>
            </TouchableOpacity>
        </ThemedView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        padding: 15,
        borderRadius: 12,
        marginBottom: 12,
        alignItems: 'center',
        justifyContent: 'space-between',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    leftSection: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        marginRight: 10,
    },
    iconContainer: {
        width: 45,
        height: 45,
        borderRadius: 22.5,
        backgroundColor: '#FFF0E6',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    usedIconContainer: {
        backgroundColor: '#F0F0F0',
    },
    content: {
        flex: 1,
    },
    title: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 4,
    },
    code: {
        fontSize: 14,
        fontWeight: '500',
        color: '#666',
        marginBottom: 2,
    },
    expiry: {
        fontSize: 12,
        color: '#999',
    },
    minOrder: {
        fontSize: 12,
        color: '#999',
        fontStyle: 'italic'
    },
    usedText: {
        color: '#999',
    },
    copyButton: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
        backgroundColor: '#FF6B00',
    },
    usedButton: {
        backgroundColor: '#E0E0E0',
    },
    copyButtonText: {
        color: '#FFFFFF',
        fontSize: 12,
        fontWeight: '600',
    },
    usedButtonText: {
        color: '#999',
    },
});

export default VoucherItem;
