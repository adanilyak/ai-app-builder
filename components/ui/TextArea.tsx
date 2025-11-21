import { useTheme } from '@/styles/theme';
import React from 'react';
import { StyleSheet, TextInput } from 'react-native';

type TextAreaProps = React.ComponentProps<typeof TextInput>;

export default function TextArea(props: TextAreaProps) {
    const theme = useTheme();

    return (
        <TextInput
            {...props}
            multiline
            textAlignVertical="top"
            style={[
                styles.area,
                {
                    backgroundColor: theme.colors.inputBackground,
                    color: theme.colors.text,
                    borderColor: theme.colors.inputBorder,
                },
                props.style,
            ]}
            placeholderTextColor={theme.colors.inputPlaceholder}
        />
    );
}

const styles = StyleSheet.create({
    area: {
        minHeight: 120,
        borderWidth: 1,
        borderRadius: 16,
        padding: 12,
        fontSize: 16,
    },
});