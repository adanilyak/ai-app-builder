export type AppGenerationApiResponse = AppGenerationApiResponseItem[];

export type AppGenerationApiResponseItem = {
    content: string;
    kind: 'html' | 'css' | 'js' | 'other';
};