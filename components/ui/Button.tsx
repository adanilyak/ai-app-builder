import React from 'react';
import {
    ActivityIndicator,
    Pressable,
    StyleSheet,
    Text,
    TextStyle,
    ViewStyle,
} from 'react-native';
import { useTheme } from '../../styles/theme';

type ButtonProps = {
    title: string;
    onPress: () => void;
    loading?: boolean;
    disabled?: boolean;
    style?: ViewStyle;
    textStyle?: TextStyle;
};

export default function Button({
    title,
    onPress,
    loading = false,
    disabled = false,
    style,
    textStyle,
}: ButtonProps) {
    const theme = useTheme();
    const isDisabled = disabled || loading;

    return (
        <Pressable
            onPress={onPress}
            disabled={isDisabled}
            style={({ pressed }) => [
                styles.base,
                {
                    backgroundColor: isDisabled
                        ? theme.colors.buttonDisabled
                        : pressed
                            ? theme.colors.buttonPressed
                            : theme.colors.button,
                },
                style,
            ]}
        >
            {loading ? (
                <ActivityIndicator color={theme.colors.buttonText} />
            ) : (
                <Text style={[styles.title, { color: theme.colors.buttonText }, textStyle]}>
                    {title}
                </Text>
            )}
        </Pressable>
    );
}

const styles = StyleSheet.create({
    base: {
        paddingVertical: 14,
        paddingHorizontal: 16,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 13,
        fontWeight: '500',
    },
});