import React, { useEffect } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import BagsIcon from '@/components/ui/categoryIcon/bags-icon';
import ClothesIcon from '@/components/ui/categoryIcon/clothes-icon';
import OtherIcon from '@/components/ui/categoryIcon/other-icon';
import RacketIcon from '@/components/ui/categoryIcon/racket-icon';
import ShoesIcon from '@/components/ui/categoryIcon/shoes-icon';
import ShuttlecockIcon from '@/components/ui/categoryIcon/shuttlecock-icon';
import Header from '@/components/ui/header';
import ProductCard from '@/components/ui/productcard';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { getCurrentLanguage } from '@/i18n';
import { getAllProducts, getTopSellingProducts } from '@/services/productService';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';

export default function HomeScreen() {
  const { t } = useTranslation();
  const language = getCurrentLanguage();
  const router = useRouter();
  const schemeRaw = useColorScheme();
  const scheme: keyof typeof Colors = (schemeRaw ?? 'light') as keyof typeof Colors;
  const tint: string = Colors[scheme].tint;
  const borderColor: string = Colors[scheme].border;

  const handleSeeAllCategoriesPress = () => {
    router.push('/categories');
  };

  const pushProductList = (params?: { category?: number }) => {
    const routeParams: Record<string, string> = {};
    if (params?.category !== undefined) {
      routeParams.categoriesid = String(params.category);
    }
    router.push({ pathname: '/productList', params: routeParams });
  };
  const categories = [{ id: '1', name: t('categories.rackets'), image: <RacketIcon width={48} height={48} />, filter: 1 },
  { id: '2', name: t('categories.shoes'), image: <ShoesIcon width={48} height={48} />, filter: 3 },
  { id: '3', name: t('categories.clothes'), image: <ClothesIcon width={48} height={48} />, filter: 4 },
  { id: '4', name: t('categories.bags'), image: <BagsIcon width={48} height={48} />, filter: 5 },
  { id: '5', name: t('categories.shuttlecocks'), image: <ShuttlecockIcon width={48} height={48} />, filter: 2 },
  { id: '6', name: t('categories.other'), image: <OtherIcon width={48} height={48} /> }];
  const [products, setProducts] = React.useState<any[]>([]);
  const [bestSellingProducts, setBestSellingProducts] = React.useState<any[]>([]);

  const handleSeeAllProductsPress = () => {
    pushProductList();
  };

  const handleCategoryItemPress = (category?: number) => {
    pushProductList(category ? { category } : undefined);
  };

  useEffect(() => {
    // Fetch products here
    const fetchData = async () => {
      try {
        const productsResponse = await getAllProducts(language);
        const bestSellingResponse = await getTopSellingProducts(new Date().getMonth() + 1, new Date().getFullYear(), language);
        setProducts(productsResponse);
        setBestSellingProducts(bestSellingResponse);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [language]);

  return (
    <View>
      <ThemedView style={styles.container}>
        <Header />
        <ScrollView showsVerticalScrollIndicator={false} >
          <ThemedView style={styles.stepContainer}>
            <Image source={require('../../assets/images/banner/banner1.png')} style={styles.banner} />
          </ThemedView>
          <ThemedView>
            <ThemedView style={styles.headerSection}>
              <ThemedText type="defaultSemiBold" style={{ fontSize: 20 }}>{t('home.category')}</ThemedText>
              <Pressable onPress={handleSeeAllCategoriesPress}>
                <ThemedText type="link" style={{ color: tint }}>{t('common.seeAll')}</ThemedText>
              </Pressable>
            </ThemedView>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 12 }}>
              {categories.map((cat) => (
                <Pressable
                  key={cat.id}
                  style={[styles.categoryItem, { borderColor: borderColor }]}
                  onPress={() => handleCategoryItemPress(cat.filter)}
                >
                  {React.isValidElement(cat.image) ? (
                    <View style={styles.categoryIcon}>{cat.image}</View>
                  ) : (
                    <Image source={cat.image as any} style={styles.categoryIcon} />
                  )}
                  <ThemedText style={{ marginTop: 6 }}>{cat.name}</ThemedText>
                </Pressable>
              ))}
            </ScrollView>
          </ThemedView>
          {bestSellingProducts.length > 0 && (
            <ThemedView>
              <ThemedView style={styles.headerSection}>
                <ThemedText type="defaultSemiBold" style={{ fontSize: 20 }}>{t('home.bestSelling')}</ThemedText>
                <Pressable onPress={handleSeeAllProductsPress}>
                  <ThemedText type="link" style={{ color: tint }}>{t('common.seeAll')}</ThemedText>
                </Pressable>
              </ThemedView>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 20 }}>
                {bestSellingProducts.map((product) =>
                (<ThemedView key={product.id} style={{ marginRight: 12 }}>
                  <ProductCard key={product.id} product={product} />
                </ThemedView>)
                )}
              </ScrollView>
            </ThemedView>
          )}
          <ThemedView>
            <ThemedView style={styles.headerSection}>
              <ThemedText type="defaultSemiBold" style={{ fontSize: 20 }}>{t('home.latestProducts')}</ThemedText>
              <Pressable onPress={() => { handleSeeAllProductsPress() }}>
                <ThemedText type="link" style={{ color: tint }}>{t('common.seeAll')}</ThemedText>
              </Pressable>
            </ThemedView>
            <ThemedView style={{ gap: 10, flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
              {products.map((product) =>
                <ProductCard key={product.id} product={product} />
              )}
            </ThemedView>
          </ThemedView>
        </ScrollView>
      </ThemedView>
    </View>

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
  banner: {
    borderRadius: 12,
    height: 200,
    width: '100%'
  },
  headerSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
    marginTop: 12,
  },
  categoryItem: {
    alignItems: 'center',
    width: 130,
    marginRight: 16,
    paddingTop: 12,
    paddingBottom: 12,
    paddingLeft: 20,
    paddingRight: 20,
    borderRadius: 12,
    borderWidth: 1,
  },
  categoryIcon: {
    width: 56,
    height: 56,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center'
  },

});
