import { useColorScheme } from '@/hooks/use-color-scheme';
import React from 'react';
import Svg, { ClipPath, Defs, G, Path, Rect } from 'react-native-svg';

type Props = {
    width?: number;
    height?: number;
    color?: string;
};

export default function OtherIcon({ width = 32, height = 28, color }: Props) {
    const scheme = useColorScheme() ?? 'light';
    const fillColor = color ?? (scheme === 'dark' ? '#ffffff' : '#000000');

    return (
        <Svg width={width} height={height} viewBox="0 0 38 38" fill="none" >
            <G clipPath="url(#clip0_655_13009)">
                <Path d="M31.6667 9.5H6.33341C4.58451 9.5 3.16675 10.9178 3.16675 12.6667V25.3333C3.16675 27.0822 4.58451 28.5 6.33341 28.5H31.6667C33.4156 28.5 34.8334 27.0822 34.8334 25.3333V12.6667C34.8334 10.9178 33.4156 9.5 31.6667 9.5Z" stroke={fillColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <Path d="M9.5 19H15.8333M12.6667 15.8334V22.1667" stroke={fillColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <Path d="M23.75 17.4166V17.433" stroke={fillColor} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                <Path d="M28.5 20.5833V20.5997" stroke={fillColor} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            </G>
            <Defs>
                <ClipPath id="clip0_655_13009">
                    <Rect width={width} height={height} fill={fillColor} />
                </ClipPath>
            </Defs>
        </Svg>
    )
}
