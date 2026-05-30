import type { QueryResult, QueryResultRow } from 'pg';

export type DbResult<T extends QueryResultRow> = QueryResult<T>;

export interface BaseEntity {
    readonly id: number;
}