import { makeChatTitle } from "@/common/chat_title_formatter";
import { HistoryContentProps } from "@/components/history/HistoryContent";
import { Chat } from "@/impl/repo/chats/ChatTypes";
import { useHistoryContext } from "./HistoryContext";

export function useHistory() {
    const { state, onAppear, selectChat, deselectChat } = useHistoryContext();

    const chats = state.chats.map(chat => chatToHistoryContentProps(chat, state.selectedChatId));

    return {
        chats,
        
        onAppear,
        selectChat,
        deselectChat,
    };
}

function chatToHistoryContentProps(chat: Chat, selectedChatId?: string): HistoryContentProps {
    return {
        id: chat.id,
        title: makeChatTitle(chat),
        selected: selectedChatId === chat.id,
    };
}