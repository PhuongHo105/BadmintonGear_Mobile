
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Feather } from '@expo/vector-icons';
import { FC, useState } from "react";
import { Pressable, StyleProp, StyleSheet, TextInput, ViewStyle } from "react-native";
import { ThemedView } from "./themed-view";

type PasswordInputProps = {
    placeholder?: string;
    placeholderTextColor?: string;
    borderColor?: string;
    textColor?: string;
    value?: string;
    onChangeText?: (text: string) => void;
    onChange?: (e: any) => void;
    style?: StyleProp<ViewStyle>;
};

const PasswordInput: FC<PasswordInputProps> = ({
    placeholder,
    placeholderTextColor,
    value,
    onChangeText,
    onChange,
    style,
}) => {
    const schemeRaw = useColorScheme();
    const scheme: keyof typeof Colors = (schemeRaw ?? 'light') as keyof typeof Colors;
    const textColor: string = Colors[scheme].text;
    const borderColor: string = Colors[scheme].border;
    const iconColor: string = Colors[scheme].icon;
    const [show, setShow] = useState(false);
    return (
        <ThemedView style={[styles.container, { borderColor: borderColor }, style]}>
            <TextInput
                secureTextEntry={!show}
                placeholder={placeholder}
                placeholderTextColor={placeholderTextColor ?? iconColor}
                value={value}
                onChangeText={onChangeText}
                onChange={onChange}
                style={{
                    flex: 1,
                    color: textColor,
                    fontSize: 18,
                }}
            />
            <Pressable onPress={() => setShow((v) => !v)} style={{ marginLeft: 8 }}>
                <Feather name={show ? 'eye' : 'eye-off'} size={20} color={iconColor} />
            </Pressable>
        </ThemedView>
    );
};
export default PasswordInput;

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 15,
        minHeight: 52,
        width: '100%',
    }
});