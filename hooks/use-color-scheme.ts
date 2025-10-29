import { useThemePreference } from "@/app/providers/ThemePreferenceProvider";
import { useColorScheme as systemUseColorScheme } from "react-native";

/**
 * Returns the active color scheme. This prefers a user-set preference (light/dark/system)
 * persisted via ThemePreferenceProvider and falls back to the OS setting.
 */
export function useColorScheme() {
  const pref = useThemePreference();
  const system = systemUseColorScheme() ?? "light";

  if (!pref) return system;

  return pref.resolvedScheme;
}
