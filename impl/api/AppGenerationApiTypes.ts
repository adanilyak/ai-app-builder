export type AppGenerationApiResponse = {
    title: string;
    text: string;
    items: AppGenerationApiResponseItem[];
    suggestions: string[];
};

export type AppGenerationApiResponseItem = {
    content: string;
    kind: 'html' | 'css' | 'js' | 'other';
};