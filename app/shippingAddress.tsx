import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import FullButton from '@/components/ui/fullbutton';
import GoBackButton from '@/components/ui/gobackbutton';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import React, { FC } from 'react';
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

const ShippingAddressScreen: FC = () => {
    const schemeRaw = useColorScheme();
    const scheme: keyof typeof Colors = (schemeRaw ?? 'light') as keyof typeof Colors;
    const [shippingAddress, setShippingAddress] = React.useState({
        fullName: 'Nguyễn Văn A',
        phone: '0123456789',
        country: 'Vietnam',
        province: 'Hồ Chí Minh',
        district: 'Quận 1',
        detailedAddress: '123 Đường ABC, Phường XYZ',
    });
    const [error, setError] = React.useState<string | null>(null);
    const [mode, setMode] = React.useState<'view' | 'edit'>('view');
    const isReadOnly = mode === 'view';
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
                setAddressError('Không thể tải địa chỉ. Kiểm tra kết nối và thử lại.');
            }
        } finally {
            setIsLoadingAddresses(false);
        }
    }, [selectedCountry]);

    React.useEffect(() => {
        if (selectedCountry !== 'Vietnam') {
            setAddressData([]);
            setSelectedProvince('');
            setSelectedDistrict('');
            return;
        }
        if (!addressData.length && !isLoadingAddresses && !addressError) {
            // initial load
            loadAddresses();
        }
    }, [selectedCountry, addressData.length, isLoadingAddresses, addressError, loadAddresses]);

    // Sync form fields from saved address when switching modes or when shippingAddress changes
    React.useEffect(() => {
        setFullName(shippingAddress.fullName);
        setPhone(shippingAddress.phone);
        setSelectedCountry(shippingAddress.country);
        setSelectedProvince(shippingAddress.province);
        setSelectedDistrict(shippingAddress.district);
        setDetailedAddress(shippingAddress.detailedAddress);
        if (mode === 'view') {
            setIsCountryMenuOpen(false);
            setIsProvinceMenuOpen(false);
            setIsDistrictMenuOpen(false);
        }
    }, [mode, shippingAddress]);

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
        placeholder?: string,
        disabled: boolean = false,
        emptyMessage?: string,
    ) => {
        const displayValue = value || placeholder || 'Select an option';
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
                    <ThemedText
                        style={{ color: value ? Colors[scheme].text : Colors[scheme].secondaryText, fontSize: 16 }}
                    >
                        {displayValue}
                    </ThemedText>
                    <Svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <Path d="M7 10L12 15L17 10" stroke={Colors[scheme].icon} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </Svg>
                </Pressable>
                {isOpen && !disabled && (
                    <View
                        style={[
                            styles.dropdownList,
                            { backgroundColor: Colors[scheme].background, borderColor: Colors[scheme].border },
                        ]}
                    >
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
                                    <ThemedText
                                        style={{ color: option === value ? Colors[scheme].tint : Colors[scheme].text, fontSize: 16 }}
                                    >
                                        {option}
                                    </ThemedText>
                                </Pressable>
                            ))
                        ) : (
                            <View style={styles.dropdownItem}>
                                <ThemedText style={{ color: Colors[scheme].secondaryText, fontSize: 16 }}>
                                    {emptyMessage || 'No options available'}
                                </ThemedText>
                            </View>
                        )}
                    </View>
                )}
            </View>
        );
    };

    // Menu toggle handlers are inlined in render to avoid unused variables.

    const provincePlaceholder =
        selectedCountry !== 'Vietnam'
            ? 'Select a country first'
            : isLoadingAddresses
                ? 'Loading provinces...'
                : 'Select province / city';

    const districtPlaceholder =
        selectedCountry !== 'Vietnam'
            ? 'Select a country first'
            : !selectedProvince
                ? 'Select province first'
                : isLoadingAddresses
                    ? 'Loading districts...'
                    : 'Select district';

    const isProvinceDisabled = selectedCountry !== 'Vietnam' || isLoadingAddresses;
    const isDistrictDisabled = selectedCountry !== 'Vietnam' || !selectedProvince || isLoadingAddresses;

    function saveAddress() {
        // Basic validation for required fields
        if (!fullName.trim()) {
            setError('Full name is required.');
            return;
        }
        if (!phone.trim()) {
            setError('Phone number is required.');
            return;
        }
        if (!detailedAddress.trim()) {
            setError('Detailed address is required.');
            return;
        }
        if (selectedCountry === 'Vietnam' && (!selectedProvince || !selectedDistrict)) {
            setError('Please select province and district.');
            return;
        }

        // Persist address to local component state
        setShippingAddress({
            fullName: fullName.trim(),
            phone: phone.trim(),
            country: selectedCountry,
            province: selectedProvince,
            district: selectedDistrict,
            detailedAddress: detailedAddress.trim(),
        });

        // Reset UI state
        setIsCountryMenuOpen(false);
        setIsProvinceMenuOpen(false);
        setIsDistrictMenuOpen(false);
        setIsFullNameFocused(false);
        setIsPhoneFocused(false);
        setIsDetailedFocused(false);

        // Switch back to view mode
        setMode('view');
    }

    return (
        <ThemedView style={styles.container}>
            <ThemedView style={styles.headerContainer}>
                <ThemedView style={styles.leftHeader}>
                    <GoBackButton />
                    <ThemedText type="title" style={{ fontSize: 20 }}>
                        Shipping Address
                    </ThemedText>
                </ThemedView>
            </ThemedView>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardAvoid}
            >
                <ScrollView showsVerticalScrollIndicator={false}>
                    <ThemedView style={styles.content}>
                        <ThemedView style={styles.fieldGroup}>
                            <ThemedText>Full Name *</ThemedText>
                            <TextInput
                                style={[
                                    styles.input,
                                    { color: Colors[scheme].text, borderColor: isFullNameFocused ? Colors[scheme].tint : Colors[scheme].border },
                                ]}
                                value={fullName}
                                onChangeText={setFullName}
                                placeholder="Enter your full name"
                                placeholderTextColor={Colors[scheme].icon}
                                keyboardType="default"
                                autoCapitalize="words"
                                onFocus={() => setIsFullNameFocused(true)}
                                onBlur={() => setIsFullNameFocused(false)}
                                editable={!isReadOnly}
                            />
                        </ThemedView>

                        <ThemedView style={styles.fieldGroup}>
                            <ThemedText>Phone Number *</ThemedText>
                            <TextInput
                                style={[
                                    styles.input,
                                    { color: Colors[scheme].text, borderColor: isPhoneFocused ? Colors[scheme].tint : Colors[scheme].border },
                                ]}
                                value={phone}
                                onChangeText={setPhone}
                                placeholder="Enter your phone number"
                                placeholderTextColor={Colors[scheme].icon}
                                keyboardType="default"
                                autoCapitalize="words"
                                onFocus={() => setIsPhoneFocused(true)}
                                onBlur={() => setIsPhoneFocused(false)}
                                editable={!isReadOnly}
                            />
                        </ThemedView>

                        <ThemedView style={styles.fieldGroup}>
                            {renderDropdown(
                                'Country *',
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
                                'Select country',
                                isReadOnly,
                                'No countries available',
                            )}
                        </ThemedView>

                        <ThemedView style={styles.fieldGroup}>
                            {renderDropdown(
                                'Province / City *',
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
                                isReadOnly || isProvinceDisabled,
                                addressError ?? 'No provinces available',
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
                                    <Pressable onPress={loadAddresses} style={{ paddingHorizontal: 10, paddingVertical: 6, borderWidth: 1, borderColor: Colors[scheme].tint, borderRadius: 6 }}>
                                        <ThemedText style={{ color: Colors[scheme].tint }}>Retry</ThemedText>
                                    </Pressable>
                                </ThemedView>
                            )}
                        </ThemedView>

                        <ThemedView style={styles.fieldGroup}>
                            {renderDropdown(
                                'District *',
                                selectedDistrict,
                                () => setIsDistrictMenuOpen((v) => !v),
                                isDistrictMenuOpen,
                                districtOptions,
                                (option) => setSelectedDistrict(option),
                                districtPlaceholder,
                                isReadOnly || isDistrictDisabled,
                                selectedProvince ? 'No districts available' : 'Select province first',
                            )}
                        </ThemedView>

                        <ThemedView style={styles.fieldGroup}>
                            <ThemedText>Detailed Address *</ThemedText>
                            <TextInput
                                style={[
                                    styles.input,
                                    { color: Colors[scheme].text, borderColor: isDetailedFocused ? Colors[scheme].tint : Colors[scheme].border },
                                ]}
                                value={detailedAddress}
                                onChangeText={setDetailedAddress}
                                placeholder="Street, building, house number"
                                placeholderTextColor={Colors[scheme].icon}
                                keyboardType="default"
                                autoCapitalize="sentences"
                                onFocus={() => setIsDetailedFocused(true)}
                                onBlur={() => setIsDetailedFocused(false)}
                                editable={!isReadOnly}
                            />
                        </ThemedView>
                    </ThemedView>
                    {error ? (
                        <ThemedText style={[styles.errorText, { color: Colors[scheme].tint, textAlign: 'center', marginTop: 10 }]}>{error}</ThemedText>
                    ) : null}
                    <FullButton text={mode === 'edit' ? 'Save' : 'Edit'} onPress={() => {
                        if (mode === 'edit') {
                            saveAddress();
                        }
                        else { setMode('edit'); }
                    }} style={{ marginTop: 20, flex: 1 }} />
                </ScrollView>
            </KeyboardAvoidingView>
        </ThemedView >
    );
};

export default ShippingAddressScreen;

const styles = StyleSheet.create({
    container: { height: '100%', width: '100%', padding: 15, paddingTop: 50, position: 'relative' },
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