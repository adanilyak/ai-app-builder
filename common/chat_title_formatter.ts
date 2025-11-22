import { Chat } from "@/impl/repo/chats/ChatTypes";

export function makeChatTitle(chat?: Chat): string {
    return chat?.title ?? 'New Chat';
}