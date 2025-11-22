import { ChatState } from './ChatContextTypes';
import { ChatAction, ChatActionType } from './chatActions';

export const initialChatState: ChatState = {
    isGeneratingResponse: false,
    messages: [],
    currentSuggestions: [],
};

export function chatReducer(state: ChatState, action: ChatAction): ChatState {
    switch (action.type) {
        case ChatActionType.SET_USER_INPUT:
            return {
                ...state,
                currentUserInput: action.input,
            };

        case ChatActionType.SET_CHAT:
            return {
                ...state,
                chat: action.chat,
            };

        case ChatActionType.SET_CONVERSATION:
            if (!state.chat) return state;
            return {
                ...state,
                chat: {
                    ...state.chat,
                    conversationId: action.conversationId,
                },
            };

        case ChatActionType.SET_CHAT_TITLE:
            if (!state.chat) return state;
            return {
                ...state,
                chat: {
                    ...state.chat,
                    title: action.title,
                },
            };

        case ChatActionType.SET_MESSAGES:
            return {
                ...state,
                messages: action.messages,
            };

        case ChatActionType.START_GENERATING_RESPONSE:
            return {
                ...state,
                currentUserInput: undefined,
                isGeneratingResponse: true,
                messages: [action.message, ...state.messages],
                currentSuggestions: [],
            };

        case ChatActionType.SUCCESS_GENERATING_RESPONSE:
            return {
                ...state,
                isGeneratingResponse: false,
                messages: [action.message, ...state.messages],
                currentSuggestions: action.suggestions,
                error: undefined,
            };

        case ChatActionType.SET_ERROR:
            return {
                ...state,
                isGeneratingResponse: false,
                error: action.error,
            };

        case ChatActionType.CLEAR_ERROR:
            return {
                ...state,
                error: undefined,
            };

        case ChatActionType.RESET_CHAT:
            return initialChatState;

        default:
            return state;
    }
}
