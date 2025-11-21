import { DbClient } from "@/infra/db/DbClient";
import uuid from 'react-native-uuid';
import { DbArtifact, DbChat, DbChatSortDesc, DbMessage, DbMessageRole } from "./ChatDbTypes";

export interface ChatsStorageServiceInterface {
    createChat(conversationId?: string, title?: string): Promise<DbChat>;
    updateChat(chatId: string, conversationId?: string, title?: string): Promise<void>;
    getChat(id: string): Promise<DbChat | null>;
    getChats(sortDesc?: DbChatSortDesc): Promise<DbChat[]>
    getMessage(messageId: string): Promise<DbMessage | null>;
    getMessages(chatId: string): Promise<DbMessage[]>;
    createMessage(
        chatId: string,
        role: DbMessageRole,
        content: string,
        artifacts?: { id: string, kind: string }[]
    ): Promise<DbMessage>;
    getArtifacts(messageId: string): Promise<DbArtifact[]>;
}

export class ChatsStorageService implements ChatsStorageServiceInterface {
    constructor(private db: DbClient) { }

    async createChat(conversationId?: string, title?: string): Promise<DbChat> {
        const id = uuid.v4();
        const created_at = Date.now();
        const updated_at = created_at;
        const chat: DbChat = { id, conversation_id: conversationId, title, created_at, updated_at };
        await this.db.run(
            'INSERT INTO chats (id, conversation_id, title, created_at, updated_at) VALUES (?, ?, ?, ?, ?)',
            [id, conversationId ?? null, title ?? null, created_at, updated_at]
        );
        return chat;
    }

    async updateChat(chatId: string, conversationId?: string, title?: string): Promise<void> {
        const updated_at = Date.now();
        await this.db.run(
            'UPDATE chats SET conversation_id = ?, title = ?, updated_at = ? WHERE id = ?',
            [conversationId ?? null, title ?? null, updated_at, chatId]
        );
    }

    async getChat(id: string): Promise<DbChat | null> {
        return await this.db.get(
            'SELECT * FROM chats WHERE id = ?',
            [id]
        );
    }

    async getChats(sortDesc?: DbChatSortDesc): Promise<DbChat[]> {
        if (sortDesc) {
            return await this.db.all(
                `SELECT * FROM chats ORDER BY ${sortDesc.by} ${sortDesc.order}`
            );
        } else {
            return await this.db.all(
                'SELECT * FROM chats'
            );
        }
    }

    async getMessage(messageId: string): Promise<DbMessage | null> {
        return await this.db.get(
            'SELECT * FROM messages WHERE id = ?',
            [messageId]
        );
    }

    async getMessages(chatId: string): Promise<DbMessage[]> {
        return await this.db.all(
            'SELECT * FROM messages WHERE chat_id = ? ORDER BY created_at DESC',
            [chatId]
        );
    }

    async createMessage(
        chatId: string,
        role: DbMessageRole,
        content: string,
        artifacts?: { id: string, kind: string }[]
    ): Promise<DbMessage> {
        const id = uuid.v4();
        const now = Date.now();
        const has_artifacts = artifacts ? artifacts.length > 0 : false;
        const message: DbMessage = { id, chat_id: chatId, role, content, has_artifacts, created_at: now };
        await this.db.transaction(async (tx) => {
            await tx.run(
                'INSERT INTO messages (id, chat_id, role, content, has_artifacts, created_at) VALUES (?, ?, ?, ?, ?, ?)',
                [id, chatId, role, content, has_artifacts, now]
            );
            for (const artifact of artifacts ?? []) {
                await tx.run(
                    'INSERT INTO artifacts (id, kind, created_at) VALUES (?, ?, ?)',
                    [artifact.id, artifact.kind, now]
                );
                await tx.run(
                    'INSERT INTO message_artifacts (message_id, artifact_id) VALUES (?, ?)',
                    [id, artifact.id]
                );
            }
            await tx.run(
                'UPDATE chats SET updated_at = ? WHERE id = ?',
                [now, chatId]
            );
        });
        return message;
    }

    async getArtifacts(messageId: string): Promise<DbArtifact[]> {
        return await this.db.transaction(async (tx) => {
            const result = await tx.all<{ artifact_id: string }>(
                'SELECT artifact_id FROM message_artifacts WHERE message_id = ?',
                [messageId]
            );
            if (result.length === 0) {
                return [];
            }
            const artifactIds = result.map(item => item.artifact_id);
            const placeholders = artifactIds.map(() => '?').join(', ');
            return await tx.all<DbArtifact>(
                `SELECT * FROM artifacts WHERE id IN (${placeholders})`,
                artifactIds
            );
        });
    }
}

export async function createChatsStorageService(db: DbClient): Promise<ChatsStorageServiceInterface> {
    await db.transaction(async (tx) => {
        await tx.run(`
          CREATE TABLE IF NOT EXISTS chats (
            id                TEXT PRIMARY KEY,
            conversation_id   TEXT,
            title             TEXT,
            created_at        INTEGER NOT NULL,
            updated_at        INTEGER NOT NULL
          );
        `);

        await tx.run(`
          CREATE TABLE IF NOT EXISTS messages (
            id            TEXT PRIMARY KEY,
            chat_id       TEXT NOT NULL,
            role          TEXT NOT NULL,
            content       TEXT NOT NULL,
            has_artifacts BOOLEAN NOT NULL,
            created_at    INTEGER NOT NULL,
  
            FOREIGN KEY (chat_id)  REFERENCES chats(id) ON DELETE CASCADE
          );
        `);

        await tx.run(`
          CREATE INDEX IF NOT EXISTS idx_messages_chat_created
            ON messages (chat_id, created_at);
        `);

        await tx.run(`
          CREATE TABLE IF NOT EXISTS artifacts (
            id            TEXT PRIMARY KEY,
            kind          TEXT NOT NULL,
            created_at    INTEGER NOT NULL
          );
        `);

        await tx.run(`
          CREATE TABLE IF NOT EXISTS message_artifacts (
            message_id    TEXT NOT NULL,
            artifact_id   TEXT NOT NULL,
  
            PRIMARY KEY (message_id, artifact_id),
  
            FOREIGN KEY (message_id) REFERENCES messages(id)  ON DELETE CASCADE,
            FOREIGN KEY (artifact_id) REFERENCES artifacts(id) ON DELETE CASCADE
          );
        `);

        await tx.run(`
          CREATE INDEX IF NOT EXISTS idx_message_artifacts_msg
            ON message_artifacts (message_id);
        `);

        await tx.run(`
          CREATE INDEX IF NOT EXISTS idx_message_artifacts_art
            ON message_artifacts (artifact_id);
        `);
    });
    return new ChatsStorageService(db);
}