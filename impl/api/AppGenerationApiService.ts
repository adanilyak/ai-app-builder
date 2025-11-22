import { CREATE_CONVERSATION_PROMPT } from '@/resources/llm_prompts';
import OpenAI from 'openai';
import { AppGenerationApiResponse } from './AppGenerationApiTypes';

export interface AppGenerationApiServiceInterface {
    createConversation(): Promise<string>;
    generateApp(conversationId: string, description: string): Promise<AppGenerationApiResponse>;
}

export type AppGenerationApiServiceConfig = {
    model: string;
    apiKey: string;
    maxOutputTokens: number;
}

export class AppGenerationApiService implements AppGenerationApiServiceInterface {
    private openai: OpenAI

    constructor(private config: AppGenerationApiServiceConfig) {
        this.openai = new OpenAI({
            apiKey: config.apiKey
        });
    }

    async createConversation(): Promise<string> {
        const response = await this.openai.conversations.create({
            items: [
                {
                    role: 'system',
                    content: CREATE_CONVERSATION_PROMPT
                }
            ]
        });
        return response.id;
    }

    async generateApp(conversationId: string, description: string): Promise<AppGenerationApiResponse> {
        const response = await this.openai.responses.create({
            conversation: conversationId,
            model: this.config.model,
            input: [
                {
                    role: 'user',
                    content: description
                }
            ],
            text: {
                format: {
                    name: 'app_generation',
                    schema: {
                        type: 'object',
                        additionalProperties: false,
                        required: ['html', 'css', 'js', 'suggestions', 'text', 'title'],
                        properties: {
                            title: {
                                type: 'string',
                                description: 'Very short human-readable name for the app (1-3 words) suitable for use as a chat header.',
                            },
                            text: {
                                type: 'string',
                                description: 'Short, friendly message summarizing the result. If suggestions exist, encourage the user to tap one. Never mention being an AI model.',
                            },
                            html: {
                                type: 'string',
                                description: 'HTML markup for the page. Must NOT contain <style> or <script> tags.'
                            },
                            css: {
                                type: 'string',
                                description: 'CSS stylesheet for the page. Must be valid CSS with no imports or external resources.'
                            },
                            js: {
                                type: 'string',
                                description: 'Optional JavaScript for interactions. Must not use network calls, alert, prompt, or window.open.'
                            },
                            suggestions: {
                                type: 'array',
                                description: 'Optional array of short, actionable improvement ideas the user can use as follow-up prompts.',
                                minItems: 0,
                                maxItems: 3,
                                items: {
                                    type: 'string'
                                }
                            }
                        }
                    },
                    type: 'json_schema',
                    description: 'The HTML, CSS, and JavaScript code for the app',
                    strict: true,
                }
            },
            max_output_tokens: this.config.maxOutputTokens,
        });

        const json = JSON.parse(response.output_text)
        
        return {
            title: json.title,
            text: json.text,
            items: [
                {
                    kind: 'html',
                    content: json.html
                },
                {
                    kind: 'css',
                    content: json.css
                },
                {
                    kind: 'js',
                    content: json.js
                }
            ],
            suggestions: json.suggestions || []
        };
    }
}