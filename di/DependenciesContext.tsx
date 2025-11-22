import { AppGenerationApiService, AppGenerationApiServiceInterface } from '@/impl/api/AppGenerationApiService';
import { AppGenerationRepository, AppGenerationRepositoryInterface } from '@/impl/repo/appGeneration/AppGenerationRepository';
import { ArtifactsStorageService, ArtifactsStorageServiceInterface } from '@/impl/storage/artifacts/ArtifactsStorageService';
import { ChatsStorageServiceInterface, createChatsStorageService } from '@/impl/storage/chats/ChatsStortageService';
import { DbClient } from '@/infra/db/DbClient';
import { createDbClient } from '@/infra/db/SqlliteDbClient';
import { createDefaultFsClient } from '@/infra/fs/DefaultFsClient';
import { FsClient } from '@/infra/fs/FsClient';
import Constants from 'expo-constants';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { ChatsRepository, ChatsRepositoryInterface } from '../impl/repo/chats/ChatsRepository';

type Dependencies = {
    db: DbClient;
    fs: FsClient;

    artifactStorage: ArtifactsStorageServiceInterface;
    chatsStorage: ChatsStorageServiceInterface;

    appGenerationApi: AppGenerationApiServiceInterface;

    chatsRepository: ChatsRepositoryInterface;
    appGenerationRepository: AppGenerationRepositoryInterface;
};

const DependenciesContext = createContext<Dependencies | undefined>(undefined);

export function DependenciesProvider({ children }: { children: React.ReactNode }) {
    const [dependencies, setDependencies] = useState<Dependencies | null>(null);
    const { openaiApiKey } = Constants.expoConfig!.extra!;

    useEffect(() => {
        let cancelled = false;

        (async () => {
            const db = await createDbClient();
            const fs = createDefaultFsClient();

            const artifactStorage = new ArtifactsStorageService(fs);
            const chatsStorage = await createChatsStorageService(db);

            const appGenerationApi = new AppGenerationApiService({
                model: 'gpt-4o-mini',
                apiKey: openaiApiKey,
                maxOutputTokens: 10000
            });

            const chatsRepository = new ChatsRepository(chatsStorage);
            const appGenerationRepository = new AppGenerationRepository(appGenerationApi, artifactStorage);

            if (!cancelled) {
                setDependencies({ 
                    db, fs, 
                    artifactStorage, chatsStorage,
                    appGenerationApi,
                    chatsRepository, appGenerationRepository 
                });
            }
        })();

        return () => {
            cancelled = true;
        };
    }, []);

    if (!dependencies) {
        return (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <ActivityIndicator />
            </View>
        );
    }

    return (
        <DependenciesContext.Provider value={dependencies}>
            {children}
        </DependenciesContext.Provider>
    );
}

export function useDependencies(): Dependencies {
    const ctx = useContext(DependenciesContext);
    if (!ctx) {
        throw new Error('useDependencies must be used inside DependenciesProvider');
    }
    return ctx;
}