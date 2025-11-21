export type DbChat = {
    id: string;
    conversation_id?: string;
    title?: string;
    created_at: number;
    updated_at: number;
};

export type DbMessageRole = 'user' | 'assistant' | 'system';

export type DbMessage = {
    id: string;
    chat_id: string;
    role: DbMessageRole;
    content: string;
    has_artifacts: boolean;
    created_at: number;
};

export type DbArtifact = {
    id: string;
    kind: string;
    created_at: number;
};

export type DbMessageArtifact = {
    message_id: string;
    artifact_id: string;
};

export type DbChatSortBy = 'created_at' | 'updated_at';
export type DbChatSortDesc = {
    by: DbChatSortBy;
    order: DbSortOrder;
}

export type DbSortOrder = 'ASC' | 'DESC';