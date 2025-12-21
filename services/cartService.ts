import AsyncStorage from '@react-native-async-storage/async-storage';
import { http } from './http';

export type ID = string | number;

export type CartItem = {
    productId: ID;
    quantity: number;
    price?: number;
    [key: string]: any;
};

export type Cart = {
    id?: ID;
    userId?: ID;
    items?: CartItem[];
    total?: number;
    [key: string]: any;
};

async function authHeaders(): Promise<Record<string, string>> {
    const token = await AsyncStorage.getItem('loginToken');
    return token ? { token } : {};
}

const getCartByUserID = async (id: ID): Promise<Cart> => {
    return await http.get<Cart>(`/carts/${id}`);
};

const addCart = async (cart: any): Promise<any> => {
    return await http.post<any>('/carts', cart);
};

const updateCart = async (id: ID, cart: Partial<Cart>): Promise<Cart> => {
    const headers = await authHeaders();
    return await http.put<Cart>(`/carts/${id}`, cart, headers);
};

const deleteCart = async (id: ID): Promise<void> => {
    const headers = await authHeaders();
    await http.delete<void>(`/carts/${id}`, headers);
};

const checkoutCart = async (cart: Partial<Cart>): Promise<any> => {
    const headers = await authHeaders();
    return await http.post<any>('/carts/checkout', cart, headers);
};

const createPayment = async (cart: Partial<Cart>): Promise<any> => {
    const headers = await authHeaders();
    return await http.post<any>('/payment/create-qr', cart, headers);
};

export { addCart, checkoutCart, createPayment, deleteCart, getCartByUserID, updateCart };

