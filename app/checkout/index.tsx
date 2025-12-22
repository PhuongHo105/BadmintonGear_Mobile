import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import FullButton from '@/components/ui/fullbutton';
import GoBackButton from '@/components/ui/gobackbutton';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { router } from 'expo-router';
import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

type ID = string;

type DistrictOption = {
    code: ID;
    name: string;
};

type ProvinceOption = {
    code: ID;
    name: string;
    districts: DistrictOption[];
};

type OpenApiProvince = {
    code: number;
    name: string;
    districts: { code: number; name: string }[];
};

type GithubProvince = {
    Code: string;
    Name: string;
    Districts: { Code: string; Name: string }[];
};

const OPEN_API_URL = 'https://provinces.open-api.vn/api/?depth=2';
const GITHUB_FALLBACK_URL =
    'https://raw.githubusercontent.com/kenzouno1/DiaGioiHanhChinhVN/master/data.json';

const CheckoutScreen: FC = () => {
    const { t } = useTranslation();

    const schemeRaw = useColorScheme();
    const scheme: keyof typeof Colors = (schemeRaw ?? 'light') as keyof typeof Colors;

    const [fullName, setFullName] = React.useState('');
    const [isFullNameFocused, setIsFullNameFocused] = React.useState(false);

    const [phone, setPhone] = React.useState('');
    const [isPhoneFocused, setIsPhoneFocused] = React.useState(false);

    const [selectedCountry, setSelectedCountry] = React.useState('Vietnam');
    const [selectedProvince, setSelectedProvince] = React.useState('');
    const [selectedDistrict, setSelectedDistrict] = React.useState('');

    const [detailedAddress, setDetailedAddress] = React.useState('');
    const [isDetailedFocused, setIsDetailedFocused] = React.useState(false);

    const [isCountryMenuOpen, setIsCountryMenuOpen] = React.useState(false);
    const [isProvinceMenuOpen, setIsProvinceMenuOpen] = React.useState(false);
    const [isDistrictMenuOpen, setIsDistrictMenuOpen] = React.useState(false);

    const [addressData, setAddressData] = React.useState<ProvinceOption[]>([]);
    const [isLoadingAddresses, setIsLoadingAddresses] = React.useState(false);
    const [addressError, setAddressError] = React.useState<string | null>(null);

    const countries = React.useMemo(() => ['Vietnam'], []);
    const provinceOptions = React.useMemo(() => {
        if (selectedCountry !== 'Vietnam') return [];
        return addressData.map((p) => p.name);
    }, [addressData, selectedCountry]);

    const districtOptions = React.useMemo(() => {
        if (selectedCountry !== 'Vietnam') return [];
        const province = addressData.find((it) => it.name === selectedProvince);
        return province?.districts.map((d) => d.name) ?? [];
    }, [addressData, selectedCountry, selectedProvince]);

    const normalizeFromOpenApi = (rows: OpenApiProvince[]): ProvinceOption[] =>
        rows.map((p) => ({
            code: String(p.code),
            name: p.name,
            districts: (p.districts || []).map((d) => ({ code: String(d.code), name: d.name })),
        }));

    const normalizeFromGithub = (rows: GithubProvince[]): ProvinceOption[] =>
        rows.map((p) => ({
            code: p.Code,
            name: p.Name,
            districts: (p.Districts || []).map((d) => ({ code: d.Code, name: d.Name })),
        }));

    const loadAddresses = React.useCallback(async () => {
        if (selectedCountry !== 'Vietnam') return;

        setIsLoadingAddresses(true);
        setAddressError(null);

        try {
            const res = await fetch(OPEN_API_URL);
            if (!res.ok) throw new Error('open-api not ok');
            const data = (await res.json()) as OpenApiProvince[];
            setAddressData(normalizeFromOpenApi(data));
        } catch (err) {
            console.warn('Primary address source failed, falling back...', err);
            try {
                const res2 = await fetch(GITHUB_FALLBACK_URL);
                if (!res2.ok) throw new Error('fallback not ok');
                const data2 = (await res2.json()) as GithubProvince[];
                setAddressData(normalizeFromGithub(data2));
            } catch (err2) {
                console.error('Failed to load provinces', err2);
                setAddressError(t('checkout.errors.loadAddress'));
            }
        } finally {
            setIsLoadingAddresses(false);
        }
    }, [selectedCountry, t]);

    React.useEffect(() => {
        if (selectedCountry !== 'Vietnam') {
            setAddressData([]);
            setSelectedProvince('');
            setSelectedDistrict('');
            return;
        }
        if (!addressData.length && !isLoadingAddresses && !addressError) {
            loadAddresses();
        }
    }, [selectedCountry, addressData.length, isLoadingAddresses, addressError, loadAddresses]);

    React.useEffect(() => {
        if (selectedCountry !== 'Vietnam') return;
        if (!addressData.length) return;

        const current = addressData.find((p) => p.name === selectedProvince) ?? addressData[0];
        if (current && current.name !== selectedProvince) {
            setSelectedProvince(current.name);
            return;
        }

        const dists = current?.districts ?? [];
        const currentDist = dists.find((d) => d.name === selectedDistrict) ?? dists[0];
        if (currentDist && currentDist.name !== selectedDistrict) {
            setSelectedDistrict(currentDist.name);
        }
    }, [addressData, selectedCountry, selectedProvince, selectedDistrict]);

    const renderDropdown = (
        label: string,
        value: string,
        onToggle: () => void,
        isOpen: boolean,
        options: string[],
        onSelect: (option: string) => void,
        placeholder: string,
        disabled: boolean = false,
        emptyMessage?: string,
    ) => {
        const displayValue = value || placeholder || t('checkout.dropdown.selectOption');
        const isSelectionAvailable = options.length > 0;

        return (
            <View style={styles.dropdownGroup}>
                <ThemedText>{label}</ThemedText>

                <Pressable
                    style={[
                        styles.dropdownContainer,
                        {
                            borderColor: isOpen ? Colors[scheme].tint : Colors[scheme].border,
                            backgroundColor: Colors[scheme].background,
                            opacity: disabled ? 0.6 : 1,
                        },
                    ]}
                    onPress={() => {
                        if (!disabled) onToggle();
                    }}
                >
                    <ThemedText style={{ color: value ? Colors[scheme].text : Colors[scheme].secondaryText, fontSize: 16 }}>
                        {displayValue}
                    </ThemedText>

                    <Svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <Path
                            d="M7 10L12 15L17 10"
                            stroke={Colors[scheme].icon}
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </Svg>
                </Pressable>

                {isOpen && !disabled && (
                    <View style={[styles.dropdownList, { backgroundColor: Colors[scheme].background, borderColor: Colors[scheme].border }]}>
                        {isSelectionAvailable ? (
                            options.map((option) => (
                                <Pressable
                                    key={option}
                                    style={styles.dropdownItem}
                                    onPress={() => {
                                        onSelect(option);
                                        onToggle();
                                    }}





                                >
                                    <ThemedText style={{ color: option === value ? Colors[scheme].tint : Colors[scheme].text, fontSize: 16 }}>
                                        {option}
                                    </ThemedText>





                                </Pressable>
                            ))
                        ) : (
                            <View style={styles.dropdownItem}>
                                <ThemedText style={{ color: Colors[scheme].secondaryText, fontSize: 16 }}>
                                    {emptyMessage || t('checkout.dropdown.noOptions')}
                                </ThemedText>
                            </View>
                        )}
                    </View>
                )}
            </View>
        );
    };

    const provincePlaceholder =
        selectedCountry !== 'Vietnam'
            ? t('checkout.placeholders.selectCountryFirst')
            : isLoadingAddresses
                ? t('checkout.placeholders.loadingProvinces')
                : t('checkout.placeholders.selectProvince');

    const districtPlaceholder =
        selectedCountry !== 'Vietnam'
            ? t('checkout.placeholders.selectCountryFirst')
            : !selectedProvince
                ? t('checkout.placeholders.selectProvinceFirst')
                : isLoadingAddresses
                    ? t('checkout.placeholders.loadingDistricts')
                    : t('checkout.placeholders.selectDistrict');

    const isProvinceDisabled = selectedCountry !== 'Vietnam' || isLoadingAddresses;
    const isDistrictDisabled = selectedCountry !== 'Vietnam' || !selectedProvince || isLoadingAddresses;

    return (
        <ThemedView style={styles.container}>
            <ThemedView style={styles.headerContainer}>
                <ThemedView style={styles.leftHeader}>
                    <GoBackButton />
                    <ThemedText type="title" style={{ fontSize: 20 }}>
                        {t('checkout.title')}
                    </ThemedText>
                </ThemedView>
            </ThemedView>

            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.keyboardAvoid}>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <ThemedView style={styles.statusBar}>
                        {/* SVG giữ nguyên */}
                        <Svg width="280" height="39" viewBox="0 0 280 39" fill="none">
                            {/* ... (giữ nguyên toàn bộ Path) */}
                        </Svg>
                    </ThemedView>

                    <ThemedView style={styles.content}>
                        <ThemedView style={styles.fieldGroup}>
                            <ThemedText>{t('checkout.fields.fullName')} *</ThemedText>
                            <TextInput
                                style={[
                                    styles.input,
                                    { color: Colors[scheme].text, borderColor: isFullNameFocused ? Colors[scheme].tint : Colors[scheme].border },
                                ]}
                                value={fullName}
                                onChangeText={setFullName}
                                placeholder={t('checkout.placeholders.fullName')}
                                placeholderTextColor={Colors[scheme].icon}
                                keyboardType="default"
                                autoCapitalize="words"
                                onFocus={() => setIsFullNameFocused(true)}
                                onBlur={() => setIsFullNameFocused(false)}
                            />
                        </ThemedView>

                        <ThemedView style={styles.fieldGroup}>
                            <ThemedText>{t('checkout.fields.phone')} *</ThemedText>
                            <TextInput
                                style={[
                                    styles.input,
                                    { color: Colors[scheme].text, borderColor: isPhoneFocused ? Colors[scheme].tint : Colors[scheme].border },
                                ]}
                                value={phone}
                                onChangeText={setPhone}
                                placeholder={t('checkout.placeholders.phone')}
                                placeholderTextColor={Colors[scheme].icon}
                                keyboardType="default"
                                autoCapitalize="words"
                                onFocus={() => setIsPhoneFocused(true)}
                                onBlur={() => setIsPhoneFocused(false)}
                            />
                        </ThemedView>

                        <ThemedView style={styles.fieldGroup}>
                            {renderDropdown(
                                `${t('checkout.fields.country')} *`,
                                selectedCountry,
                                () => setIsCountryMenuOpen((v) => !v),
                                isCountryMenuOpen,
                                countries,
                                (option) => {
                                    setSelectedCountry(option);
                                    setIsProvinceMenuOpen(false);
                                    setIsDistrictMenuOpen(false);
                                    if (option !== 'Vietnam') {
                                        setAddressData([]);
                                        setAddressError(null);
                                        setSelectedProvince('');
                                        setSelectedDistrict('');
                                    } else if (!addressData.length) {
                                        loadAddresses();
                                    }
                                },
                                t('checkout.placeholders.country'),
                                false,
                                t('checkout.dropdown.noCountries'),
                            )}
                        </ThemedView>

                        <ThemedView style={styles.fieldGroup}>
                            {renderDropdown(
                                `${t('checkout.fields.province')} *`,
                                selectedProvince,
                                () => setIsProvinceMenuOpen((v) => !v),
                                isProvinceMenuOpen,
                                provinceOptions,
                                (option) => {
                                    setSelectedProvince(option);
                                    setSelectedDistrict('');
                                    setIsDistrictMenuOpen(false);
                                },
                                provincePlaceholder,
                                isProvinceDisabled,
                                addressError ?? t('checkout.dropdown.noProvinces'),
                            )}

                            {isLoadingAddresses && (
                                <View style={{ marginTop: 8 }}>
                                    <ActivityIndicator color={Colors[scheme].tint} />
                                </View>
                            )}

                            {addressError && (
                                <ThemedView style={{ marginTop: 8, flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                                    <ThemedText style={[styles.errorText, { color: Colors[scheme].tint }]}>
                                        {addressError}
                                    </ThemedText>
                                    <Pressable
                                        onPress={loadAddresses}
                                        style={{ paddingHorizontal: 10, paddingVertical: 6, borderWidth: 1, borderColor: Colors[scheme].tint, borderRadius: 6 }}
                                    >
                                        <ThemedText style={{ color: Colors[scheme].tint }}>{t('common.retry')}</ThemedText>
                                    </Pressable>
                                </ThemedView>
                            )}
                        </ThemedView>

                        <ThemedView style={styles.fieldGroup}>
                            {renderDropdown(
                                `${t('checkout.fields.district')} *`,
                                selectedDistrict,
                                () => setIsDistrictMenuOpen((v) => !v),
                                isDistrictMenuOpen,
                                districtOptions,
                                (option) => setSelectedDistrict(option),
                                districtPlaceholder,
                                isDistrictDisabled,
                                selectedProvince ? t('checkout.dropdown.noDistricts') : t('checkout.placeholders.selectProvinceFirst'),
                            )}
                        </ThemedView>

                        <ThemedView style={styles.fieldGroup}>
                            <ThemedText>{t('checkout.fields.detailedAddress')} *</ThemedText>
                            <TextInput
                                style={[
                                    styles.input,
                                    { color: Colors[scheme].text, borderColor: isDetailedFocused ? Colors[scheme].tint : Colors[scheme].border },
                                ]}
                                value={detailedAddress}
                                onChangeText={setDetailedAddress}
                                placeholder={t('checkout.placeholders.detailedAddress')}
                                placeholderTextColor={Colors[scheme].icon}
                                keyboardType="default"
                                autoCapitalize="sentences"
                                onFocus={() => setIsDetailedFocused(true)}
                                onBlur={() => setIsDetailedFocused(false)}
                            />
                        </ThemedView>
                    </ThemedView>

                    <FullButton
                        text={t('common.continue')}
                        onPress={() => {
                            router.push('/checkout/payment' as any);
                        }}
                        style={{ marginTop: 20, flex: 1 }}
                    />
                </ScrollView>
            </KeyboardAvoidingView>
        </ThemedView>
    );
};

export default CheckoutScreen;

const styles = StyleSheet.create({
    container: { height: '100%', width: '100%', padding: 15, paddingTop: 20, position: 'relative' },
    headerContainer: { width: '100%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
    leftHeader: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 12 },
    statusBar: { width: '100%', justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
    content: { flex: 1 },
    fieldGroup: { marginTop: 16 },
    errorText: { marginTop: 8, fontSize: 13 },
    input: { fontSize: 16, borderWidth: 1, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 15, marginTop: 8 },
    dropdownGroup: { marginTop: 8 },
    dropdownContainer: { borderWidth: 1, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 15, marginTop: 8, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    dropdownList: { marginTop: 8, borderWidth: 1, borderRadius: 12, overflow: 'hidden' },
    dropdownItem: { paddingHorizontal: 12, paddingVertical: 12 },
    keyboardAvoid: { flex: 1, justifyContent: 'flex-end', },
});