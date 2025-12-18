import { http } from "./http";

export type OrderDetail = {
    productId: string | number;
    name: string;
    image: any;
    discount?: number;
    quantity: number;
    price: number;
};

export type Order = {
    id: string | number;
    status: string;
    details: OrderDetail[];
    updatedAt: string;
};

// Example API method. Replace `/orders` with your actual endpoint.
export async function fetchOrders(): Promise<Order[]> {
    // If you have a base URL configured in http.ts, you can call relative path like '/orders'
    // For now, return an empty array or mock.
    try {
        return await http.get<Order[]>("/orders");
    } catch {
        return [];
    }
}
