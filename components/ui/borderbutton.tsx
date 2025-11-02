import { Colors } from "@/constants/theme";
import { useColorScheme } from '@/hooks/use-color-scheme';
import { FC, ReactNode } from "react";
import { Pressable, StyleProp, View, ViewStyle } from "react-native";
import { ThemedText } from "../themed-text";


type ColorScheme = "light" | "dark";

type BorderButtonProps = {
  onPress: () => void;
  text: string;
  style?: StyleProp<ViewStyle>;
  icon?: ReactNode;
};

const BorderButton: FC<BorderButtonProps> = ({ onPress, text, style, icon }) => {
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
          justifyContent: "center",
          flexDirection: "row",
        },
        style,
      ]}
    >
      <ThemedText style={{ color: textColor, fontSize: 16, fontWeight: "600", marginRight: icon ? 8 : 0 }}>
        {text}
      </ThemedText>
      {icon ? <View>{icon}</View> : null}
    </Pressable>
  );
};


export default BorderButton;
