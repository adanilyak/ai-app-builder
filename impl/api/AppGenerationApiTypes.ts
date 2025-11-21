export type AppGenerationApiResponse = {
    text: string;
    items: AppGenerationApiResponseItem[];
    suggestions: string[];
};

export type AppGenerationApiResponseItem = {
    content: string;
    kind: 'html' | 'css' | 'js' | 'other';
};