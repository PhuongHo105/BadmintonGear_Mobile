// HTTP helper for API requests with timeout and JSON parsing
import { API_URL } from "./runtime-config";

export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export type HttpOptions = {
    method?: HttpMethod;
    headers?: Record<string, string>;
    body?: any;
    timeoutMs?: number;
};

const DEFAULT_TIMEOUT = 15000; // 15s

// If url is absolute (starts with http), use as-is; else prefix with base URL
export const API_BASE_URL = (API_URL || "") as string; // Set via .env or app.json extra

function withTimeout<T>(promise: Promise<T>, timeoutMs: number): Promise<T> {
    return new Promise((resolve, reject) => {
        const id = setTimeout(
            () => reject(new Error("Request timed out")),
            timeoutMs
        );
        promise
            .then((res) => {
                clearTimeout(id);
                resolve(res);
            })
            .catch((err) => {
                clearTimeout(id);
                reject(err);
            });
    });
}

function buildUrl(url: string): string {
    if (/^https?:\/\//i.test(url)) return url;
    const base = API_BASE_URL?.replace(/\/$/, "") ?? "";
    if (!base) {
        throw new Error(
            `API_BASE_URL is not set. For relative path "${url}", configure EXPO_PUBLIC_API_URL in .env (or extra.API_URL in app.json).`
        );
    }
    const path = url.replace(/^\//, "");
    return `${base}/${path}`.replace(/\/+/, "/");
}

function buildHeaders(
    headers?: Record<string, string>
): Record<string, string> {
    return {
        Accept: "application/json",
        "Content-Type": "application/json",
        ...headers,
    };
}

export async function request<T = any>(
    url: string,
    opts: HttpOptions = {}
): Promise<T> {
    const { method = "GET", headers, body, timeoutMs = DEFAULT_TIMEOUT } = opts;

    const finalUrl = buildUrl(url);
    if (typeof __DEV__ !== 'undefined' && __DEV__) {
        console.log(`[http] ${method} ${finalUrl}`);
    }
    const init: RequestInit = {
        method,
        headers: buildHeaders(headers),
    } as RequestInit;

    if (body !== undefined && body !== null) {
        init.body = typeof body === "string" ? body : JSON.stringify(body);
    }

    const res = await withTimeout(fetch(finalUrl, init), timeoutMs);

    // Handle HTTP errors
    if (!res.ok) {
        const text = await res.text().catch(() => "");
        const err = new Error(
            `HTTP ${res.status}: ${text || res.statusText}`
        ) as any;
        err.status = res.status;
        err.url = finalUrl;
        throw err;
    }

    // Try to parse JSON; fall back to text
    const contentType = res.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
        return (await res.json()) as T;
    }
    const text = await res.text();
    try {
        return JSON.parse(text) as T;
    } catch {
        return text as unknown as T;
    }
}

export const http = {
    get: <T = any>(
        url: string,
        headers?: Record<string, string>,
        timeoutMs?: number
    ) => request<T>(url, { method: "GET", headers, timeoutMs }),
    post: <T = any>(
        url: string,
        body?: any,
        headers?: Record<string, string>,
        timeoutMs?: number
    ) => request<T>(url, { method: "POST", body, headers, timeoutMs }),
    put: <T = any>(
        url: string,
        body?: any,
        headers?: Record<string, string>,
        timeoutMs?: number
    ) => request<T>(url, { method: "PUT", body, headers, timeoutMs }),
    patch: <T = any>(
        url: string,
        body?: any,
        headers?: Record<string, string>,
        timeoutMs?: number
    ) => request<T>(url, { method: "PATCH", body, headers, timeoutMs }),
    delete: <T = any>(
        url: string,
        headers?: Record<string, string>,
        timeoutMs?: number
    ) => request<T>(url, { method: "DELETE", headers, timeoutMs }),
};
