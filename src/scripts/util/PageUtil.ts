import { IPage } from "../interfaces/IPage";

export function createPage<T>(data: T[], count: number): IPage<T> {
    return ({
        data: data,
        count: count
    });
}

export function pageArray<T>(results: T[], page: number, pageSize: number, sortedColumn?: string, sortedDirection?: boolean): Promise<IPage<T>> {
    if (results && sortedColumn) {
        results.sort(function (a: T, b: T) {
            var aValue: string = (a[sortedColumn] || '').toString();
            var bValue: string = (b[sortedColumn] || '').toString();

            var ax = [], bx = [];

            aValue.replace(/(\d+)|(\D+)/g, function (_, $1, $2) {
                ax.push([$1 || Infinity, $2 || ""]);
                return '';
            });
            bValue.replace(/(\d+)|(\D+)/g, function (_, $1, $2) {
                bx.push([$1 || Infinity, $2 || ""]);
                return '';
            });

            while (ax.length && bx.length) {
                var an = ax.shift();
                var bn = bx.shift();
                var nn = (an[0] - bn[0]) || an[1].localeCompare(bn[1]);
                if (nn) return nn;
            }

            return ax.length - bx.length;
        });

        if (sortedDirection === undefined) {
            sortedDirection = true;
        } else {
            sortedDirection = !!sortedDirection;
        }

        if (!sortedDirection) {
            results.reverse();
        }
    }

    return Promise.resolve(
        results ?
            createPage(results.slice(page * pageSize, (page + 1) * pageSize), results.length) :
            createPage([] as T[], 0)
    );
}