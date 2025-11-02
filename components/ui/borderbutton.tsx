import { Colors } from "@/constants/theme";
import { useColorScheme } from '@/hooks/use-color-scheme';
import { FC } from "react";
import { Pressable, StyleProp, ViewStyle } from "react-native";
import { ThemedText } from "../themed-text";


type ColorScheme = "light" | "dark";

type BorderButtonProps = {
  onPress: () => void;
  text: string;
  style?: StyleProp<ViewStyle>;
};

const BorderButton: FC<BorderButtonProps> = ({ onPress, text, style }) => {
  const schemeRaw = useColorScheme();
  const scheme: ColorScheme = (schemeRaw ?? "light") as ColorScheme;
  const textColor: string = Colors[scheme].text;
  const borderColor: string = scheme === "light" ? Colors[scheme].border : Colors[scheme].border;
  return (
    <Pressable
      onPress={onPress}
      style={[
        {
          borderColor: borderColor,
          borderWidth: 1,
          paddingVertical: 15,
          borderRadius: 12,
          alignItems: "center",
        },
        style,
      ]}
    >
      <ThemedText style={{ color: textColor, fontSize: 16, fontWeight: "600" }}>
        {text}
      </ThemedText>
    </Pressable>
  );
};


export default BorderButton;
