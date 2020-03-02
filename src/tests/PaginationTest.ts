import { expect } from 'chai';
import Cascade, { observable } from 'cascade';

import Pagination from '../scripts/implementations/Pagination';
import { pageArray } from '../scripts/util/PageUtil';

describe('Pagination', () => {
    let dataArray = [];
    for (let index = 0; index < 100; index++) {
        dataArray.push(index);
    }
    it('should parse an array into a page of data', () => {
        var callCount = 0;
        var pagination = new Pagination<number>((page, pageSize) => {
            callCount++;
            return pageArray(dataArray, page, pageSize);
        });
        pagination.init();
        Cascade.subscribe(pagination, 'activeRows', (activeRows: number[]) => {
            if (callCount === 2) {
                expect(activeRows.length).to.equal(20);
            }
        });
    });

    it('should parse an array into a second page of data', () => {
        var callCount = 0;
        var pagination = new Pagination<number>((page, pageSize) => {
            callCount++;
            return pageArray(dataArray, page, pageSize);
        });
        pagination.init();
        pagination.page = 1;
        Cascade.subscribe(pagination, 'activeRows', (activeRows: number[]) => {
            if (callCount === 2) {
                expect(activeRows[0]).to.equal(10);
            }
        });
    });

    it('should return an empty array if the page is empty', () => {
        var callCount = 0;
        var pagination = new Pagination<number>((page, pageSize) => {
            callCount++;
            return pageArray(dataArray, page, pageSize);
        });
        pagination.init();
        pagination.page = 5;
        Cascade.subscribe(pagination, 'activeRows', (activeRows: number[]) => {
            if (callCount === 2) {
                expect(activeRows.length).to.equal(0);
            }
        });
    });

    it('should parse an array into different size pages', () => {
        var callCount = 0;
        var pagination = new Pagination<number>((page, pageSize) => {
            callCount++;
            return pageArray(dataArray, page, pageSize);
        });
        pagination.init();
        pagination.pageSize = 30;
        Cascade.subscribe(pagination, 'activeRows', (activeRows: number[]) => {
            if (callCount === 2) {
                expect(activeRows.length).to.equal(30);
            }
        });
    })
});