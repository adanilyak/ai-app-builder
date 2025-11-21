import { makeChatTitle } from "@/common/chat_title_formatter";
import { MessageBubbleType } from "@/components/chat/MessageBubble";
import { MessageContentProps, MessageContentType } from "@/components/chat/messages/MessageContent";
import { Message } from "@/impl/repo/chats/ChatTypes";
import { useEffect } from "react";
import { useChatContext } from "./ChatContext";

export function useChat(selectedChatId?: string) {
    const { state, onOpenChat, onUserInputChange, onSendUserMessage } = useChatContext();

    useEffect(() => {
        onOpenChat(selectedChatId);
    }, [selectedChatId]);

    const title = makeChatTitle(state.chat);

    const currentUserInput = (state.currentUserInput || '');

    const messages = state.messages.map(messageToMessageContentProps);
    if (state.isGeneratingResponse) {
        messages.unshift(systemGeneratingMessageContentProps());
    }
    if (state.currentSuggestions.length > 0) {
        state.currentSuggestions.forEach((suggestion, index) => {
            messages.unshift(assistantSuggestionMessageContentProps(suggestion, String(index)));
        });
    }

    return {
        title,
        isGeneratingResponse: state.isGeneratingResponse,
        currentUserInput,
        messages,

        // Actions
        onUserInputChange,
        onSendUserMessage,
    };
}

function messageToMessageContentProps(
    message: Message
): MessageContentProps {
    if (message.role == 'user') {
        return {
            id: message.id,
            text: message.content,
            contentType: MessageContentType.TEXT,
            bubbleType: MessageBubbleType.USER,
        };
    } else if (message.role == 'assistant') {
        return {
            id: message.id,
            text: message.content,
            contentType: MessageContentType.ARTIFACT,
            bubbleType: MessageBubbleType.ASSISTANT,
        };
    } else {
        throw new Error('Invalid message role');
    }
}

function systemGeneratingMessageContentProps(): MessageContentProps {
    return {
        id: 'system-generating-message',
        text: 'Generating app...',
        contentType: MessageContentType.LOADING,
        bubbleType: MessageBubbleType.SYSTEM,
    };
}

function assistantSuggestionMessageContentProps(suggestion: string, id: string): MessageContentProps {
    return {
        id: 'assistant-suggestion-message-' + id,
        text: suggestion,
        contentType: MessageContentType.SUGGESTION,
        bubbleType: MessageBubbleType.ASSISTANT_SUGGESTION,
    };
}