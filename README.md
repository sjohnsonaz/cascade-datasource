# Cascade Datasource

[![Build Status](https://travis-ci.org/sjohnsonaz/cascade-datasource.svg?branch=master)](https://travis-ci.org/sjohnsonaz/cascade-datasource) [![npm version](https://badge.fury.io/js/cascade-datasource.svg)](https://badge.fury.io/js/cascade-datasource)

Array and Service Pagination powered by Cascade.

```` TypeScript
var dataSource = new DataSource<number>((page, pageSize, sortedColumn, sortedDirection) => {
    return DataSource.pageArray(dataArray, page, pageSize, sortedColumn, sortedDirection);
});
dataSource.init();
dataSource.page = 1;
````