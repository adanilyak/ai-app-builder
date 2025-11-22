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
): Promise<Chat> {
    const chat = await chatsRepository.getChat(chatId);
    if (!chat) {
        throw new Error('Chat not found');
    }
    dispatch(chatActions.setChat(chat));
    
    const messages = await chatsRepository.getMessages(chatId);
    dispatch(chatActions.setMessages(messages));
    
    return chat;
}

export async function createChatIfNeeded(
    state: ChatState,
    chatsRepository: ChatsRepositoryInterface,
    dispatch: Dispatch<ChatAction>
): Promise<Chat> {
    if (state.chat) {
        return state.chat;
    }
    
    const chat = await chatsRepository.createChat();
    dispatch(chatActions.setChat(chat));
    
    return chat;
}

export async function createConversationIfNeeded(
    chatsRepository: ChatsRepositoryInterface,
    appGenerationRepository: AppGenerationRepositoryInterface,
    dispatch: Dispatch<ChatAction>,
    chatId: string,
    conversationId?: string,
): Promise<string> {
    if (conversationId) {
        return conversationId;
    }
    
    const newConversationId = await appGenerationRepository.createConversation();
    await chatsRepository.updateChatConversationId(chatId, newConversationId);
    dispatch(chatActions.setConversation(newConversationId));
    
    return newConversationId;
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
    // Create user message
    const userMessage = await chatsRepository.createMessage(chatId, 'user', content);
    dispatch(chatActions.startGeneratingResponse(userMessage));
    
    // Create conversation if needed
    const newConversationId = await createConversationIfNeeded(
        chatsRepository,
        appGenerationRepository,
        dispatch,
        chatId,
        conversationId
    );
    
    // Generate assistant response
    const generationResult = await generateAppResponse(
        chatsRepository,
        appGenerationRepository,
        dispatch,
        chatId,
        newConversationId,
        content
    );
    
    // Update chat title if not set
    if (!chatTitle) {
        await chatsRepository.updateChatTitle(chatId, generationResult.title);
        dispatch(chatActions.setChatTitle(generationResult.title));
    }
}

async function generateAppResponse(
    chatsRepository: ChatsRepositoryInterface,
    appGenerationRepository: AppGenerationRepositoryInterface,
    dispatch: Dispatch<ChatAction>,
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
    
    dispatch(chatActions.successGeneratingResponse(assistantMessage, generationResult.suggestions));
    
    return generationResult;
}
