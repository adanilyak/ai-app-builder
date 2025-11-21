import { DbArtifact, DbChat, DbMessage } from "../../storage/chats/ChatDbTypes";

export type Chat = {
    id: string;
    conversationId?: string;
    title?: string;
    createdAt: Date;
    updatedAt: Date;
};

export type MessageRole = 'user' | 'assistant' | 'system';

export type Message = {
    id: string;
    chatId: string;
    role: MessageRole;
    content: string;
    hasArtifacts: boolean;
    createdAt: Date;
};

export type ArtifactMeta = {
    id: string;
    kind: string;
    createdAt: Date;
};

export function createChatFromDb(dbChat: DbChat): Chat {
    return {
        id: dbChat.id,
        conversationId: dbChat.conversation_id,
        title: dbChat.title,
        createdAt: new Date(dbChat.created_at),
        updatedAt: new Date(dbChat.updated_at),
    };
}

export function createMessageFromDb(dbMessage: DbMessage): Message {
    return {
        id: dbMessage.id,
        chatId: dbMessage.chat_id,
        role: dbMessage.role,
        content: dbMessage.content,
        hasArtifacts: dbMessage.has_artifacts,
        createdAt: new Date(dbMessage.created_at),
    };
}

export function createArtifactMetaFromDb(dbArtifact: DbArtifact): ArtifactMeta {
    return {
        id: dbArtifact.id,
        kind: dbArtifact.kind,
        createdAt: new Date(dbArtifact.created_at),
    };
}