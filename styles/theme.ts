import { useColorScheme } from 'react-native';

const light = {
    statusBarStyle: 'dark' as const,
    colors: {
        background: '#FFFFFF',
        drawerBackground: '#FFFFFF',
        selectedBackground: '#F0F0F0',
        text: '#000000',
        textSecondary: '#666666',
        tint: '#3D7BF6',

        button: '#3D7BF6',
        buttonText: '#FFFFFF',
        buttonDisabled: '#D3D3D3',
        buttonPressed: '#2E59C1',

        inputBackground: '#FFFFFF',
        inputBorder: '#D3D3D3',
        inputPlaceholder: '#808080',

        userBubble: '#3D7BF6',
        userBubbleText: '#FFFFFF',
        assistantBubble: '#EEEEEE',
        assistantBubbleText: '#000000',
        systemBubble: '#FFFFFF',
        systemBubbleText: '#000000',
        assistantSuggestionBubble: '#FFFFFF',
        assistantSuggestionBubbleText: '#000000',
    },
};

const dark = {
    statusBarStyle: 'light' as const,
    colors: {
        background: '#000000',
        drawerBackground: '#1A1A1A',
        selectedBackground: '#404040',
        text: '#FFFFFF',
        textSecondary: '#666666',
        tint: '#3D7BF6',

        button: '#3D7BF6',
        buttonText: '#FFFFFF',
        buttonDisabled: '#404040',
        buttonPressed: '#2E59C1',

        inputBackground: '#1A1A1A',
        inputBorder: '#404040',
        inputPlaceholder: '#808080',

        userBubble: '#3D7BF6',
        userBubbleText: '#FFFFFF',
        assistantBubble: '#EEEEEE',
        assistantBubbleText: '#000000',
        systemBubble: '#000000',
        systemBubbleText: '#FFFFFF',
        assistantSuggestionBubble: '#000000',
        assistantSuggestionBubbleText: '#FFFFFF',
    },
};

export function useTheme() {
    const scheme = useColorScheme();
    return scheme === 'dark' ? dark : light;
}