import AsyncStorage from '@react-native-async-storage/async-storage';
import { http } from './http';

export type ID = string | number;

export type Category = {
    id: ID;
    name: string;
    description?: string;
    [key: string]: any;
};

async function authHeaders(): Promise<Record<string, string>> {
    const token = await AsyncStorage.getItem('loginToken');
    return token ? { token } : {};
}

const getAllCategories = async (): Promise<Category[]> => {
    return await http.get<Category[]>('/categories');
};

const getCategoryById = async (id: ID): Promise<Category> => {
    return await http.get<Category>(`/categories/${id}`);
};

const updateCategory = async (id: ID, data: Partial<Category>): Promise<Category> => {
    const headers = await authHeaders();
    return await http.put<Category>(`/categories/${id}`, data, headers);
};

const addCategory = async (data: Partial<Category>): Promise<Category> => {
    const headers = await authHeaders();
    return await http.post<Category>('/categories', data, headers);
};

const deleteCategory = async (id: ID): Promise<void> => {
    const headers = await authHeaders();
    await http.delete<void>(`/categories/${id}`, headers);
};

export { addCategory, deleteCategory, getAllCategories, getCategoryById, updateCategory };
