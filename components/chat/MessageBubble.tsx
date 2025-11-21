import React from 'react';
import { Pressable, StyleSheet, View, ViewStyle } from 'react-native';
import { useTheme } from '../../styles/theme';

export enum MessageBubbleType {
    USER = 'USER',
    ASSISTANT = 'ASSISTANT',
    SYSTEM = 'SYSTEM',
    ASSISTANT_SUGGESTION = 'ASSISTANT_SUGGESTION',
}

type MessageBubbleProps = {
    children: React.ReactNode;
    onPress?: () => void;
    type: MessageBubbleType;
};

export default function MessageBubble({ children, onPress, type }: MessageBubbleProps) {
    const theme = useTheme();

    const bubbleStyle: Record<MessageBubbleType, ViewStyle> = {
        [MessageBubbleType.USER]: {
            backgroundColor: theme.colors.userBubble,
            justifyContent: 'flex-end',
        },
        [MessageBubbleType.ASSISTANT]: {
            backgroundColor: theme.colors.assistantBubble,
            justifyContent: 'flex-start',
        },
        [MessageBubbleType.SYSTEM]: {
            backgroundColor: theme.colors.systemBubble,
            justifyContent: 'flex-start',
        },
        [MessageBubbleType.ASSISTANT_SUGGESTION]: {
            backgroundColor: theme.colors.background,
            borderColor: theme.colors.assistantSuggestionBubbleBorder,
            borderWidth: 1,
            justifyContent: 'flex-start',
        },
    };

    return (
        <View 
            style={[
                styles.container,
                { justifyContent: bubbleStyle[type].justifyContent }
            ]}
        >
            <Pressable
                onPress={onPress}
                disabled={!onPress}
                style={[
                    styles.bubble,
                    bubbleStyle[type]
                ]}
            >
                {children}
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        marginVertical: 4,
    },
    bubble: {
        maxWidth: '80%',
        padding: 12,
        borderRadius: 16,
    }
});