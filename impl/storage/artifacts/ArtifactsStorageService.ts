import { FsClient } from '@/infra/fs/FsClient';
import { FsArtifact, FsArtifactMeta } from './ArtifactsFsTypes';

const ARTIFACTS_DIR = 'artifacts';

export interface ArtifactsStorageServiceInterface {
    storeArtifact(artifact: FsArtifact): Promise<void>;
    storeArtifacts(artifacts: FsArtifact[]): Promise<void>;
    readArtifact(meta: FsArtifactMeta): Promise<FsArtifact>;
    readArtifacts(metas: FsArtifactMeta[]): Promise<FsArtifact[]>;
}

export class ArtifactsStorageService implements ArtifactsStorageServiceInterface {
    constructor(private fs: FsClient) { }

    async storeArtifact(artifact: FsArtifact): Promise<void> {
        await this.fs.writeTextFile(artifact.content, ARTIFACTS_DIR, artifact.meta.id + '.' + artifact.meta.kind);
    }

    async storeArtifacts(artifacts: FsArtifact[]): Promise<void> {
        for (const artifact of artifacts) {
            await this.storeArtifact(artifact);
        }
    }

    async readArtifact(meta: FsArtifactMeta): Promise<FsArtifact> {
        const content = await this.fs.readTextFile(ARTIFACTS_DIR, meta.id + '.' + meta.kind);
        return { meta, content };
    }

    async readArtifacts(metas: FsArtifactMeta[]): Promise<FsArtifact[]> {
        return Promise.all(metas.map(async (meta) => this.readArtifact(meta)));
    }
}