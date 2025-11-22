import { useDependencies } from '@/di/DependenciesContext';
import React, { createContext, useContext, useReducer } from 'react';
import { useHistory } from '../history/useHistory';
import { chatActions } from './chatActions';
import { ChatState } from './ChatContextTypes';
import { createChatIfNeeded, loadChat, sendUserMessage as sendUserMessageOperation } from './chatOperations';
import { chatReducer, initialChatState } from './chatReducer';

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
    const [state, dispatch] = useReducer(chatReducer, initialChatState);
    const { selectChat } = useHistory();
    const { chatsRepository, appGenerationRepository } = useDependencies();

    const onOpenChat = async (chatId?: string) => {
        if (chatId && chatId === state.chat?.id) {
            return;
        }
        
        dispatch(chatActions.resetChat());
        
        if (chatId) {
            await loadChat(chatsRepository, dispatch, chatId);
        }
    };

    const onUserInputChange = (content: string) => {
        dispatch(chatActions.setUserInput(content));
    };

    const onSendUserMessage = async (content: string) => {
        const chat = await createChatIfNeeded(state, chatsRepository, dispatch);
        selectChat(chat.id);
        
        await sendUserMessageOperation(
            chatsRepository,
            appGenerationRepository,
            dispatch,
            chat.id,
            content,
            chat.conversationId,
            chat.title
        );
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
