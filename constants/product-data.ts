import { ImageSourcePropType } from "react-native";

export type Product = {
  id: string;
  name: string;
  price: number;
  discount?: number;
  image: ImageSourcePropType;
  category?: number;
  brand?: string;
};

export type ProductFilters = {
  category?: number;
  searchQuery?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
};

export const PRODUCT_DATA: Product[] = [
  {
    id: "1",
    name: "Vợt Yonex Astrox 88D",
    price: 3200000,
    discount: 20,
    image: require("../assets/images/product1.png"),
    category: 1,
    brand: "Yonex",
  },
  {
    id: "2",
    name: "Vợt Lining Aeronaut 7000i",
    price: 2900000,
    discount: 10,
    image: require("../assets/images/product1.png"),
    category: 1,
    brand: "Lining",
  },
  {
    id: "3",
    name: "Giày Victor P9200",
    price: 2100000,
    image: require("../assets/images/product1.png"),
    category: 3,
    brand: "Victor",
  },
  {
    id: "4",
    name: "Áo Yonex Tournament",
    price: 850000,
    discount: 15,
    image: require("../assets/images/product1.png"),
    category: 4,
    brand: "Yonex",
  },
  {
    id: "5",
    name: "Balo Adidas Barricade",
    price: 950000,
    image: require("../assets/images/product1.png"),
    category: 5,
    brand: "Adidas",
  },
];

export const PRICE_STEP = 50000;

export const PRICE_RANGE = (() => {
  const prices = PRODUCT_DATA.map((product) => product.price);
  const highestPrice =
    prices.length > 0 ? Math.max(...prices) : PRICE_STEP * 20;
  const roundedMax = Math.ceil(highestPrice / PRICE_STEP) * PRICE_STEP;
  return { min: 0, max: roundedMax || PRICE_STEP * 20 };
})();

export const CATEGORY_LABEL_MAP: Record<number, string> = {
  1: "Vợt",
  2: "Cầu lông",
  3: "Giày",
  4: "Trang phục",
  5: "Balo",
};

export const CATEGORY_OPTIONS: { label: string; value?: number }[] = [
  { label: "Tất cả", value: undefined },
  { label: CATEGORY_LABEL_MAP[1], value: 1 },
  { label: CATEGORY_LABEL_MAP[2], value: 2 },
  { label: CATEGORY_LABEL_MAP[3], value: 3 },
  { label: CATEGORY_LABEL_MAP[4], value: 4 },
  { label: CATEGORY_LABEL_MAP[5], value: 5 },
];

export const BRAND_OPTIONS: { label: string; value?: string }[] = [
  { label: "Tất cả", value: undefined },
  { label: "Yonex", value: "Yonex" },
  { label: "Lining", value: "Lining" },
  { label: "Victor", value: "Victor" },
  { label: "Adidas", value: "Adidas" },
];

export const formatPrice = (value: number) =>
  value.toLocaleString("vi-VN", { style: "currency", currency: "VND" });
