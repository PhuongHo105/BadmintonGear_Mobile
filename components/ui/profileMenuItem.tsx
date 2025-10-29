import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { ColorSchemeName, StyleSheet, TouchableOpacity } from "react-native";
import { ThemedText } from "../themed-text";

type IconPack = 'Feather' | 'Material' | 'Ionicons';
interface ProfileMenuItemProps {
    icon: string;
    name: string;
    onPress?: () => void;
    iconPack?: IconPack;
}
const ProfileMenuItem: React.FC<ProfileMenuItemProps> = ({ icon, name, onPress, iconPack = 'Feather' }) => {
    const schemeRaw = useColorScheme() as ColorSchemeName | null | undefined;
    const scheme: keyof typeof Colors = (schemeRaw ?? 'light') as keyof typeof Colors
    const secondaryText: string = Colors[scheme].secondaryText;
    const borderColor: string = Colors[scheme].border;
    const IconComponent = iconPack === 'Material' ? MaterialCommunityIcons : Feather;
    return (
        <TouchableOpacity style={[styles.menuItem, { borderBottomColor: borderColor }]} onPress={onPress}>
            <IconComponent name={icon as any} size={22} color={secondaryText} />
            <ThemedText style={[styles.menuItemText, { color: secondaryText }]}>{name}</ThemedText>
            <Feather name="chevron-right" size={20} color={secondaryText} />
        </TouchableOpacity>
    );
};
export default ProfileMenuItem;
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