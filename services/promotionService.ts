import { http } from "./http";

export function getPromotions(): Promise<any[]> {
    return http.get<any[]>('/promotions');
}