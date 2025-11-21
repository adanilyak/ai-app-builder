import { useTheme } from '@/styles/theme';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

type EmptyPlaceholderProps = {
    text: string;
};

export default function EmptyPlaceholder({ text }: EmptyPlaceholderProps) {
    const theme = useTheme();

    return (
        <View style={styles.container}>
            <Text style={[styles.text, { color: theme.colors.textSecondary }]}>
                {text}
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingVertical: 24,
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        fontSize: 16,
        textAlign: 'center',
        opacity: 0.7,
    },
});