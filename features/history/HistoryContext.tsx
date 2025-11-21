import { useDependencies } from "@/di/DependenciesContext";
import { ChatsRepositoryInterface } from "@/impl/repo/chats/ChatsRepository";
import { Chat } from "@/impl/repo/chats/ChatTypes";
import { createContext, Dispatch, useContext, useReducer } from "react";
import { HistoryState } from "./HistoryContextTypes";

export enum ActionType {
    SET_CHATS = 'SET_CHATS',
    SELECT_CHAT = 'SELECT_CHAT',
    DESELECT_CHAT = 'DESELECT_CHAT',
}

type Action = 
    | { type: ActionType.SET_CHATS; chats: Chat[] }
    | { type: ActionType.SELECT_CHAT; chatId: string }
    | { type: ActionType.DESELECT_CHAT };

const initialState: HistoryState = {
    chats: [],
}

function reducer(state: HistoryState, action: Action): HistoryState {
    switch (action.type) {
        case ActionType.SET_CHATS:
            return {
                ...state,
                chats: action.chats,
            };

        case ActionType.SELECT_CHAT:
            return {
                ...state,
                selectedChatId: action.chatId,
            };

        case ActionType.DESELECT_CHAT:
            return {
                ...state,
                selectedChatId: undefined,
            };

        default:
            return state;
    }
}

type ContextValue = {
    state: HistoryState;
    onAppear: () => void;
    selectChat: (chatId: string) => void;
    deselectChat: () => void;
}

const HistoryContext = createContext<ContextValue | undefined>(undefined);

export const HistoryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initialState);
    const { chatsRepository } = useDependencies();

    const onAppear = () => {
        fetchChats(chatsRepository, dispatch);
    }

    const selectChat = (chatId: string) => {
        dispatch({ type: ActionType.SELECT_CHAT, chatId });
    }

    const deselectChat = () => {
        dispatch({ type: ActionType.DESELECT_CHAT });
    }

    const value: ContextValue = {
        state,
        onAppear,
        selectChat,
        deselectChat,
    }

    return (
        <HistoryContext.Provider value={value}>
            {children}
        </HistoryContext.Provider>
    )
}

export function useHistoryContext() {
    const context = useContext(HistoryContext);
    if (!context) {
        throw new Error('useHistoryContext must be used within a HistoryProvider');
    }
    return context;
}

async function fetchChats(
    chatsRepository: ChatsRepositoryInterface,
    dispatch: Dispatch<Action>
) {
    const chats = await chatsRepository.getRecentChats();
    dispatch({ type: ActionType.SET_CHATS, chats });
}