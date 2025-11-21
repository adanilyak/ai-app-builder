import React from 'react';
import { ActivityIndicator, StyleSheet, Text, TextStyle, View, ViewStyle } from 'react-native';
import { useTheme } from '../../../styles/theme';

type LoadingMessageContentProps = {
    text?: string;
    style?: ViewStyle;
    textStyle?: TextStyle;
    loaderSize?: number;
};

export default function LoadingMessageContent({
    text = 'Generating…',
    style,
    textStyle,
    loaderSize = 16,
}: LoadingMessageContentProps) {
    const theme = useTheme();

    return (
        <View style={[styles.container, style]}>
            <ActivityIndicator
                size={loaderSize}
                color={theme.colors.text}
                style={styles.loader}
            />
            <Text style={[styles.text, { color: theme.colors.text }, textStyle]}>
                {text}
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    loader: {
        marginRight: 8,
    },
    text: {
        fontSize: 15,
        lineHeight: 20,
    },
});