import { http } from "./http";

export async function getOrderById(orderId: string): Promise<any | null> {
    try {
        return await http.get<any>(`/orders/${orderId}`);
    } catch {
        return null;
    }
}

export async function getOrderByUserId(userId: string): Promise<any[]> {
    try {
        return await http.get<any[]>(`/orders/user/${userId}`);
    } catch {
        return [];
    }
}

export async function getOrderDetails(orderId: string, language: string): Promise<any[]> {
    try {
        return await http.get<any[]>(`/orderdetails/${orderId}?lang=${language}`);
    } catch {
        return [];
    }
}

export async function cancelOrder(orderId: string): Promise<boolean> {
    try {
        const response = await http.put(`/orders/${orderId}`, { status: -1 });
        console.log('Cancel Order Response:', response);
        return true;
    } catch {
        return false;
    }
}