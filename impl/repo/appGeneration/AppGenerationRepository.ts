import { AppGenerationApiServiceInterface } from "@/impl/api/AppGenerationApiService";
import { ArtifactsStorageServiceInterface } from "@/impl/storage/artifacts/ArtifactsStorageService";
import { AppGenerationArtifact, AppGenerationResult, createAppGenerationArtifactFromApi, createAppGenerationArtifactFromFs, createFsArtifactFromAppGenerationArtifact } from "./AppGenerationTypes";

export interface AppGenerationRepositoryInterface {
    createConversation(): Promise<string>;
    generateApp(conversationId: string, description: string): Promise<AppGenerationResult>;
    getGeneratedApp(metas: { id: string, kind: string }[]): Promise<AppGenerationArtifact[]>;
}

export class AppGenerationRepository implements AppGenerationRepositoryInterface {
    constructor(
        private api: AppGenerationApiServiceInterface,
        private storage: ArtifactsStorageServiceInterface,
    ) { }
    
    async createConversation(): Promise<string> {
        return this.api.createConversation();
    }

    async generateApp(conversationId: string, description: string): Promise<AppGenerationResult> {
        const response = await this.api.generateApp(conversationId, description);
        const artifacts = response.items.map(createAppGenerationArtifactFromApi);
        const fsArtifacts = artifacts.map(createFsArtifactFromAppGenerationArtifact);
        await this.storage.storeArtifacts(fsArtifacts);
        return {
            title: response.title,
            text: response.text,
            artifacts,
            suggestions: response.suggestions,
        };
    }

    async getGeneratedApp(metas: { id: string, kind: string }[]): Promise<AppGenerationArtifact[]> {
        const fsArtifacts = await this.storage.readArtifacts(metas);
        return fsArtifacts.map(createAppGenerationArtifactFromFs);
    }
}