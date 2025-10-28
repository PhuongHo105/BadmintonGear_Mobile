import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Pressable } from 'react-native';
import BackIcon from './back-icon';

export default function GoBackButton(): React.ReactElement {
    const navigation = useNavigation();
    return (
        <Pressable onPress={() => navigation.goBack()}>
            <BackIcon width={40} height={40} />
        </Pressable>
    )
}