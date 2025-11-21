export type PathComponent = string;

export interface FsClient {
    readTextFile(...pathComponents: PathComponent[]): Promise<string>;
    writeTextFile(content: string, ...pathComponents: PathComponent[]): Promise<void>;
    createDirectory(...pathComponents: PathComponent[]): Promise<void>;
}