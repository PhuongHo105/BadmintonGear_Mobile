import { http } from "./http";

export async function getReviewByProductId(productId: number): Promise<any[]> {
    return await http.get<any[]>(`/reviews/${productId}`);
}

export async function submitReview(reviewData: {
    userid: number;
    rating: number;
    content: string;
    productid: number;
    orderid: number;
}) {
    return await http.post('/reviews', reviewData);
}