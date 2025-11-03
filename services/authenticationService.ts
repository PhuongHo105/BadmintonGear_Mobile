import { http } from "./http";

export type LoginRequest = {
    username?: string;
    email?: string;
    password: string;
};

export type LoginResponse = {
    token?: string;
    user?: any;
    [key: string]: any;
};

export async function login(
    username: string,
    password: string
): Promise<LoginResponse> {
    const body: LoginRequest = { username: username, password: password };
    return await http.post<LoginResponse>("/users/login", body);
}

export default {
    login,
};
