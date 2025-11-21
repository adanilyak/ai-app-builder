import { useTheme } from '@/styles/theme';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import IconButton from '../ui/IconButton';
import TextArea from '../ui/TextArea';

type ComposerProps = {
    value: string;
    placeholder: string;
    onChange: (t: string) => void;
    onSend: () => void;
    disabled?: boolean;
};

export default function Composer({
    value,
    placeholder,
    onChange,
    onSend,
    disabled,
}: ComposerProps) {
    const theme = useTheme();
    return (
        <View
            style={[styles.container, { opacity: disabled ? 0.4 : 1 }]}
        >
            <View style={styles.inputContainer}>
                <TextArea
                    value={value}
                    onChangeText={onChange}
                    placeholder={placeholder}
                    style={styles.input}
                    editable={!disabled}
                />
            </View>

            <IconButton
                icon={<Ionicons name="arrow-up" size={18} color={theme.colors.buttonText} />}
                onPress={onSend}
                disabled={disabled || !value.trim()}
                style={styles.button}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        paddingHorizontal: 16,
        paddingVertical: 8,
        alignItems: 'flex-end',
    },
    inputContainer: {
        flex: 1,
        marginRight: 12,
    },
    input: {
        minHeight: 60,
        maxHeight: 140,
        paddingVertical: 10,
    },
    button: {
        alignSelf: 'flex-end'
    },
});