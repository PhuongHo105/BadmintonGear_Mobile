/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from "react-native";

const tintColorLight = "#E06666";
const tintColorDark = "#E06666";

export const Colors = {
  light: {
    text: "#1C1B1B",
    secondaryText: "#444",
    background: "#fff",
    tint: tintColorLight,
    icon: "#6F7384",
    tabIconDefault: "#6F7384",
    tabIconSelected: tintColorLight,
    border: "#F4F5FD",
    modalBackground: "#fff",
    modalOverlay: "rgba(0, 0, 0, 0.5)",
    tabBackground: "#F4F5FD",
    tabButtonBG: "#000",
    activeTabText: "#fff",
  },
  dark: {
    text: "#fff",
    secondaryText: "#C0C0C0",
    background: "#000000",
    tint: tintColorDark,
    icon: "#6F7384",
    tabIconDefault: "#9BA1A6",
    tabIconSelected: tintColorDark,
    border: "#1C1B1B",
    modalBackground: "#000",
    modalOverlay: "rgba(41, 41, 41, 0.5)",
    tabBackground: "#1C1B1B",
    tabButtonBG: tintColorDark,
    activeTabText: "#fff",
  },
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: "system-ui",
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: "ui-serif",
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: "ui-rounded",
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: "ui-monospace",
  },
  default: {
    sans: "normal",
    serif: "serif",
    rounded: "normal",
    mono: "monospace",
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded:
      "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
