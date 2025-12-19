import { http } from "./http";

export async function getUserById(id: number): Promise<any> {
    return await http.get<any>(`/users/${id}`);
}

export async function updateUserProfile(id: number, data: any): Promise<any> {
    return await http.put<any>(`/users/${id}`, data);
}