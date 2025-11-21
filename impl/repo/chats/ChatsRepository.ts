import { ArtifactMeta, Chat, createArtifactMetaFromDb, createChatFromDb, createMessageFromDb, Message, MessageRole } from "@/impl/repo/chats/ChatTypes";
import { ChatsStorageServiceInterface } from "@/impl/storage/chats/ChatsStortageService";

export interface ChatsRepositoryInterface {
    createChat(conversationId?: string, title?: string): Promise<Chat>;
    updateChat(chatId: string, conversationId?: string, title?: string): Promise<void>
    getChat(id: string): Promise<Chat | null>;
    getChats(): Promise<Chat[]>;
    getRecentChats(): Promise<Chat[]>;
    getMessage(messageId: string): Promise<Message | null>;
    getMessages(chatId: string): Promise<Message[]>;
    createMessage(
        chatId: string,
        role: MessageRole,
        content: string,
        artifacts?: { id: string, kind: string }[]
    ): Promise<Message>;
    getArtifacts(messageId: string): Promise<ArtifactMeta[]>;
}

export class ChatsRepository implements ChatsRepositoryInterface {
    constructor(private storage: ChatsStorageServiceInterface) { }

    async createChat(conversationId?: string, title?: string): Promise<Chat> {
        const chat = await this.storage.createChat(conversationId, title);
        return createChatFromDb(chat);
    }

    async updateChat(chatId: string, conversationId?: string, title?: string): Promise<void> {
        await this.storage.updateChat(chatId, conversationId, title);
    }

    async getChat(id: string): Promise<Chat | null> {
        const chat = await this.storage.getChat(id);
        if (!chat) return null;
        return createChatFromDb(chat);
    }

    async getChats(): Promise<Chat[]> {
        const chats = await this.storage.getChats();
        return chats.map(chat => createChatFromDb(chat));
    }

    async getRecentChats(): Promise<Chat[]> {
        const chats = await this.storage.getChats({ by: 'updated_at', order: 'DESC' });
        return chats.map(chat => createChatFromDb(chat));
    }

    async getMessage(messageId: string): Promise<Message | null> {
        const message = await this.storage.getMessage(messageId);
        if (!message) return null;
        return createMessageFromDb(message);
    }

    async getMessages(chatId: string): Promise<Message[]> {
        const messages = await this.storage.getMessages(chatId);
        return messages.map(message => createMessageFromDb(message));
    }

    async createMessage(
        chatId: string,
        role: MessageRole,
        content: string,
        artifacts?: { id: string, kind: string }[]
    ): Promise<Message> {
        const message = await this.storage.createMessage(
            chatId,
            role,
            content,
            artifacts?.map(artifact => ({
                id: artifact.id,
                kind: artifact.kind
            }))
        );
        return createMessageFromDb(message);
    }

    async getArtifacts(messageId: string): Promise<ArtifactMeta[]> {
        const artifacts = await this.storage.getArtifacts(messageId);
        return artifacts.map(artifact => createArtifactMetaFromDb(artifact));
    }
}