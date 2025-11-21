import React from 'react';
import { StyleSheet, Text, TextStyle, View, ViewStyle } from 'react-native';
import { useTheme } from '../../../styles/theme';

type AppMessageContentProps = {
    text: string;
    style?: ViewStyle;
    textStyle?: TextStyle;
};

export default function AppMessageContent({
    text,
    style,
    textStyle,
}: AppMessageContentProps) {
    const theme = useTheme();

    return (
        <View style={style}>
            <Text
                style={[
                    styles.text,
                    { color: theme.colors.text },
                    textStyle,
                ]}
            >
                {text}
            </Text>
            <Text
                style={[
                    styles.link,
                    { color: theme.colors.tint },
                ]}
            >
                Show app preview
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    text: {
        fontSize: 15,
        lineHeight: 20,
    },
    link: {
        paddingTop: 8,
        textAlign: 'center',
        fontSize: 15,
        fontWeight: '500',
        lineHeight: 20,
    }
});