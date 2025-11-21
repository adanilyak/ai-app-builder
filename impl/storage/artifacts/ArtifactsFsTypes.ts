export type FsArtifactMeta = {
    id: string;
    kind: string;
};

export type FsArtifact = {
    meta: FsArtifactMeta;
    content: string;
};