import HistoryDrawerContent from "@/components/drawer/HistoryDrawerContent";
import { DependenciesProvider } from "@/di/DependenciesContext";
import { HistoryProvider } from "@/features/history/HistoryContext";
import { useTheme } from "@/styles/theme";
import { Drawer } from "expo-router/drawer";
import { StyleSheet } from "react-native";

export default function RootLayout() {
    const theme = useTheme();
    const styles = StyleSheet.create({
        drawerContent: {
            backgroundColor: theme.colors.background,
        },
    });

    return (
        <DependenciesProvider>
            <HistoryProvider>
                <Drawer
                    drawerContent={props => <HistoryDrawerContent {...props} style={styles.drawerContent} />}
                >
                    <Drawer.Screen
                        name="chat"
                        options={{ headerShown: false }}
                    />
                </Drawer>
            </HistoryProvider>
        </DependenciesProvider>
    );
}