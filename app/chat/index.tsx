import Composer from '@/components/chat/Composer';
import { MessageContentProps, MessageContentType } from '@/components/chat/messages/MessageContent';
import MessagesList from '@/components/chat/MessagesList';
import ScreenView from '@/components/layout/ScreenView';
import { useChat } from '@/features/chat/useChat';
import { useTheme } from '@/styles/theme';
import { Ionicons } from '@expo/vector-icons';
import { DrawerActions } from '@react-navigation/native';
import { router, Stack, useLocalSearchParams, useNavigation } from 'expo-router';
import { TouchableOpacity } from 'react-native';

export default function ChatScreen() {
    const theme = useTheme();
    const navigation = useNavigation();
    const { chatId } = useLocalSearchParams<{ chatId?: string }>();

    const {
        title,
        isGeneratingResponse,
        currentUserInput,
        messages,
        onUserInputChange,
        onSendUserMessage,
    } = useChat(chatId as string);

    const onPress = (item: MessageContentProps) => {
        if (item.contentType === MessageContentType.ARTIFACT) {
            router.push({pathname: '/chat/preview', params: { messageId: item.id }});
        } else if (item.contentType === MessageContentType.SUGGESTION) {
            onSendUserMessage(item.text);
        }
    };

    return (
        <>
            <Stack.Screen
                options={{
                    title,
                    headerLeft: () => (
                        <TouchableOpacity
                            onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
                            style={{ paddingHorizontal: 12 }}
                        >
                            <Ionicons name="menu" size={24} color={theme.colors.text} />
                        </TouchableOpacity>
                    ),
                }}
            />
            <ScreenView>
                <MessagesList
                    messages={messages}
                    emptyPlaceholderText="Your prompts and generation results will appear here."
                    onPressItem={onPress}
                />
                <Composer
                    value={currentUserInput}
                    placeholder="Describe your idea..."
                    onChange={onUserInputChange}
                    onSend={async () => await onSendUserMessage(currentUserInput)}
                    disabled={isGeneratingResponse}
                />
            </ScreenView>
        </>
    );
}
