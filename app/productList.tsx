import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import BorderButton from '@/components/ui/borderbutton';
import FullButton from '@/components/ui/fullbutton';
import GoBackButton from '@/components/ui/gobackbutton';
import { IconSymbol } from '@/components/ui/icon-symbol';
import ProductCard from '@/components/ui/productcard';
import Slider from '@/components/ui/slider';
import {
    BRAND_OPTIONS,
    CATEGORY_LABEL_MAP,
    CATEGORY_OPTIONS,
    PRICE_RANGE,
    PRICE_STEP,
    PRODUCT_DATA,
    type ProductFilters,
    formatPrice,
} from '@/constants/product-data';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import { Keyboard, KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView, StyleSheet, TextInput } from 'react-native';

type ProductsScreenProps = {
    filters?: ProductFilters;
};

type ProductListRouteParams = Partial<Record<keyof ProductFilters, string | string[]>>;

const ProductsScreen: React.FC<ProductsScreenProps> = ({ filters }) => {
    const scheme = useColorScheme() ?? 'light';
    const palette = Colors[scheme];
    const params = useLocalSearchParams<ProductListRouteParams>();
    const [searchMode, setSearchMode] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);

    const normalizeParam = (value?: string | string[]) => (Array.isArray(value) ? value[0] : value);

    const routeFilters = useMemo<ProductFilters>(() => {
        const next: ProductFilters = {};

        const category = normalizeParam(params.category);
        const brand = normalizeParam(params.brand);
        const searchQuery = normalizeParam(params.searchQuery);
        const minPrice = normalizeParam(params.minPrice);
        const maxPrice = normalizeParam(params.maxPrice);

        if (category !== undefined) {
            const parsedCategory = Number(category);
            if (!Number.isNaN(parsedCategory)) {
                next.category = parsedCategory;
            }
        }
        if (brand) {
            next.brand = brand;
        }
        if (typeof searchQuery === 'string') {
            next.searchQuery = searchQuery;
        }
        if (minPrice) {
            const parsed = Number(minPrice);
            if (!Number.isNaN(parsed)) {
                next.minPrice = parsed;
            }
        }
        if (maxPrice) {
            const parsed = Number(maxPrice);
            if (!Number.isNaN(parsed)) {
                next.maxPrice = parsed;
            }
        }

        return next;
    }, [params.brand, params.category, params.maxPrice, params.minPrice, params.searchQuery]);

    const mergedFilters = useMemo<ProductFilters>(() => {
        return { ...routeFilters, ...(filters ?? {}) };
    }, [filters, routeFilters]);

    const [draftFilters, setDraftFilters] = useState<ProductFilters>(() => mergedFilters);
    const [appliedFilters, setAppliedFilters] = useState<ProductFilters>(() => mergedFilters);
    const [priceInputs, setPriceInputs] = useState<{ min: number; max: number }>(() => ({
        min: mergedFilters.minPrice ?? PRICE_RANGE.min,
        max: mergedFilters.maxPrice ?? PRICE_RANGE.max,
    }));

    useEffect(() => {
        setDraftFilters(mergedFilters);
        setAppliedFilters(mergedFilters);
        setPriceInputs({
            min: mergedFilters.minPrice ?? PRICE_RANGE.min,
            max: mergedFilters.maxPrice ?? PRICE_RANGE.max,
        });
    }, [mergedFilters]);

    const products = useMemo(() => {
        const query = appliedFilters.searchQuery?.trim().toLowerCase();

        return PRODUCT_DATA.filter((product) => {
            const matchesCategory = appliedFilters.category ? product.category === appliedFilters.category : true;
            const matchesBrand = appliedFilters.brand ? product.brand === appliedFilters.brand : true;
            const matchesMinPrice = typeof appliedFilters.minPrice === 'number' ? product.price >= appliedFilters.minPrice : true;
            const matchesMaxPrice = typeof appliedFilters.maxPrice === 'number' ? product.price <= appliedFilters.maxPrice : true;
            const matchesQuery = query ? product.name.toLowerCase().includes(query) : true;

            return matchesCategory && matchesBrand && matchesMinPrice && matchesMaxPrice && matchesQuery;
        });
    }, [appliedFilters]);

    const title = useMemo(() => {
        const trimmedQuery = appliedFilters.searchQuery?.trim();
        if (trimmedQuery && trimmedQuery.length > 0) {
            return trimmedQuery;
        }

        if (typeof appliedFilters.category === 'number') {
            const categoryLabel = CATEGORY_LABEL_MAP[appliedFilters.category];
            if (categoryLabel) {
                return categoryLabel;
            }
        }

        return 'All';
    }, [appliedFilters.category, appliedFilters.searchQuery]);

    const handleSearchChange = (value: string) => {
        if (value.length === 0 || value.trim().length > 0) {
            setDraftFilters((prev) => ({ ...prev, searchQuery: value }));
        }
    };

    const handleSearchSubmit = () => {
        setDraftFilters((prev) => {
            const raw = prev.searchQuery ?? '';
            const trimmed = raw.trim();

            const next: ProductFilters = { ...prev };

            if (trimmed.length === 0) {
                delete next.searchQuery;
            } else {
                next.searchQuery = trimmed;
            }

            setAppliedFilters(next);
            return next;
        });

        Keyboard.dismiss();
    };

    const handleCategoryPress = (value?: number) => {
        setDraftFilters((prev) => {
            const next: ProductFilters = { ...prev };
            if (value === undefined || prev.category === value) {
                delete next.category;
            } else {
                next.category = value;
            }
            return next;
        });
    };

    const handleBrandPress = (value?: string) => {
        setDraftFilters((prev) => {
            const next: ProductFilters = { ...prev };
            if (value === undefined || prev.brand === value) {
                delete next.brand;
            } else {
                next.brand = value;
            }
            return next;
        });
    };

    const updatePriceDraft = (minValue: number, maxValue: number) => {
        setDraftFilters((prev) => {
            const next: ProductFilters = { ...prev };
            if (minValue <= PRICE_RANGE.min) {
                delete next.minPrice;
            } else {
                next.minPrice = minValue;
            }

            if (maxValue >= PRICE_RANGE.max) {
                delete next.maxPrice;
            } else {
                next.maxPrice = maxValue;
            }

            return next;
        });
    };

    const handlePriceChange = (field: 'min' | 'max') => (value: number) => {
        const snapped = Math.round(value / PRICE_STEP) * PRICE_STEP;

        setPriceInputs((prev) => {
            let nextMin = prev.min;
            let nextMax = prev.max;

            if (field === 'min') {
                nextMin = Math.min(snapped, prev.max);
                if (nextMin > nextMax) {
                    nextMax = nextMin;
                }
            } else {
                nextMax = Math.max(snapped, prev.min);
                if (nextMax < nextMin) {
                    nextMin = nextMax;
                }
            }

            updatePriceDraft(nextMin, nextMax);
            return { min: nextMin, max: nextMax };
        });
    };

    const handleApplyFilters = () => {
        setAppliedFilters(draftFilters);
        setIsModalVisible(false);
    }

    const handleClearFilters = () => {
        setDraftFilters({});
        setAppliedFilters({});
        setPriceInputs({ min: PRICE_RANGE.min, max: PRICE_RANGE.max });
        setIsModalVisible(false);
        setSearchMode(false);
        Keyboard.dismiss();
    };

    const renderChip = <T extends string | number>(
        options: { label: string; value?: T }[],
        activeValue: T | undefined,
        onPress: (value?: T) => void,
    ) =>
        options.map((option) => {
            const isActive = option.value === undefined ? activeValue === undefined : option.value === activeValue;
            return (
                <Pressable
                    key={option.label}
                    onPress={() => onPress(option.value)}
                    style={({ pressed }) => [
                        styles.chip,
                        {
                            borderColor: palette.border,
                            backgroundColor: isActive ? palette.tint : 'transparent',
                            opacity: pressed ? 0.85 : 1,
                        },
                    ]}
                >
                    <ThemedText style={[styles.chipLabel, { color: isActive ? palette.background : palette.text }]}>
                        {option.label}
                    </ThemedText>
                </Pressable>
            );
        });

    return (
        <ThemedView style={styles.container}>
            <ThemedView style={styles.headerContainer}>
                <ThemedView style={styles.leftHeader}>
                    <GoBackButton />
                    <ThemedText type="title" style={{ fontSize: 20 }}>{title}</ThemedText>
                </ThemedView>
                <ThemedView style={styles.rightHeader}>
                    <Pressable onPress={() => setIsModalVisible(true)}>
                        <IconSymbol name="filter" size={30} color={palette.text} />
                    </Pressable>
                    {!searchMode && (
                        <Pressable onPress={() => setSearchMode((prev) => !prev)}>
                            <IconSymbol name="search.fill" size={30} color={palette.text} />
                        </Pressable>
                    )}
                    {searchMode && (
                        <Pressable onPress={() => setSearchMode(false)}>
                            <IconSymbol name="close" size={30} color={palette.text} />
                        </Pressable>
                    )}
                </ThemedView>
            </ThemedView>
            <ScrollView showsVerticalScrollIndicator={false} >
                <ThemedView style={styles.filterSection}>
                    {searchMode && (
                        <TextInput
                            placeholder="Search"
                            placeholderTextColor={palette.secondaryText}
                            value={draftFilters.searchQuery ?? ''}
                            onChangeText={handleSearchChange}
                            onSubmitEditing={handleSearchSubmit}
                            returnKeyType="search"
                            style={[styles.searchInput, { borderColor: palette.border, color: palette.text }]}
                        />
                    )}

                </ThemedView>
                <ThemedView style={styles.grid}>
                    {products.length === 0 && (<ThemedText style={{ color: palette.text, width: '100%', textAlign: 'center' }}>Không có sản phẩm nào</ThemedText>)}
                    {products.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </ThemedView>
            </ScrollView>
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
                        <ThemedText type="defaultSemiBold" style={styles.sectionLabel}>
                            Category
                        </ThemedText>
                        <ThemedView style={styles.chipGroup}>{renderChip<number>(CATEGORY_OPTIONS, draftFilters.category, handleCategoryPress)}</ThemedView>

                        <ThemedText type="defaultSemiBold" style={styles.sectionLabel}>
                            Brand
                        </ThemedText>
                        <ThemedView style={styles.chipGroup}>{renderChip<string>(BRAND_OPTIONS, draftFilters.brand, handleBrandPress)}</ThemedView>

                        <ThemedText type="defaultSemiBold" style={styles.sectionLabel}>
                            Price Range (VND)
                        </ThemedText>
                        <ThemedView style={styles.priceSection}>
                            <ThemedView style={styles.rangeLabels}>
                                <ThemedText style={styles.rangeLabel}>Min: {formatPrice(priceInputs.min)}</ThemedText>
                                <ThemedText style={styles.rangeLabel}>Max: {formatPrice(priceInputs.max)}</ThemedText>
                            </ThemedView>
                            <ThemedView style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                <ThemedText>Min Price</ThemedText>
                                <Slider
                                    style={styles.slider}
                                    minimumValue={PRICE_RANGE.min}
                                    maximumValue={PRICE_RANGE.max}
                                    value={priceInputs.min}
                                    step={PRICE_STEP}
                                    minimumTrackTintColor={palette.tint}
                                    maximumTrackTintColor={palette.border}
                                    thumbTintColor={palette.tint}
                                    onValueChange={handlePriceChange('min')}
                                />
                            </ThemedView>
                            <ThemedView style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                <ThemedText>Max Price</ThemedText>
                                <Slider
                                    style={styles.slider}
                                    minimumValue={PRICE_RANGE.min}
                                    maximumValue={PRICE_RANGE.max}
                                    value={priceInputs.max}
                                    step={PRICE_STEP}
                                    minimumTrackTintColor={palette.border}
                                    maximumTrackTintColor={palette.tint}
                                    thumbTintColor={palette.tint}
                                    onValueChange={handlePriceChange('max')}
                                />
                            </ThemedView>
                        </ThemedView>
                        <FullButton text="Apply" onPress={handleApplyFilters} />
                        <BorderButton text='Clear' onPress={handleClearFilters} />
                    </ThemedView>
                </KeyboardAvoidingView>
            </Modal>
        </ThemedView>
    );
};

export default ProductsScreen;

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
    rightHeader: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 12,
    },
    heading: {
        fontSize: 20,
        marginBottom: 12,
    },
    filterSection: {
        gap: 12,
        marginBottom: 16,
    },
    searchInput: {
        borderWidth: 1,
        borderRadius: 12,
        paddingHorizontal: 14,
        paddingVertical: 10,
        fontSize: 16,
    },
    sectionLabel: {
        fontSize: 15,
    },
    chipGroup: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    chip: {
        borderWidth: 1,
        borderRadius: 16,
        paddingHorizontal: 12,
        paddingVertical: 6,
    },
    chipLabel: {
        fontSize: 14,
    },
    priceSection: {
        gap: 12,
    },
    rangeLabels: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    rangeLabel: {
        fontSize: 14,
    },
    slider: {
        width: '75%',
        height: 10,
    },
    grid: {
        gap: 10,
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
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
});
