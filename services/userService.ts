import AsyncStorage from "@react-native-async-storage/async-storage";
import { http } from "./http";

export async function getUserById(id: number): Promise<any> {
    return await http.get<any>(`/users/${id}`);
}

export async function updateUserProfile(id: number, data: any): Promise<any> {
    return await http.put<any>(`/users/${id}`, data);
}

export async function forgotPassword(email: string): Promise<string> {
    return await http.post<string>('/users/forgotpass', { email });
}

export async function changePassword(oldPassword: string, newPassword: string): Promise<string> {
    const token = await AsyncStorage.getItem('loginToken');
    return await http.post<string>('users/changepass',
        {
            oldpass: oldPassword,
            newpass: newPassword,
            passagain: newPassword
        }, {
        "Content-Type": "application/json",
        "token": token ?? '',
    });
}