import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import FullButton from "@/components/ui/fullbutton";
import Header from "@/components/ui/header";
import { IconSymbol } from "@/components/ui/icon-symbol";
import Slider from "@/components/ui/slider";
import { BRAND_OPTIONS, CATEGORY_OPTIONS, PRICE_RANGE, PRICE_STEP, type ProductFilters, formatPrice } from "@/constants/product-data";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Keyboard, KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView, StyleSheet, TextInput } from "react-native";

const SearchScreen: React.FC = () => {
    const router = useRouter();
    const scheme = useColorScheme() ?? 'light';
    const palette = Colors[scheme];
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [value, setValue] = useState('');
    const [draftFilters, setDraftFilters] = useState<ProductFilters>({});
    const [priceInputs, setPriceInputs] = useState<{ min: number; max: number }>(() => ({
        min: PRICE_RANGE.min,
        max: PRICE_RANGE.max,
    }));

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

    const handleApplyFilters = () => {
        const params: Record<string, string> = {};
        const trimmedQuery = value.trim();

        if (trimmedQuery.length > 0) {
            params.searchQuery = trimmedQuery;
        }

        if (typeof draftFilters.category === 'number') {
            params.category = String(draftFilters.category);
        }

        if (draftFilters.brand) {
            params.brand = draftFilters.brand;
        }

        if (typeof draftFilters.minPrice === 'number' && draftFilters.minPrice > PRICE_RANGE.min) {
            params.minPrice = String(draftFilters.minPrice);
        }

        if (typeof draftFilters.maxPrice === 'number' && draftFilters.maxPrice < PRICE_RANGE.max) {
            params.maxPrice = String(draftFilters.maxPrice);
        }

        setIsModalVisible(false);
        Keyboard.dismiss();
        router.push({ pathname: '/productList', params });
    };


    return (
        <ThemedView style={styles.container}>
            <Header mode="search" />
            <ThemedView>
                <ThemedView style={[styles.searchInputContainer, { borderColor: palette.border, backgroundColor: palette.background }]}>
                    <TextInput
                        placeholder="Search..."
                        placeholderTextColor={palette.icon}
                        style={[styles.searchInput, { color: palette.text, backgroundColor: palette.background }]}
                        value={value}
                        onChangeText={setValue}
                        onSubmitEditing={() => {
                            const trimmed = value.trim();
                            Keyboard.dismiss();
                            if (trimmed.length > 0) {
                                router.push({ pathname: '/productList', params: { searchQuery: trimmed } });
                            } else {
                                router.push('/productList');
                            }
                        }}
                    />
                    <Pressable onPress={() => setIsModalVisible(true)}>
                        <IconSymbol name="filter" size={30} color={palette.text} />
                    </Pressable>
                </ThemedView>
                <ScrollView showsVerticalScrollIndicator={false}>
                    {/* Search history */}
                </ScrollView>
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
                                <ThemedText style={styles.rangeLabel}>Tối thiểu: {formatPrice(priceInputs.min)}</ThemedText>
                                <ThemedText style={styles.rangeLabel}>Tối đa: {formatPrice(priceInputs.max)}</ThemedText>
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
                    </ThemedView>
                </KeyboardAvoidingView>
            </Modal>
        </ThemedView>
    )
}

export default SearchScreen;

const styles = StyleSheet.create({
    container: {
        height: '100%',
        width: '100%',
        padding: 15,
        paddingTop: 50,
        position: 'relative',
    },
    searchInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 12,
        paddingHorizontal: 10,
        borderWidth: 1,
        borderRadius: 8,
    },
    searchInput: {
        height: 50,
        fontSize: 16,
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
});