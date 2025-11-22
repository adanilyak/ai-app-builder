import { AppGenerationRepositoryInterface } from '@/impl/repo/appGeneration/AppGenerationRepository';
import { AppGenerationResult } from '@/impl/repo/appGeneration/AppGenerationTypes';
import { ChatsRepositoryInterface } from '@/impl/repo/chats/ChatsRepository';
import { Chat } from '@/impl/repo/chats/ChatTypes';
import { Dispatch } from 'react';
import { ChatAction, chatActions } from './chatActions';
import { ChatState } from './ChatContextTypes';

export async function loadChat(
    chatsRepository: ChatsRepositoryInterface,
    dispatch: Dispatch<ChatAction>,
    chatId: string
): Promise<Chat | undefined> {
    try {
        dispatch(chatActions.clearError());
        
        const chat = await chatsRepository.getChat(chatId);
        if (!chat) {
            const error = 'Chat not found';
            dispatch(chatActions.setError(error));
            return;
        }
        
        dispatch(chatActions.setChat(chat));
        
        const messages = await chatsRepository.getMessages(chatId);
        dispatch(chatActions.setMessages(messages));
        
        return chat;
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to load chat';
        dispatch(chatActions.setError(errorMessage));
    }
}

export async function createChatIfNeeded(
    state: ChatState,
    chatsRepository: ChatsRepositoryInterface,
    dispatch: Dispatch<ChatAction>
): Promise<Chat | undefined> {
    try {
        if (state.chat) {
            return state.chat;
        }
        
        dispatch(chatActions.clearError());
        
        const chat = await chatsRepository.createChat();
        dispatch(chatActions.setChat(chat));
        
        return chat;
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to create chat';
        dispatch(chatActions.setError(errorMessage));
    }
}

export async function createConversationIfNeeded(
    chatsRepository: ChatsRepositoryInterface,
    appGenerationRepository: AppGenerationRepositoryInterface,
    dispatch: Dispatch<ChatAction>,
    chatId: string,
    conversationId?: string,
): Promise<string | undefined> {
    try {
        if (conversationId) {
            return conversationId;
        }
        
        const newConversationId = await appGenerationRepository.createConversation();
        await chatsRepository.updateChatConversationId(chatId, newConversationId);
        dispatch(chatActions.setConversation(newConversationId));
        
        return newConversationId;
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to create conversation';
        dispatch(chatActions.setError(errorMessage));
    }
}

export async function sendUserMessage(
    chatsRepository: ChatsRepositoryInterface,
    appGenerationRepository: AppGenerationRepositoryInterface,
    dispatch: Dispatch<ChatAction>,
    chatId: string,
    content: string,
    conversationId?: string,
    chatTitle?: string,
): Promise<void> {
    try {
        dispatch(chatActions.clearError());
        
        const userMessage = await chatsRepository.createMessage(chatId, 'user', content);
        dispatch(chatActions.startGeneratingResponse(userMessage));
        
        const newConversationId = await createConversationIfNeeded(
            chatsRepository,
            appGenerationRepository,
            dispatch,
            chatId,
            conversationId
        );
        
        if (!newConversationId) {
            return;
        }
        
        const generationResult = await generateAppResponse(
            chatsRepository,
            appGenerationRepository,
            dispatch,
            chatId,
            newConversationId,
            content
        );
        
        if (!chatTitle && generationResult) {
            await chatsRepository.updateChatTitle(chatId, generationResult.title);
            dispatch(chatActions.setChatTitle(generationResult.title));
        }
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to send message';
        dispatch(chatActions.setError(errorMessage));
    }
}

async function generateAppResponse(
    chatsRepository: ChatsRepositoryInterface,
    appGenerationRepository: AppGenerationRepositoryInterface,
    dispatch: Dispatch<ChatAction>,
    chatId: string,
    conversationId: string,
    content: string
): Promise<AppGenerationResult | undefined> {
    try {
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
        
        dispatch(chatActions.successGeneratingResponse(assistantMessage, generationResult.suggestions));
        
        return generationResult;
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to generate app response';
        dispatch(chatActions.setError(errorMessage));
    }
}
