import { Colors } from '@/constants/theme'
import { Image } from 'expo-image'
import React, { FC } from 'react'
import { ColorSchemeName, ImageSourcePropType, Pressable, StyleSheet, useColorScheme } from 'react-native'
import { ThemedText } from '../themed-text'
import { ThemedView } from '../themed-view'
import { IconSymbol } from './icon-symbol'

type HeaderProps = {
    /** 'search' shows the search-header variant; omitted for normal header */
    mode?: 'search'
}

const Header: FC<HeaderProps> = ({ mode }) => {
    const schemeRaw = useColorScheme() as ColorSchemeName | null | undefined;
    const scheme: keyof typeof Colors = (schemeRaw ?? 'light') as keyof typeof Colors
    const iconColor: string = Colors[scheme].text
    const logoSource: ImageSourcePropType = scheme === 'dark'
        ? require('../../assets/images/logo/dark-logo.png')
        : require('../../assets/images/logo/light-logo.png')

    return (
        <ThemedView style={styles.headerContainer}>
            <ThemedView style={styles.logoContainer}>
                <Image source={logoSource} style={styles.logo} />
                <ThemedText type="title" style={[styles.title, { color: iconColor }]}>BadmintonGear</ThemedText>
            </ThemedView>

            {mode !== 'search' && (
                <ThemedView style={styles.rightContainer} >
                    <IconSymbol size={28} name="search.fill" color={iconColor} />
                    <Pressable onPress={() => undefined} style={{ marginLeft: 12 }}>
                        <Image source={require('../../assets/images/logo/light-logo.png')} style={styles.avatar} />
                    </Pressable>
                </ThemedView>
            )}

            {mode === 'search' && (
                <ThemedView>
                    <IconSymbol size={28} name="close" color={iconColor} />
                </ThemedView>
            )}
        </ThemedView>
    )
}

export default Header;

const styles = StyleSheet.create({
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },

    rightContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },

    logoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    logo: {
        height: 48,
        width: 48,
    },

    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginLeft: 8,
    },

    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
    },
})