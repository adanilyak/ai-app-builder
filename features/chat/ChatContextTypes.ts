import { Chat, Message } from "@/impl/repo/chats/ChatTypes";

export type ChatState = {
    chat?: Chat;
    currentUserInput?: string;
    isGeneratingResponse: boolean;
    messages: Message[];
    currentSuggestions: string[];
    previewAppUri?: string,
    error?: string;
};