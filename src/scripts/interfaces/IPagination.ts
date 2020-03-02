import { IPage } from './IPage';

export interface IRefreshCallback<T> {
    (offset: number, limit: number): Promise<IPage<T>>;
}

export interface ISuccessCallback<T> {
    (data: T[], count: number): void;
}

export interface IErrorCallback {
    (error: Error): void;
}

export interface IPagination<T> {
    pageSize: number;
    page: number;
    activeRows: T[];
    allRows: T[];
    rowCount: number;
    error: boolean;
    loaded: boolean;
    refreshing: boolean;
    refreshData: IRefreshCallback<T>;
    lockRefresh: boolean;
    runCount: number;
    initialized: boolean;
    infinite: boolean;
    length: number;
    dataComputed: Promise<IPage<T>>;
    init(): Promise<IPage<T>>;
    run(preservePage?: boolean): Promise<IPage<T>>;
    clear(): void;
    reset(): Promise<IPage<T>>;
    nextPage(): void;
    itemDeleted(count?: number): void;
}