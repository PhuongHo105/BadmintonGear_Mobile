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
import { getFlashsaleDetailById, getNowFlashsales } from '@/services/flashsaleService';
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
  const [flashsaleProducts, setFlashsaleProducts] = React.useState<any[]>([]);
  const [flashsaleEndTime, setFlashsaleEndTime] = React.useState<Date | null>(null);
  const [countdown, setCountdown] = React.useState<string>('');

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
        const flashsalesResponse = await getNowFlashsales();

        setProducts(productsResponse);
        setBestSellingProducts(bestSellingResponse);

        if (flashsalesResponse && flashsalesResponse.length > 0) {
          const activeFlashsale = flashsalesResponse[0];
          // Set countdown end time from the flashsale
          if (activeFlashsale.end) {
            setFlashsaleEndTime(new Date(activeFlashsale.end));
          }

          const flashsaleProducts = await getFlashsaleDetailById(activeFlashsale.id, language);
          const enrichedFlashsaleProducts = flashsaleProducts.map((product: any) => ({
            ...product,
            translations: product.Product.translations,
            price: product.Product.price,
            Imagesproducts: product.Product.Imagesproducts,
            flashsale: {
              id: product.flashsaleid,
              type: product.type,
              value: product.value,
            },
          }));
          setFlashsaleProducts(enrichedFlashsaleProducts);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [language]);

  useEffect(() => {
    if (!flashsaleEndTime) return;

    const updateCountdown = () => {
      const now = new Date();
      const diff = flashsaleEndTime.getTime() - now.getTime();

      if (diff <= 0) {
        setCountdown(t('home.flashsaleEnded'));
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      if (days > 0) {
        setCountdown(`${days}d ${hours}h ${minutes}m ${seconds}s`);
      } else {
        setCountdown(`${hours}h ${minutes}m ${seconds}s`);
      }
    };

    updateCountdown();
    const timer = setInterval(updateCountdown, 1000);

    return () => clearInterval(timer);
  }, [flashsaleEndTime, t]);

  return (
    <View>
      <ThemedView style={styles.container}>
        <Header />
        <ScrollView showsVerticalScrollIndicator={false} >
          <ThemedView style={styles.stepContainer}>
            <Image source={require('../../assets/images/banner/banner1.png')} style={styles.banner} />
          </ThemedView>
          {flashsaleProducts.length > 0 && (
            <ThemedView style={styles.flashsaleSection}>
              <ThemedView style={[styles.flashsaleHeader, { backgroundColor: tint }]}>
                <ThemedView style={styles.flashsaleTitleRow}>
                  <ThemedText type="title" style={[styles.flashsaleTitle, { color: '#fff' }]}>
                    ⚡ {t('home.flashsale')}
                  </ThemedText>
                  {countdown && (
                    <ThemedView style={styles.countdownContainer}>
                      <ThemedText style={styles.countdownText}>{countdown}</ThemedText>
                    </ThemedView>
                  )}
                </ThemedView>
              </ThemedView>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.flashsaleProductList}>
                {flashsaleProducts.map((product) => (
                  <ThemedView key={product.id} style={{ marginRight: 12 }}>
                    <ProductCard product={product} />
                  </ThemedView>
                ))}
              </ScrollView>
            </ThemedView>
          )}
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
  flashsaleSection: {
    marginBottom: 20,
    marginTop: 12,
  },
  flashsaleHeader: {
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  flashsaleTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  flashsaleTitle: {
    fontSize: 20,
  },
  countdownContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  countdownText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  flashsaleProductList: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },

});
