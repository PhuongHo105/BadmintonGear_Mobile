import { useToast } from '@/app/providers/ToastProvider';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import FullButton from '@/components/ui/fullbutton';
import GoBackButton from '@/components/ui/gobackbutton';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { getUserById, updateUserProfile } from '@/services/userService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';
import React, { FC, useEffect } from 'react';
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

const ShippingAddressScreen: FC = () => {
    const { t } = useTranslation();
    const schemeRaw = useColorScheme();
    const scheme: keyof typeof Colors = (schemeRaw ?? 'light') as keyof typeof Colors;
    const toast = useToast();
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
    const [pendingAddress, setPendingAddress] = React.useState<{ province: string; district: string } | null>(null);
    const [userData, setUserData] = React.useState<any>(null);
    const handleGetAddress = async () => {
        const token = await AsyncStorage.getItem('loginToken');
        const decoded = jwtDecode(token ?? '');
        const userId = (decoded as any).userid;
        const user = await getUserById(userId);
        setUserData(user);

        // Parse address string separated by commas
        let detailedAddress = '';
        let district = '';
        let province = '';

        if (user.address && typeof user.address === 'string') {
            const parts = user.address.split(',').map((part: string) => part.trim());
            detailedAddress = parts[0] || '';
            district = parts[1] || '';
            province = parts[2] || '';
        }

        setShippingAddress({
            fullName: user.name || '',
            phone: user.phonenumber || '',
            country: user.country || 'Vietnam',
            province: province,
            district: district,
            detailedAddress: detailedAddress,
        });

        // Store pending address to apply after addressData loads
        if (province || district) {
            setPendingAddress({ province, district });
        }
    }
    useEffect(() => {
        handleGetAddress();
    }, []);

    const handleUpdateAddress = async () => {
        if (!fullName.trim()) {
            setError(t('shippingAddress.validation.fullNameRequired'));
            toast.show({ message: t('shippingAddress.validation.fullNameRequired'), type: 'error' });
            return;
        }
        if (!phone.trim()) {
            setError(t('shippingAddress.validation.phoneRequired'));
            toast.show({ message: t('shippingAddress.validation.phoneRequired'), type: 'error' });
            return;
        }
        if (!detailedAddress.trim()) {
            setError(t('shippingAddress.validation.detailedAddressRequired'));
            toast.show({ message: t('shippingAddress.validation.detailedAddressRequired'), type: 'error' });
            return;
        }
        if (selectedCountry === 'Vietnam' && (!selectedProvince || !selectedDistrict)) {
            setError(t('shippingAddress.validation.provinceDistrictRequired'));
            toast.show({ message: t('shippingAddress.validation.provinceDistrictRequired'), type: 'error' });
            return;
        }
        const body = {
            name: fullName,
            username: userData?.username || '',
            password: userData?.password || '',
            email: userData?.email || '',
            gender: userData?.gender || '',
            address: detailedAddress + ', ' + selectedDistrict + ', ' + selectedProvince + ', ' + selectedCountry,
            phonenumber: phone,
            roleid: userData?.roleid || 2,
        }
        try {
            const response = await updateUserProfile(userData?.id, body);
            if (response.id !== undefined) {

                toast.show({ message: t('shippingAddress.updateSuccessMessage'), type: 'success' });
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
        }
        catch (error) {
            toast.show({ message: t('shippingAddress.updateErrorMessage'), type: 'error' });
            console.error('Error updating user profile:', error);
        }
    }

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
                setAddressError((t('shippingAddress.errors.loadAddress')));
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

    // Apply pending address when addressData is loaded 
    React.useEffect(() => {
        if (selectedCountry !== 'Vietnam' || !addressData.length || !pendingAddress) return;
        const provinceExists = addressData.find((p) => p.name === pendingAddress.province);

        if (provinceExists) {
            setSelectedProvince(pendingAddress.province);
            setSelectedDistrict(pendingAddress.district);
            setPendingAddress(null);
        }
    }, [addressData, selectedCountry, pendingAddress]);

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
        const displayValue = value || placeholder || t('shippingAddress.dropdown.selectOption');
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
                                    {emptyMessage || t('shippingAddress.dropdown.noOptions')}
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
            ? t('shippingAddress.placeholders.selectCountryFirst')
            : isLoadingAddresses
                ? t('shippingAddress.placeholders.loadingProvinces')
                : t('shippingAddress.placeholders.selectProvince');

    const districtPlaceholder =
        selectedCountry !== 'Vietnam'
            ? t('shippingAddress.placeholders.selectCountryFirst')
            : !selectedProvince
                ? t('shippingAddress.placeholders.selectProvinceFirst')
                : isLoadingAddresses
                    ? t('shippingAddress.placeholders.loadingDistricts')
                    : t('shippingAddress.placeholders.selectDistrict');

    const isProvinceDisabled = selectedCountry !== 'Vietnam' || isLoadingAddresses;
    const isDistrictDisabled = selectedCountry !== 'Vietnam' || !selectedProvince || isLoadingAddresses;
    return (
        <ThemedView style={styles.container}>
            <ThemedView style={styles.headerContainer}>
                <ThemedView style={styles.leftHeader}>
                    <GoBackButton />
                    <ThemedText type="title" style={{ fontSize: 20 }}>
                        {t('shippingAddress.title')}
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
                            <ThemedText>{t('shippingAddress.fields.fullName')} *</ThemedText>
                            <TextInput
                                style={[
                                    styles.input,
                                    { color: Colors[scheme].text, borderColor: isFullNameFocused ? Colors[scheme].tint : Colors[scheme].border },
                                ]}
                                value={fullName}
                                onChangeText={setFullName}
                                placeholder={t('shippingAddress.placeholders.fullName')}
                                placeholderTextColor={Colors[scheme].icon}
                                keyboardType="default"
                                autoCapitalize="words"
                                onFocus={() => setIsFullNameFocused(true)}
                                onBlur={() => setIsFullNameFocused(false)}
                                editable={!isReadOnly}
                            />
                        </ThemedView>

                        <ThemedView style={styles.fieldGroup}>
                            <ThemedText>{t('shippingAddress.fields.phone')} *</ThemedText>
                            <TextInput
                                style={[
                                    styles.input,
                                    { color: Colors[scheme].text, borderColor: isPhoneFocused ? Colors[scheme].tint : Colors[scheme].border },
                                ]}
                                value={phone}
                                onChangeText={setPhone}
                                placeholder={t('shippingAddress.placeholders.phone')}
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
                                `${t('shippingAddress.fields.country')} *`,
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
                                t('shippingAddress.placeholders.country'),
                                isReadOnly,
                                t('shippingAddress.dropdown.noCountries'),
                            )}
                        </ThemedView>

                        <ThemedView style={styles.fieldGroup}>
                            {renderDropdown(
                                `${t('shippingAddress.fields.province')} *`,
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
                                addressError ?? t('shippingAddress.dropdown.noProvinces'),
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
                                        <ThemedText style={{ color: Colors[scheme].tint }}>{t('common.retry')}</ThemedText>
                                    </Pressable>
                                </ThemedView>
                            )}
                        </ThemedView>

                        <ThemedView style={styles.fieldGroup}>
                            {renderDropdown(
                                `${t('shippingAddress.fields.district')} *`,
                                selectedDistrict,
                                () => setIsDistrictMenuOpen((v) => !v),
                                isDistrictMenuOpen,
                                districtOptions,
                                (option) => setSelectedDistrict(option),
                                districtPlaceholder,
                                isReadOnly || isDistrictDisabled,
                                selectedProvince ? t('shippingAddress.dropdown.noDistricts') : t('shippingAddress.placeholders.selectProvinceFirst'),
                            )}
                        </ThemedView>

                        <ThemedView style={styles.fieldGroup}>
                            <ThemedText>{t('shippingAddress.fields.detailedAddress')} *</ThemedText>
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
                    <FullButton text={mode === 'edit' ? t('common.save') : t('common.edit')} onPress={() => {
                        if (mode === 'edit') {
                            handleUpdateAddress();
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