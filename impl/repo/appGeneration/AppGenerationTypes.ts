import { AppGenerationApiResponseItem } from "@/impl/api/AppGenerationApiTypes";
import { FsArtifact } from "@/impl/storage/artifacts/ArtifactsFsTypes";
import uuid from 'react-native-uuid';

export type AppGenerationArtifactKind = 'html' | 'css' | 'js' | 'other';

export type AppGenerationArtifact = {
    id: string;
    kind: AppGenerationArtifactKind;
    content: string;
};

export function toAppGenerationArtifactKind(value: string): AppGenerationArtifactKind {
    switch (value.toLowerCase()) {
        case 'html':
        case 'css':
        case 'js':
            return value.toLowerCase() as AppGenerationArtifactKind;

        default:
            return 'other';
    }
}

export function createAppGenerationArtifactFromApi(response: AppGenerationApiResponseItem): AppGenerationArtifact {
    return {
        id: String(uuid.v4()),
        kind: toAppGenerationArtifactKind(response.kind),
        content: response.content,
    };
}

export function createAppGenerationArtifactFromFs(fsArtifact: FsArtifact): AppGenerationArtifact {
    return {
        id: fsArtifact.meta.id,
        kind: toAppGenerationArtifactKind(fsArtifact.meta.kind),
        content: fsArtifact.content,
    };
}

export function createFsArtifactFromAppGenerationArtifact(artifact: AppGenerationArtifact): FsArtifact {
    return {
        meta: {
            id: artifact.id,
            kind: artifact.kind,
        },
        content: artifact.content,
    };
}