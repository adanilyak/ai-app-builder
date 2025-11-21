import React from 'react';
import { FlatList, StyleSheet, ViewStyle } from 'react-native';
import EmptyPlaceholder from '../ui/EmptyPlaceholder';
import MessageBubble from './MessageBubble';
import { MessageContent, MessageContentProps } from './messages/MessageContent';


type MessagesListProps = {
    messages: MessageContentProps[];
    emptyPlaceholderText: string;
    onPressItem: (item: MessageContentProps) => void;
    style?: ViewStyle;
};

export default function MessagesList({ 
    messages,
    emptyPlaceholderText,
    onPressItem,
    style,
}: MessagesListProps) {
    return (
        <FlatList
            contentInsetAdjustmentBehavior="never"
            style={[styles.list, style]}
            data={messages}
            keyExtractor={(item) => String(item.id)}
            renderItem={({ item }) => (
                <MessageBubble
                    type={item.bubbleType}
                    onPress={() => onPressItem(item)}
                >
                    <MessageContent {...item} />
                </MessageBubble>
            )}
            ListEmptyComponent={<EmptyPlaceholder text={emptyPlaceholderText} />}
            inverted={messages.length > 0}
            contentContainerStyle={messages.length > 0 ? styles.contentContainer : styles.emptyContentContainer}
        />
    );
}

const styles = StyleSheet.create({
    list: {
        flex: 1,
    },
    contentContainer: {
        paddingHorizontal: 16,
        paddingVertical: 8,
    },
    emptyContentContainer: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        flex: 1,
        justifyContent: 'center',
    },
});