import { http } from "./http";

export async function getNowFlashsales() {
    try {
        const response = await http.get('/flashsales');
        console.log('Fetched flashsales:', response);
        const res = response.filter((flashsale: any) => {
            const now = new Date();
            const startDate = new Date(flashsale.start);
            const endDate = new Date(flashsale.end);
            return now >= startDate && now <= endDate;
        });
        return res;
    }
    catch (error) {
        console.error('Error fetching flashsales:', error);
        throw error;
    }
}

export async function getFlashsaleDetailById(flashsaleid: number, language: string) {
    try {
        const response = await http.get(`/flashsaledetails/${flashsaleid}?lang=${language}`);
        return response;
    }
    catch (error) {
        console.error('Error fetching flashsale detail:', error);
        throw error;
    }
}