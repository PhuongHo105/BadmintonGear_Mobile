import { http } from "./http";

export function getPromotions(): Promise<any[]> {
    return http.get<any[]>('/promotions');
}

export function getMyVouchers(): Promise<any[]> {
    // Currently using the same endpoint, can be swapped for a specific user endpoint like '/promotions/me' later
    const voucher: Promise<any[]> = http.get<any[]>('/promotions');
    voucher.then((res) => {
        console.log(res);
    });
    return voucher;
}