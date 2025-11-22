import { FlatList, Pressable, StyleSheet } from "react-native";
import { HistoryContent, HistoryContentProps } from "./HistoryContent";

type HistoryListProps = {
    chats: HistoryContentProps[];
    onSelectChat: (chatId: string) => void;
};

export default function HistoryList({ chats, onSelectChat }: HistoryListProps) {
    return (
        <FlatList
            style={styles.list}
            contentContainerStyle={styles.contentContainer}
            data={chats}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
                <Pressable onPress={() => onSelectChat(item.id)} style={styles.itemContainer}>
                    <HistoryContent {...item} />
                </Pressable>
            )}
        />
    );
}

const styles = StyleSheet.create({
    list: {
        flex: 1,
    },
    contentContainer: {
        paddingHorizontal: 16,
        paddingVertical: 8,
    },
    itemContainer: {
        marginVertical: 4,
    },
});