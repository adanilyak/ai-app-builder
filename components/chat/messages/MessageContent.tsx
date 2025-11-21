import { useTheme } from '@/styles/theme';
import { TextStyle } from 'react-native';
import { MessageBubbleType } from '../MessageBubble';
import LoadingMessageContent from './LoadingMessageContent';
import TextMessageContent from './TextMessageContent';

export enum MessageContentType {
    TEXT = 'TEXT',
    ARTIFACT = 'ARTIFACT',
    LOADING = 'LOADING',
}

export type UserMessageContentProps = {
    id: string;
    text: string;
    contentType: MessageContentType.TEXT;
    bubbleType: MessageBubbleType.USER;
};

export type AssistantMessageContentProps = {
    id: string;
    text: string;
    contentType: MessageContentType.ARTIFACT;
    bubbleType: MessageBubbleType.ASSISTANT;
};

export type LoadingMessageContentProps = {
    id: string;
    text: string;
    contentType: MessageContentType.LOADING;
    bubbleType: MessageBubbleType.SYSTEM;
}

export type MessageContentProps =
    | UserMessageContentProps
    | AssistantMessageContentProps
    | LoadingMessageContentProps;

export function MessageContent(message: MessageContentProps) {
    const theme = useTheme();

    const textStyles: Record<MessageBubbleType, TextStyle> = {
        [MessageBubbleType.USER]: { color: theme.colors.userBubbleText },
        [MessageBubbleType.ASSISTANT]: { color: theme.colors.assistantBubbleText },
        [MessageBubbleType.SYSTEM]: { color: theme.colors.systemBubbleText },
    };
    const textStyle = textStyles[message.bubbleType];
    
    switch (message.contentType) {
        case MessageContentType.TEXT:
            return <TextMessageContent text={message.text} textStyle={textStyle} />;

        case MessageContentType.ARTIFACT:
            return <TextMessageContent text={message.text} textStyle={textStyle} />;

        case MessageContentType.LOADING:
            return <LoadingMessageContent text={message.text} textStyle={textStyle} />;

        default:
            return null;
    }
}