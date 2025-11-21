import { useTheme } from "@/styles/theme";
import { StyleSheet, Text, View } from "react-native";

export type HistoryContentProps = {
    id: string;
    title: string;
    selected: boolean;
}

export function HistoryContent({ id, title, selected }: HistoryContentProps) {
    const theme = useTheme();
    const titleTextStyle = { color: theme.colors.text };
    const titleContainerStyle = selected ? { backgroundColor: theme.colors.selectedBackground } : {};
    return (
        <View style={[styles.titleContainer, titleContainerStyle]}>
            <Text numberOfLines={1} style={[styles.title, titleTextStyle]}>{title}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    titleContainer: {
        paddingVertical: 12,
        paddingHorizontal: 12,
        borderRadius: 16,
    },
    title: {
        fontSize: 15,
        fontWeight: '500',
        lineHeight: 20,
    }
})