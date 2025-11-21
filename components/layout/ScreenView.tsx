import { useTheme } from '@/styles/theme';
import { useHeaderHeight } from '@react-navigation/elements';
import React from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

type ScreenViewProps = {
    children: React.ReactNode;
    scroll?: boolean;
    padded?: boolean;
    withHeader?: boolean;
    fullScreen?: boolean;
    style?: any;
};

export default function ScreenView({
    children,
    withHeader = true,
    fullScreen = false,
    style,
}: ScreenViewProps) {
    const theme = useTheme();
    const insets = useSafeAreaInsets();
    const headerHeight = withHeader ? useHeaderHeight() : 0;

    return (
        <KeyboardAvoidingView
            style={styles.flex}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={withHeader ? (headerHeight - insets.bottom) : 0}
        >
            <SafeAreaView
                style={[styles.flex, { backgroundColor: theme.colors.background }, style]}
                edges={
                    fullScreen ? [] : 
                    withHeader ? ['bottom', 'left', 'right'] :
                    ['bottom', 'left', 'right', 'top']
                }
            >
                <View
                    style={[styles.flex, { backgroundColor: theme.colors.background }, style]}
                >
                    {children}
                </View>
            </SafeAreaView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    flex: { flex: 1 },
});