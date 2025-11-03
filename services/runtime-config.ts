import Constants from "expo-constants";

// Prefer Expo public env (EXPO_PUBLIC_*), then NEXT_PUBLIC_*, then app.json extra
const ENV_API =
    process.env.EXPO_PUBLIC_API_URL ||
    process.env.API_URL;

// Read from Expo extra in app.json/app.config
// For SDK 49+, expoConfig is available; include fallbacks for manifests
const EXTRA_API = ((Constants.expoConfig?.extra as any)?.API_URL ??
    // Legacy manifest fallbacks
    (Constants as any)?.manifest2?.extra?.API_URL ??
    (Constants as any)?.manifest?.extra?.API_URL) as string | undefined;

export const API_URL: string = (ENV_API || EXTRA_API || "").toString();

export default {
    API_URL,
};
