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

export async function register(
    name: string,
    username: string,
    email: string,
    phone: string,
    password: string
): Promise<boolean> {
    const body = {
        name: name,
        username: username,
        password: password,
        email: email,
        phonenumber: phone,
        roleid: 1
    }
    const response = await http.post<any>("/users", body);
    console.log('Register response:', response);
    return response.id !== undefined;
}
