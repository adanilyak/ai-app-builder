import ScreenView from "@/components/layout/ScreenView";
import EmptyPlaceholder from "@/components/ui/EmptyPlaceholder";
import { usePreview } from "@/features/preview/usePreview";
import { useTheme } from "@/styles/theme";
import { Stack, useLocalSearchParams } from "expo-router";
import { ActivityIndicator } from "react-native";
import { WebView } from "react-native-webview";

export default function PreviewScreen() {
    const theme = useTheme();
    const { messageId } = useLocalSearchParams<{ messageId?: string }>();
    const { html, loading, error } = usePreview(messageId as string);

    return (
        <>
            <Stack.Screen
                options={{
                    title: 'Preview'
                }}
            />
            <ScreenView padded={false} fullScreen={true}>
                {loading ? (
                    <ActivityIndicator size="large" color={theme.colors.text} />
                ) : error ? (
                    <EmptyPlaceholder
                        text={"Failed to load preview"}
                    />
                ) : html ? (
                    <WebView
                        originWhitelist={['*']}
                        source={{ html: html || '' }}
                        style={{ flex: 1 }}
                    />
                ) : (
                    <EmptyPlaceholder
                        text={"No preview available"}
                    />
                )}
            </ScreenView>
        </>
    );
}