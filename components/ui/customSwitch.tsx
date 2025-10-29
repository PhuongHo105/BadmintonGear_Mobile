import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Feather } from "@expo/vector-icons";
import { ColorSchemeName, StyleSheet, Switch, View } from "react-native";
import { ThemedText } from "../themed-text";

interface SwitchItemProps {
    icon: string;
    name: string;
    value: boolean;
    onValueChange: (v: boolean) => void;
}
const CustomSwitch: React.FC<SwitchItemProps> = ({ icon, name, value, onValueChange }) => {
    const schemeRaw = useColorScheme() as ColorSchemeName | null | undefined;
    const scheme: keyof typeof Colors = (schemeRaw ?? 'light') as keyof typeof Colors
    const tint: string = Colors[scheme].tint;
    const iconColor: string = Colors[scheme].secondaryText;
    const borderColor: string = Colors[scheme].border;
    return (
        <View style={styles.menuItem}>
            <Feather name={icon as any} size={22} color={iconColor} />
            <ThemedText style={[styles.menuItemText, { color: iconColor, borderBottomColor: borderColor }]}>{name}</ThemedText>
            <Switch
                trackColor={{ false: '#767577', true: borderColor }}
                thumbColor={value ? tint : '#f4f3f4'}
                onValueChange={onValueChange}
                value={value}
            />
        </View>
    );
};

export default CustomSwitch;

const styles = StyleSheet.create({
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 15,
        borderBottomWidth: 1,
    },
    menuItemText: {
        flex: 1,
        marginLeft: 15,
        fontSize: 16,
    },
});