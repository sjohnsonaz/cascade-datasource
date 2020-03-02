import { observable, computed } from 'cascade';

import { IPagination, IRefreshCallback } from '../interfaces/IPagination';
import { IPage } from '../interfaces/IPage';

export default class Pagination<T> implements IPagination<T> {
    @observable pageSize: number = 20;
    @observable page: number = 0;

    @observable activeRows: T[] = [];
    @observable allRows: T[] = [];
    @observable rowCount: number = 0;
    @observable error: boolean = false;
    @observable loaded: boolean = false;
    @observable refreshing: boolean = false;

    refreshData: IRefreshCallback<T>;
    lockRefresh: boolean = true;
    runCount: number = 0;
    initialized: boolean = false;
    infinite: boolean = false;
    length: number = 0;

    @observable get dataComputed() {
        this.pageSize;
        this.page;
        if (this.initialized && !this.lockRefresh) {
            return this.run();
        } else {
            throw new Error('Pagination did not run');
        }
    }

    constructor(refreshData: IRefreshCallback<T>) {
        this.refreshData = refreshData;
    }

    init() {
        this.initialized = true;
        return this.run();
    }

    async run(): Promise<IPage<T>> {
        this.runCount++;
        var runID = this.runCount;
        this.lockRefresh = false;
        var pageSize = this.pageSize;
        var offset = this.infinite ?
            this.length :
            Math.abs(this.page * pageSize);
        this.refreshing = true;
        try {
            let result = await this.refreshData(offset, pageSize);
            if (runID == this.runCount) {
                let data = result.data || [];
                this.activeRows = data;
                if (this.infinite) {
                    this.allRows = this.allRows.concat(data);
                    this.length += data.length;
                }
                this.rowCount = result.count || 0;
                this.error = false;
                this.loaded = true;
            }
            return result;
        }
        catch (e) {
            if (runID == this.runCount) {
                this.error = true;
                this.loaded = false;
            }
            throw e;
        }
        finally {
            if (runID == this.runCount) {
                this.refreshing = false;
            }
        }
    }

    reset() {
        this.activeRows = [];
        this.allRows = [];

        this.page = 0;
        this.rowCount = 0;
        this.length = 0;
        this.runCount = 0;
        this.loaded = false;
        this.initialized = true;
        return this.run();
    }

    clear() {
        var lockRefresh = this.lockRefresh;
        this.page = 0;
        this.rowCount = 0;
        this.activeRows = [];
        this.allRows = [];
        this.length = 0;
        this.initialized = false;
        this.lockRefresh = lockRefresh;
        this.loaded = false;
    }

    nextPage() {
        this.page++;
    }

    itemDeleted(count: number = 1) {
        this.length -= count;
    }
}