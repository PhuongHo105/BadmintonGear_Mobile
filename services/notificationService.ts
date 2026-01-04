import { http } from "./http";

export async function getNotifications(lang: string, id: string): Promise<any[]> {
    return http.get<any[]>(`/notifications?lang=${lang}&userid=${id}`);
}

export async function markAsRead(id: string): Promise<boolean> {
    return http.post<boolean>(`/notifications/mark-as-read/${id}`);
}

export async function markAllAsRead(id: string): Promise<boolean> {
    return http.post<boolean>(`/notifications/mark-all-read`, { userid: id });
}

export async function countUnreadNotifications(id: string): Promise<number> {
    return http.get<number>(`/notifications/unread-count?userid=${id}`);
}