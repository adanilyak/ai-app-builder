import { useDependencies } from '@/di/DependenciesContext';
import { AppGenerationRepositoryInterface } from '@/impl/repo/appGeneration/AppGenerationRepository';
import { AppGenerationResult } from '@/impl/repo/appGeneration/AppGenerationTypes';
import { ChatsRepositoryInterface } from '@/impl/repo/chats/ChatsRepository';
import { Chat, Message } from '@/impl/repo/chats/ChatTypes';
import React, { Dispatch, createContext, useContext, useReducer } from 'react';
import { LayoutAnimation } from 'react-native';
import { useHistory } from '../history/useHistory';
import { ChatState } from './ChatContextTypes';

export enum ActionType {
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
};

type Action =
    | { type: ActionType.SET_USER_INPUT; input: string }
    | { type: ActionType.SET_CHAT; chat: Chat }
    | { type: ActionType.SET_CONVERSATION; conversationId: string }
    | { type: ActionType.SET_CHAT_TITLE; title: string }
    | { type: ActionType.SET_MESSAGES; messages: Message[] }
    | { type: ActionType.START_GENERATING_RESPONSE; message: Message }
    | { type: ActionType.SUCCESS_GENERATING_RESPONSE; message: Message; suggestions: string[] }
    | { type: ActionType.ERROR_GENERATING_RESPONSE; error: string }
    | { type: ActionType.SELECT_MESSAGE_ARTIFACT; messageId: string }
    | { type: ActionType.RESET_CHAT };

const initialState: ChatState = {
    isGeneratingResponse: false,
    messages: [],
    currentSuggestions: [],
};

function reducer(state: ChatState, action: Action): ChatState {
    switch (action.type) {
        case ActionType.SET_USER_INPUT:
            return {
                ...state,
                currentUserInput: action.input,
            };

        case ActionType.SET_CHAT:
            return {
                ...state,
                chat: action.chat,
            };

        case ActionType.SET_CONVERSATION:
            if (!state.chat) return state;
            return {
                ...state,
                chat: {
                    ...state.chat,
                    conversationId: action.conversationId,
                },
            };

        case ActionType.SET_CHAT_TITLE:
            if (!state.chat) return state;
            return {
                ...state,
                chat: {
                    ...state.chat,
                    title: action.title,
                },
            };

        case ActionType.SET_MESSAGES:
            LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
            return {
                ...state,
                messages: action.messages,
            };

        case ActionType.START_GENERATING_RESPONSE:
            LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
            return {
                ...state,
                currentUserInput: undefined,
                isGeneratingResponse: true,
                messages: [action.message, ...state.messages],
                currentSuggestions: [],
            };

        case ActionType.SUCCESS_GENERATING_RESPONSE:
            LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
            return {
                ...state,
                isGeneratingResponse: false,
                messages: [action.message, ...state.messages],
                currentSuggestions: action.suggestions,
            };

        case ActionType.RESET_CHAT:
            return initialState;

        default:
            return state;
    }
};

type ContextValue = {
    state: ChatState;

    onOpenChat: (chatId?: string) => Promise<void>;
    onUserInputChange: (content: string) => void;
    onSendUserMessage: (message: string) => Promise<void>;
};

const ChatContext = createContext<ContextValue | undefined>(undefined);

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const [state, dispatch] = useReducer(reducer, initialState);
    const { selectChat } = useHistory();
    const { chatsRepository, appGenerationRepository } = useDependencies();

    const onOpenChat = async (chatId?: string) => {
        if (chatId && chatId === state.chat?.id) {
            return;
        }
        dispatch({ type: ActionType.RESET_CHAT });
        if (chatId) {
            await loadChat(chatsRepository, dispatch, chatId);
        }
    };

    const onUserInputChange = (content: string) => {
        dispatch({ type: ActionType.SET_USER_INPUT, input: content });
    };

    const onSendUserMessage = async (content: string) => {
        const chat = await createChatIfNeededAndSet(state, chatsRepository, dispatch);
        selectChat(chat.id);
        await sendUserMessage(chatsRepository, appGenerationRepository, dispatch, chat.id, content, chat.conversationId, chat.title);
    };

    const value: ContextValue = {
        state,

        onOpenChat,
        onUserInputChange,
        onSendUserMessage,
    };

    return (
        <ChatContext.Provider value={value}>
            {children}
        </ChatContext.Provider>
    );
};

export function useChatContext() {
    const context = useContext(ChatContext);
    if (!context) {
        throw new Error('useChat must be used within a ChatProvider');
    }
    return context;
}

async function loadChat(
    chatsRepository: ChatsRepositoryInterface,
    dispatch: Dispatch<Action>,
    chatId: string
): Promise<Chat> {
    const chat = await chatsRepository.getChat(chatId);
    if (!chat) {
        throw new Error('Chat not found');
    }
    dispatch({ type: ActionType.SET_CHAT, chat: chat });
    const messages = await chatsRepository.getMessages(chatId);
    dispatch({ type: ActionType.SET_MESSAGES, messages: messages });
    return chat;
}

async function createChatIfNeededAndSet(
    state: ChatState,
    chatsRepository: ChatsRepositoryInterface,
    dispatch: Dispatch<Action>
): Promise<Chat> {
    if (state.chat) {
        return state.chat;
    }
    const chat = await chatsRepository.createChat();
    dispatch({ type: ActionType.SET_CHAT, chat: chat });
    return chat;
}

async function createConversationIfNeededAndSet(
    chatsRepository: ChatsRepositoryInterface,
    appGenerationRepository: AppGenerationRepositoryInterface,
    dispatch: Dispatch<Action>,
    chatId: string,
    conversationId?: string,
): Promise<string> {
    if (conversationId) {
        return conversationId;
    }
    const newConversationId = await appGenerationRepository.createConversation();
    await chatsRepository.updateChatConversationId(chatId, newConversationId);
    dispatch({ type: ActionType.SET_CONVERSATION, conversationId: newConversationId });
    return newConversationId;
}

async function sendUserMessage(
    chatsRepository: ChatsRepositoryInterface,
    appGenerationRepository: AppGenerationRepositoryInterface,
    dispatch: Dispatch<Action>,
    chatId: string,
    content: string,
    conversationId?: string,
    chatTitle?: string,
): Promise<void> {
    const userMessage = await chatsRepository.createMessage(chatId, 'user', content);
    dispatch({ type: ActionType.START_GENERATING_RESPONSE, message: userMessage });
    const newConversationId = await createConversationIfNeededAndSet(chatsRepository, appGenerationRepository, dispatch, chatId, conversationId);
    const generationResult = await generateApp(chatsRepository, appGenerationRepository, dispatch, chatId, newConversationId, content);
    if (!chatTitle) {
        await chatsRepository.updateChatTitle(chatId, generationResult.title);
        dispatch({ type: ActionType.SET_CHAT_TITLE, title: generationResult.title });
    }
}

async function generateApp(
    chatsRepository: ChatsRepositoryInterface,
    appGenerationRepository: AppGenerationRepositoryInterface,
    dispatch: Dispatch<Action>,
    chatId: string,
    conversationId: string,
    content: string
): Promise<AppGenerationResult> {
    const generationResult = await appGenerationRepository.generateApp(conversationId, content);
    const assistantMessage = await chatsRepository.createMessage(
        chatId,
        'assistant',
        generationResult.text,
        generationResult.artifacts.map(artifact => ({
            id: artifact.id,
            kind: artifact.kind,
        }))
    );
    dispatch({ type: ActionType.SUCCESS_GENERATING_RESPONSE, message: assistantMessage, suggestions: generationResult.suggestions });
    return generationResult
}