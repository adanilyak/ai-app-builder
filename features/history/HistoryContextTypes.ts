import { Chat } from "@/impl/repo/chats/ChatTypes";

export type HistoryState = {
    chats: Chat[];
    selectedChatId?: string;
};