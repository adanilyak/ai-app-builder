import 'dotenv/config';

export default {
    expo: {
        name: "ai-app-builder",
        slug: "ai-app-builder",

        scheme: "aiappbuilder",

        extra: {
            openaiApiKey: process.env.OPENAI_API_KEY,
        },
        plugins: [],
    },
};