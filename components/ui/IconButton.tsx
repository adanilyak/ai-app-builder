import React from 'react';
import { Pressable, ViewStyle } from 'react-native';
import { useTheme } from '../../styles/theme';

type IconButtonProps = {
    icon: React.ReactNode;
    onPress: () => void;
    disabled?: boolean;
    size?: number;
    style?: ViewStyle;
};

export default function IconButton({
    icon,
    onPress,
    disabled = false,
    size = 40,
    style,
}: IconButtonProps) {
    const theme = useTheme();

    const backgroundColor = disabled
        ? theme.colors.buttonDisabled
        : theme.colors.button;

    const pressedColor = theme.colors.buttonPressed;

    return (
        <Pressable
            onPress={onPress}
            disabled={disabled}
            style={({ pressed }) => [
                {
                    width: size,
                    height: size,
                    borderRadius: size / 2,
                    backgroundColor: pressed && !disabled ? pressedColor : backgroundColor,
                    alignItems: 'center',
                    justifyContent: 'center',
                },
                style,
            ]}
        >
            {icon}
        </Pressable>
    );
}