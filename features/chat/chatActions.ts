import { Chat, Message } from '@/impl/repo/chats/ChatTypes';

export enum ChatActionType {
    SET_USER_INPUT = 'SET_USER_INPUT',
    SET_CHAT = 'SET_CHAT',
    SET_CONVERSATION = 'SET_CONVERSATION',
    SET_CHAT_TITLE = 'SET_CHAT_TITLE',
    SET_MESSAGES = 'SET_MESSAGES',
    START_GENERATING_RESPONSE = 'START_GENERATING_RESPONSE',
    SUCCESS_GENERATING_RESPONSE = 'SUCCESS_GENERATING_RESPONSE',
    ERROR_GENERATING_RESPONSE = 'ERROR_GENERATING_RESPONSE',
    SELECT_MESSAGE_ARTIFACT = 'SELECT_MESSAGE_ARTIFACTS',
    RESET_CHAT = 'RESET_CHAT',
}

export type ChatAction =
    | { type: ChatActionType.SET_USER_INPUT; input: string }
    | { type: ChatActionType.SET_CHAT; chat: Chat }
    | { type: ChatActionType.SET_CONVERSATION; conversationId: string }
    | { type: ChatActionType.SET_CHAT_TITLE; title: string }
    | { type: ChatActionType.SET_MESSAGES; messages: Message[] }
    | { type: ChatActionType.START_GENERATING_RESPONSE; message: Message }
    | { type: ChatActionType.SUCCESS_GENERATING_RESPONSE; message: Message; suggestions: string[] }
    | { type: ChatActionType.ERROR_GENERATING_RESPONSE; error: string }
    | { type: ChatActionType.SELECT_MESSAGE_ARTIFACT; messageId: string }
    | { type: ChatActionType.RESET_CHAT };

export const chatActions = {
    setUserInput: (input: string): ChatAction => ({
        type: ChatActionType.SET_USER_INPUT,
        input,
    }),

    setChat: (chat: Chat): ChatAction => ({
        type: ChatActionType.SET_CHAT,
        chat,
    }),

    setConversation: (conversationId: string): ChatAction => ({
        type: ChatActionType.SET_CONVERSATION,
        conversationId,
    }),

    setChatTitle: (title: string): ChatAction => ({
        type: ChatActionType.SET_CHAT_TITLE,
        title,
    }),

    setMessages: (messages: Message[]): ChatAction => ({
        type: ChatActionType.SET_MESSAGES,
        messages,
    }),

    startGeneratingResponse: (message: Message): ChatAction => ({
        type: ChatActionType.START_GENERATING_RESPONSE,
        message,
    }),

    successGeneratingResponse: (message: Message, suggestions: string[]): ChatAction => ({
        type: ChatActionType.SUCCESS_GENERATING_RESPONSE,
        message,
        suggestions,
    }),

    errorGeneratingResponse: (error: string): ChatAction => ({
        type: ChatActionType.ERROR_GENERATING_RESPONSE,
        error,
    }),

    selectMessageArtifact: (messageId: string): ChatAction => ({
        type: ChatActionType.SELECT_MESSAGE_ARTIFACT,
        messageId,
    }),

    resetChat: (): ChatAction => ({
        type: ChatActionType.RESET_CHAT,
    }),
};
