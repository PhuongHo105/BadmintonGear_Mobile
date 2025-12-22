import AsyncStorage from '@react-native-async-storage/async-storage';
import { http } from './http';

export type ID = string | number;

export type CartItem = {
    productId: ID;
    quantity: number;
    price?: number;
    [key: string]: any;
};

async function authHeaders(): Promise<Record<string, string>> {
    const token = await AsyncStorage.getItem('loginToken');
    return token ? { token } : {};
}

const getCartByUserID = async (id: ID): Promise<any> => {
    return await http.get<any>(`/carts/${id}`);
};

const addCart = async (cart: Partial<any>): Promise<any> => {
    return await http.post<any>('/carts', cart);
};

const updateCart = async (id: ID, cart: Partial<any>): Promise<any> => {
    return await http.put<any>(`/carts/${id}`, cart);
};

const deleteCart = async (id: number): Promise<string> => {
    return await http.delete<string>(`/carts/${id}`);
};

const checkoutCart = async (cart: Partial<any>): Promise<any> => {
    return await http.post<any>('/carts/checkout', cart);
};

const createPayment = async (cart: Partial<any>): Promise<any> => {
    const headers = await authHeaders();
    return await http.post<any>('/payment/create-qr', cart, headers);
};

export { addCart, checkoutCart, createPayment, deleteCart, getCartByUserID, updateCart };

