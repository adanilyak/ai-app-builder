import { useHistory } from "@/features/history/useHistory";
import { useTheme } from "@/styles/theme";
import { DrawerContentComponentProps, useDrawerStatus } from "@react-navigation/drawer";
import { router } from "expo-router";
import { useEffect } from "react";
import { ViewStyle } from "react-native";
import HistoryList from "../history/HistoryList";
import { HistoryTopBar } from "../history/HistoryTopBar";
import ScreenView from "../layout/ScreenView";

export type HistoryDrawerContentProps = DrawerContentComponentProps & {
    style?: ViewStyle;
};

export default function HistoryDrawerContent({ navigation, style }: HistoryDrawerContentProps) {
    const drawerStatus = useDrawerStatus();
    const { chats, onAppear, selectChat, deselectChat } = useHistory();
    const theme = useTheme();
    
    useEffect(() => {
        if (drawerStatus === 'open') {
            onAppear();
        }
    }, [drawerStatus]);

    const navigateToChat = (chatId?: string) => {
        navigation.closeDrawer();
        if (chatId) {
            router.replace({ pathname: '/chat', params: { chatId } });
        } else {
            router.replace({ pathname: '/chat' });
        }
    }
    
    const onNewChat = () => {
        deselectChat();
        navigateToChat();
    }

    const onSelectChat = (chatId: string) => {
        selectChat(chatId);
        navigateToChat(chatId);
    }

    return (
        <ScreenView withHeader={false} style={{ backgroundColor: theme.colors.drawerBackground }}>
            <HistoryTopBar onNewChat={onNewChat} />  
            <HistoryList chats={chats} onSelectChat={onSelectChat} />
        </ScreenView>
    );
}