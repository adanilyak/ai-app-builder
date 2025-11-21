export type SqlParam = string | number | null | boolean;
export type SqlParams = SqlParam[] | Record<string, SqlParam>;

export interface DbClient {
    run(sql: string, params?: SqlParams): Promise<void>;
    get<T = any>(sql: string, params?: SqlParams): Promise<T | null>;
    all<T = any>(sql: string, params?: SqlParams): Promise<T[]>;

    transaction<T>(fn: (tx: DbClient) => Promise<T>): Promise<T>;
}