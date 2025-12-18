import React from 'react';
import { ColorSchemeName, FlatList, Image, Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import BagsIcon from '@/components/ui/categoryIcon/bags-icon';
import ClothesIcon from '@/components/ui/categoryIcon/clothes-icon';
import OtherIcon from '@/components/ui/categoryIcon/other-icon';
import RacketIcon from '@/components/ui/categoryIcon/racket-icon';
import ShoesIcon from '@/components/ui/categoryIcon/shoes-icon';
import ShuttlecockIcon from '@/components/ui/categoryIcon/shuttlecock-icon';
import GoBackButton from '@/components/ui/gobackbutton';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';

export default function TabTwoScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const schemeRaw = useColorScheme() as ColorSchemeName | null | undefined;
  const scheme: keyof typeof Colors = (schemeRaw ?? 'light') as keyof typeof Colors
  const borderColor: string = Colors[scheme].border;
  const categories = [
    { id: '1', name: t('categories.rackets'), image: <RacketIcon width={60} height={60} /> },
    { id: '2', name: t('categories.shuttlecocks'), image: <ShuttlecockIcon width={60} height={60} /> },
    { id: '3', name: t('categories.shoes'), image: <ShoesIcon width={60} height={60} /> },
    { id: '4', name: t('categories.clothes'), image: <ClothesIcon width={60} height={60} /> },
    { id: '5', name: t('categories.bags'), image: <BagsIcon width={60} height={60} /> },
    { id: '6', name: t('categories.other'), image: <OtherIcon width={60} height={60} /> },
  ];
  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.headerContainer}>
        <GoBackButton />
        <ThemedText type="title" style={{ fontSize: 20 }}>{t('categories.title')}</ThemedText>
      </ThemedView>
      <FlatList
        data={categories}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.columnWrapper}
        renderItem={({ item }) => (
          <Pressable style={[styles.categoryItem, { borderColor: borderColor }]} onPress={() => { router.push({ pathname: '/productList', params: { categoriesid: item.id } }) }}>
            {React.isValidElement(item.image) ? (
              <View style={styles.categoryIcon}>{item.image}</View>
            ) : (
              <Image source={item.image as any} style={styles.categoryIcon} />
            )}
            <ThemedText style={{ marginTop: 6 }}>{item.name}</ThemedText>
          </Pressable>
        )}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 24 }}
      />
    </ThemedView>
  );
}

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
    textAlign: 'center',
    gap: 12,
    alignItems: 'center',
    marginBottom: 20,
  },
  categoryItem: {
    width: '48%',
    alignItems: 'center',
    paddingTop: 12,
    paddingBottom: 12,
    paddingLeft: 20,
    paddingRight: 20,
    borderRadius: 12,
    borderWidth: 1,
  },
  categoryIcon: {
    width: '100%',
    height: 80,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center'
  },
  columnWrapper: {
    justifyContent: 'space-between',
    marginBottom: 12,
  }
});
