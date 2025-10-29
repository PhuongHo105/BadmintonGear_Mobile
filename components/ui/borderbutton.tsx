import { Colors } from "@/constants/theme";
import { useColorScheme } from '@/hooks/use-color-scheme';
import { FC } from "react";
import { Pressable } from "react-native";
import { ThemedText } from "../themed-text";


type ColorScheme = "light" | "dark";

const BorderButton: FC<{ onPress: () => void; text: string }> = ({ onPress, text, }) => {
  const schemeRaw = useColorScheme();
  const scheme: ColorScheme = (schemeRaw ?? "light") as ColorScheme;
  const textColor: string = scheme === "light" ? Colors[scheme].text : Colors[scheme].tint;
  return (
    <Pressable
      onPress={onPress}
      style={{
        borderColor: "#C0C0C0",
        borderWidth: 1,
        paddingVertical: 15,
        borderRadius: 12,
        alignItems: "center",
      }}
    >
      <ThemedText style={{ color: textColor, fontSize: 16, fontWeight: "600" }}>
        {text}
      </ThemedText>
    </Pressable>
  );
};


export default BorderButton;
