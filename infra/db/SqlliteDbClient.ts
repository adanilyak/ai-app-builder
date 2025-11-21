import * as SQLite from 'expo-sqlite';
import { DbClient, SqlParams } from './DbClient';

export class SqliteDbClient implements DbClient {
    constructor(private db: SQLite.SQLiteDatabase) { }

    async run(sql: string, params: SqlParams = []): Promise<void> {
        await this.db.runAsync(sql, params);
    }

    async get<T = any>(sql: string, params: SqlParams = []): Promise<T | null> {
        const row = await this.db.getFirstAsync<T>(sql, params);
        return row ?? null;
    }

    async all<T = any>(sql: string, params: SqlParams = []): Promise<T[]> {
        return this.db.getAllAsync<T>(sql, params);
    }


    async transaction<T>(fn: (tx: DbClient) => Promise<T>): Promise<T> {
        await this.db.execAsync('BEGIN');

        try {
            const result = await fn(this);
            await this.db.execAsync('COMMIT');
            return result;
        } catch (err) {
            await this.db.execAsync('ROLLBACK');
            throw err;
        }
    }
}

export async function createDbClient(): Promise<DbClient> {
    const db = await SQLite.openDatabaseAsync('ai-app-builder.sqlite');
    await db.execAsync(`
        PRAGMA foreign_keys = ON;
    `);
    return new SqliteDbClient(db);
}