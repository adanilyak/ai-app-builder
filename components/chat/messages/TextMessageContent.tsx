import React from 'react';
import { StyleSheet, Text, TextStyle, View, ViewStyle } from 'react-native';
import { useTheme } from '../../../styles/theme';

type TextMessageContentProps = {
    text: string;
    style?: ViewStyle;
    textStyle?: TextStyle;
};

export default function TextMessageContent({
    text,
    style,
    textStyle,
}: TextMessageContentProps) {
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
        </View>
    );
}

const styles = StyleSheet.create({
    text: {
        fontSize: 15,
        lineHeight: 20,
    }
});