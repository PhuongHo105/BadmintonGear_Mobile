import { http } from './http';

export type ID = string | number;

export type Product = {
    id: ID;
    name: string;
    price: number;
    quantity: number;
    [key: string]: any;
};

export async function getAllProducts(lang?: string): Promise<Product[]> {
    return await http.get<Product[]>('/products?languagecode=' + (lang || 'en'));
}

export async function getProductById(id: ID, lang?: string): Promise<Product> {
    return await http.get<Product>(`/products/${id}?languagecode=${lang || 'en'}`);
}

export async function getTopSellingProducts(month?: number, year?: number, lang?: string): Promise<Product[]> {
    const now = new Date();
    const m = month ?? now.getMonth() + 1;
    const y = year ?? now.getFullYear();
    return await http.get<Product[]>(`/products/best-sale/top5?month=${m}&year=${y}&lang=${lang || 'en'}`);
}

export async function getLowAndOutOfStockProducts(): Promise<Product[]> {
    const products = await http.get<Product[]>('/products');
    return products.filter((p) => (p as any).quantity <= 10);
}

export default {
    getAllProducts,
    getProductById,
    getTopSellingProducts,
    getLowAndOutOfStockProducts,
};