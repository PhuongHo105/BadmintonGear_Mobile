import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import GoBackButton from '@/components/ui/gobackbutton';
import VoucherItem from '@/components/ui/voucherItem';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { getMyVouchers } from '@/services/promotionService';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, FlatList, RefreshControl, StyleSheet, View } from 'react-native';

const MyVouchersScreen = () => {
    const { t } = useTranslation();
    const scheme = useColorScheme() ?? 'light';
    const [vouchers, setVouchers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchVouchers = async () => {
        try {
            const data = await getMyVouchers();
            setVouchers(data);
        } catch (error) {
            console.error('Error fetching vouchers:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchVouchers();
    }, []);

    const onRefresh = () => {
        setRefreshing(true);
        fetchVouchers();
    };

    const filterVouchers = () => {
        const now = new Date();
        return vouchers.filter(v => {
            const endDate = new Date(v.end);
            console.log(endDate);
            const startDate = new Date(v.start);
            return endDate >= now && startDate <= now && v.max_uses > v.used_count && v.status !== -1;
        });
    };

    const displayedVouchers = filterVouchers();

    return (
        <ThemedView style={styles.container}>
            <View style={styles.header}>
                <GoBackButton />
                <ThemedText type="title" style={styles.headerTitle}>{t('myVouchers.title')}</ThemedText>
            </View>

            {loading ? (
                <View style={styles.center}>
                    <ActivityIndicator size="large" color={Colors[scheme].tint} />
                </View>
            ) : (
                <FlatList
                    data={displayedVouchers}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => <VoucherItem voucher={item} isUsed={false} />}
                    contentContainerStyle={styles.listContent}
                    refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                    ListEmptyComponent={
                        <View style={styles.emptyContainer}>
                            <ThemedText style={styles.emptyText}>
                                {t('myVouchers.noValid')}
                            </ThemedText>
                        </View>
                    }
                />
            )}
        </ThemedView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 50,
        paddingHorizontal: 20,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    headerTitle: {
        fontSize: 20,
        marginLeft: 15,
    },
    tabContainer: {
        flexDirection: 'row',
        borderRadius: 12,
        padding: 4,
        marginBottom: 20,
    },
    tab: {
        flex: 1,
        paddingVertical: 10,
        alignItems: 'center',
        borderRadius: 10,
    },
    activeTab: {
        // Styles for active tab background are handled dynamically
    },
    tabText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#666',
    },
    listContent: {
        paddingBottom: 20,
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyContainer: {
        alignItems: 'center',
        marginTop: 50,
    },
    emptyText: {
        color: '#999',
        fontSize: 16,
    }
});

export default MyVouchersScreen;
