import { useTheme } from "@/styles/theme";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";
import IconButton from "../ui/IconButton";

type HistoryTopBarProps = {
    onNewChat: () => void;
}

export function HistoryTopBar({ onNewChat }: HistoryTopBarProps) {
    const theme = useTheme();
    const titleTextStyle = { color: theme.colors.text };
    return (
        <View style={styles.container}>
            <View style={styles.titleContainer}>
                <Text style={[styles.title, titleTextStyle]}>AI App Builder</Text>
                <IconButton
                    icon={<Ionicons name="add" size={22} color={theme.colors.buttonText} />}
                    onPress={onNewChat}
                />
            </View>
        </View>
    )       
}

const styles = StyleSheet.create({
    container: {
        paddingLeft: 20,
        paddingRight: 16,
    },
    titleContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
    },
}); 