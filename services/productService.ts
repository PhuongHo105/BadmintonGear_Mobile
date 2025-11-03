import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL, http } from './http';

export type ID = string | number;

export type Product = {
    id: ID;
    name: string;
    price: number;
    quantity: number;
    [key: string]: any;
};

async function authHeaders(): Promise<Record<string, string>> {
    const token = await AsyncStorage.getItem('loginToken');
    return token ? { token } : {};
}

export async function getAllProducts(): Promise<Product[]> {
    return await http.get<Product[]>('/products');
}

export async function getProductById(id: ID): Promise<Product> {
    return await http.get<Product>(`/products/${id}`);
}

export async function updateProduct(id: ID, data: Partial<Product>): Promise<Product> {
    const headers = await authHeaders();
    return await http.put<Product>(`/products/${id}`, data, headers);
}

export async function addProduct(data: Partial<Product>): Promise<Product> {
    const headers = await authHeaders();
    return await http.post<Product>('/products', data, headers);
}

export async function deleteProduct(id: ID): Promise<void> {
    const headers = await authHeaders();
    await http.delete<void>(`/products/${id}`, headers);
}

export async function uploadImage(uploadData: FormData): Promise<any> {
    const url = `${API_BASE_URL.replace(/\/$/, '')}/imgproduct/`;
    const res = await fetch(url, {
        method: 'POST',
        body: uploadData as any,
    });
    if (!res.ok) {
        const text = await res.text().catch(() => '');
        throw new Error(`Upload failed: ${res.status} ${text || res.statusText}`);
    }
    return await res.json();
}

export async function deleteImage(id: ID): Promise<void> {
    await http.delete<void>(`/imgproduct/${id}`);
}

export async function getTopSellingProducts(month?: number, year?: number): Promise<Product[]> {
    const now = new Date();
    const m = month ?? now.getMonth() + 1;
    const y = year ?? now.getFullYear();
    return await http.get<Product[]>(`/products/best-sale/top5?month=${m}&year=${y}`);
}

export async function getLowAndOutOfStockProducts(): Promise<Product[]> {
    const products = await http.get<Product[]>('/products');
    return products.filter((p) => (p as any).quantity <= 10);
}

export default {
    getAllProducts,
    getProductById,
    updateProduct,
    addProduct,
    deleteProduct,
    uploadImage,
    deleteImage,
    getTopSellingProducts,
    getLowAndOutOfStockProducts,
};