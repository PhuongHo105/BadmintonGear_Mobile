import React from 'react';
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
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
  const router = useRouter();
  const schemeRaw = useColorScheme();
  const scheme: keyof typeof Colors = (schemeRaw ?? 'light') as keyof typeof Colors;
  const tint: string = Colors[scheme].tint;
  const onPressCategorySeeAll = () => {
    router.push('/categories' as any);
  }
  const onPressSeeAll = () => {
    router.push('/product' as any);
  }
  const categories = [
    { id: '1', name: 'Racket', image: <RacketIcon width={48} height={48} /> },
    { id: '2', name: 'Shuttlecock', image: <ShuttlecockIcon width={48} height={48} /> },
    { id: '3', name: 'Shoes', image: <ShoesIcon width={48} height={48} /> },
    { id: '4', name: 'Clothes', image: <ClothesIcon width={48} height={48} /> },
    { id: '5', name: 'Bags', image: <BagsIcon width={48} height={48} /> },
    { id: '6', name: 'Others', image: <OtherIcon width={48} height={48} /> },
  ];
  const products = [
    { id: '1', name: 'Product 1', price: 100000, discount: 20, image: require('../../assets/images/product1.png') },
    { id: '2', name: 'Product 2', price: 150000, discount: 10, image: require('../../assets/images/product1.png') },
    { id: '3', name: 'Product 3', price: 200000, image: require('../../assets/images/product1.png') },
    { id: '4', name: 'Product 4', price: 250000, discount: 15, image: require('../../assets/images/product1.png') },
    { id: '5', name: 'Product 5', price: 300000, image: require('../../assets/images/product1.png') },
  ];

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
              <ThemedText type="defaultSemiBold" style={{ fontSize: 20 }}>Category</ThemedText>
              <Pressable onPress={() => { onPressCategorySeeAll() }}>
                <ThemedText type="link" style={{ color: tint }}>See All</ThemedText>
              </Pressable>
            </ThemedView>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 12 }}>
              {categories.map((cat) => (
                <Pressable key={cat.id} style={styles.categoryItem} onPress={() => { }}>
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
          <ThemedView>
            <ThemedView style={styles.headerSection}>
              <ThemedText type="defaultSemiBold" style={{ fontSize: 20 }}>Lastest Product</ThemedText>
              <Pressable onPress={() => { onPressSeeAll() }}>
                <ThemedText type="link" style={{ color: tint }}>See All</ThemedText>
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
    marginRight: 16,
    paddingTop: 12,
    paddingBottom: 12,
    paddingLeft: 20,
    paddingRight: 20,
    borderRadius: 12,
    borderColor: '#F4F5FD',
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
