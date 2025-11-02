import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { FC } from "react";
import { Pressable, StyleProp, ViewStyle } from "react-native";
import { ThemedText } from "../themed-text";

type FullButtonProps = {
    onPress: () => void;
    text: string;
    style?: StyleProp<ViewStyle>;
};

const FullButton: FC<FullButtonProps> = ({ onPress, text, style }) => {
    const schemeRaw = useColorScheme();
    const scheme: keyof typeof Colors = (schemeRaw ?? "light") as keyof typeof Colors;
    const bgColor: string = scheme === "light" ? "#1C1B1B" : Colors[scheme].tint;

    return (
        <Pressable
            onPress={onPress}
            style={[
                {
                    backgroundColor: bgColor,
                    paddingVertical: 15,
                    borderRadius: 12,
                    alignItems: "center",
                },
                style,
            ]}
        >
            <ThemedText style={{ color: "#fff", fontSize: 16, fontWeight: "600" }}>
                {text}
            </ThemedText>
        </Pressable>
    );
};

export default FullButton;