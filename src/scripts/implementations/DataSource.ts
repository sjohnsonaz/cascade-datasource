import { observable } from 'cascade';

import { IDataSource, IDataSourceParams, RefreshCallback } from '../interfaces/IDataSource';
import { IPage } from '../interfaces/IPage';

export default class DataSource<T> implements IDataSource<T> {
    @observable pageSize: number;
    @observable page: number;
    @observable pagerSize: number;
    @observable sortedColumn: string;
    @observable sortedDirection: boolean;
    @observable activeRows: T[]
    @observable rowCount: number;
    @observable error: boolean;

    source: RefreshCallback<T>;
    lockRefresh: any
    private runCount: number;

    @observable get dataComputed(): Promise<IPage<T>> {
        var pageSize = this.pageSize;
        var page = this.page;
        var sortedColumn = this.sortedColumn;
        var sortedDirection = this.sortedDirection;
        if (!this.lockRefresh) {
            return this.run(true);
        } else {
            return (Promise.reject('DataSource is locked') as any);
        }
    }

    constructor(source?: RefreshCallback<T>, params?: IDataSourceParams<T>) {
        params = params || {};
        var self = this;
        this.pageSize = params.pageSize || 20;
        this.page = params.page || 0;
        this.pagerSize = params.pagerSize || 10;
        this.sortedColumn = params.sortedColumn;
        this.sortedDirection = params.sortedDirection;
        this.activeRows = params.activeRows;
        this.rowCount = params.rowCount || 0;
        this.error = params.error || false;

        this.source = source;
        this.lockRefresh = true;
        this.runCount = 0;
    }

    init(): Promise<IPage<T>> {
        this.lockRefresh = false;
        return this.dataComputed;
    }

    run(preservePage?: boolean): Promise<IPage<T>> {
        this.runCount++;
        var runID = this.runCount;
        this.lockRefresh = false;
        var pageSize = this.pageSize;
        var page = this.page;
        var sortedColumn = this.sortedColumn;
        var sortedDirection = this.sortedDirection;
        var promise = this.source(page, pageSize, sortedColumn, sortedDirection);
        return promise.then((results) => {
            if (runID == this.runCount) {
                this.activeRows = results.data;
                this.rowCount = results.count;
                if (!preservePage) {
                    this.page = 0;
                }
                this.error = false;
            }
            return results;
        }).catch((results) => {
            if (runID == this.runCount) {
                this.error = true;
            }
            return Promise.reject<IPage<T>>(results);
        });
    }

    clear() {
        var lockRefresh = this.lockRefresh;
        this.page = 0;
        this.rowCount = 0;
        this.activeRows = [];
        this.lockRefresh = lockRefresh;
    }
}