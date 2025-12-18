import { http } from "./http";

export async function getChatHistory(room: string): Promise<{
    from: 'user' | 'bot' | 'admin';
    text: string;
    data?: any;
}[]> {
    const response = await http.get(`/chats/${room}`);
    return response;
}

export async function chat(message: string): Promise<any> {
    const response = await http.post('/users/chatbot', { message });
    return response;
}