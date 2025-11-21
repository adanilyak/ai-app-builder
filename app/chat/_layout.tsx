import { ChatProvider } from '@/features/chat/ChatContext';
import { useTheme } from '@/styles/theme';
import { Stack } from 'expo-router';

export default function ChatLayout() {
    const theme = useTheme();
    return (
        <ChatProvider>
            <Stack
                screenOptions={{
                    headerStyle: {
                        backgroundColor: theme.colors.background
                    },
                    headerTintColor: theme.colors.text
                }}
            />
        </ChatProvider>
    );
}