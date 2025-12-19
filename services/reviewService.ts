import { http } from "./http";

export async function getReviewByProductId(productId: number): Promise<any[]> {
    return await http.get<any[]>(`/reviews/${productId}`);
}