import { Chat } from "@/impl/repo/chats/ChatTypes";

export function makeChatTitle(chat?: Chat): string {
    return chat
        ? (chat.title ?? `Chat (${formatShort(chat.updatedAt)})`)
        : 'New Chat';
}

function formatShort(date: Date): string {
    const time = new Intl.DateTimeFormat('de-DE', {
        hour: '2-digit',
        minute: '2-digit'
    }).format(date);

    const day = new Intl.DateTimeFormat('de-DE', {
        day: '2-digit',
        month: '2-digit',
        year: '2-digit'
    }).format(date);

    return `${time}, ${day}`;
}