import { Directory, File, Paths } from 'expo-file-system';
import { FsClient, PathComponent } from './FsClient';

export class DefaultFsClient implements FsClient {
    constructor(private basePath: Directory) {}

    async readTextFile(...pathComponents: PathComponent[]): Promise<string> {
        const fullPath = Paths.join(this.basePath, ...pathComponents);
        const file = new File(fullPath);
        return file.text();
    }

    async writeTextFile(content: string, ...pathComponents: PathComponent[]): Promise<void> {
        const fullPath = Paths.join(this.basePath, ...pathComponents);
        const file = new File(fullPath);
        file.create({ intermediates: true });
        return file.write(content);
    }

    async createDirectory(...pathComponents: PathComponent[]): Promise<void> {
        const fullPath = Paths.join(this.basePath, ...pathComponents);
        const dir = new Directory(fullPath);
        dir.create({ intermediates: true });
    }
}

export function createDefaultFsClient(): FsClient {
    return new DefaultFsClient(Paths.document);
}