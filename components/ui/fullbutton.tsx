import { Colors } from "@/constants/theme";
import { useColorScheme } from '@/hooks/use-color-scheme';
import { FC } from "react";
import { Pressable } from "react-native";
import { ThemedText } from "../themed-text";

const FullButton: FC<{ onPress: () => void, text: string }> = ({ onPress, text }) => {
    const schemeRaw = useColorScheme();
    const scheme: keyof typeof Colors = (schemeRaw ?? 'light') as keyof typeof Colors;
    const bgColor: string = scheme === 'light' ? "#1C1B1B" : Colors[scheme].tint;
    return (
        <Pressable onPress={onPress} style={{ backgroundColor: bgColor, paddingVertical: 15, borderRadius: 12, alignItems: 'center', width: '100%', marginTop: 20 }}>
            <ThemedText style={{ color: '#fff', fontSize: 16, fontWeight: '600' }}>{text}</ThemedText>
        </Pressable>
    );
}

export default FullButton;