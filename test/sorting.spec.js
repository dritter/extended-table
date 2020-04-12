import '@testing-library/jest-dom/extend-expect';
import { render, fireEvent } from '@testing-library/svelte';
import { sortByColumn, resetSorting } from '../src/sortBy';

import ExtendedTable from '../src/ExtendedTable.svelte'

const originalRows = [
    { col1: {subprop: 1}, col2: "xabc", unrelated: "test1", col3: "hier ist zzz"},
    { col1: {subprop: 2}, col2: "test", unrelated: "test2", col3: "hier ist zzzX"},
    { col1: {subprop: 3}, col2: "zzz", unrelated: "test3", col3: "hier ist zzzA"},
    { col1: {subprop: 4}, col2: "bla", unrelated: "test4", col3: "hier ist zzzT"},
];

let originalColumnDefinition = [
    {
        title: 'Column1',
        propertyPath: 'col1.subprop',
        sortable: true,
    },
    {
        title: 'Column2',
        propertyPath: 'col2',
        sortable: true,
    },
    {
        title: 'Column3',
        propertyPath: 'col3',
        sortable: true,
    },
];

const getColumn = (nodeList) => {
    return Array.prototype.map.call(nodeList, (element) => element.textContent.trim());
};

test('sorting works properly', async () => {
    resetSorting();
    const rows = JSON.parse(JSON.stringify(originalRows));
    const columnDefinition = JSON.parse(JSON.stringify(originalColumnDefinition));
    const { container, getByText } = render(ExtendedTable, {
        data: rows,
        columns: columnDefinition,
        sortingFunction: sortByColumn
    });

    const column2Headline = getByText('Column2');
    expect(column2Headline).toBeInTheDocument();

    const testColumn = container.querySelectorAll('.col-col2');
    expect(getColumn(testColumn)).toEqual(["xabc", "test", "zzz", "bla"]);

    await fireEvent.click(column2Headline);

    // Select again after resorting
    const testColumnReselected = container.querySelectorAll('.col-col2');
    expect(getColumn(testColumnReselected)).toEqual(["bla", "test", "xabc", "zzz"]);
});

test('sorting works properly reversed', async () => {
    resetSorting();

    const rows = JSON.parse(JSON.stringify(originalRows));
    const columnDefinition = JSON.parse(JSON.stringify(originalColumnDefinition));
    const { container } = render(ExtendedTable, {
        data: rows,
        columns: columnDefinition,
        sortingFunction: sortByColumn
    });

    const column2Headline = container.querySelector('.col-head-col2');

    const testColumn = container.querySelectorAll('.col-col2');
    expect(getColumn(testColumn)).toEqual(["xabc", "test", "zzz", "bla"]);

    await fireEvent.click(column2Headline);
    await fireEvent.click(column2Headline);

    // Select again after resorting
    const testColumnReselected = container.querySelectorAll('.col-col2');
    expect(getColumn(testColumnReselected)).toEqual(["zzz", "xabc", "test", "bla"]);
});

test('sorting works properly with nested objects', async () => {
    resetSorting();
    const rows = JSON.parse(JSON.stringify(originalRows));
    const columnDefinition = JSON.parse(JSON.stringify(originalColumnDefinition));
    const { container, getByText } = render(ExtendedTable, {
        data: rows,
        columns: columnDefinition,
        sortingFunction: sortByColumn
    });

    const column2Headline = getByText('Column1');
    expect(column2Headline).toBeInTheDocument();

    const testColumn = container.querySelectorAll('.col-col1_subprop');
    expect(getColumn(testColumn)).toEqual(["1", "2", "3", "4"]);

    await fireEvent.click(column2Headline);
    await fireEvent.click(column2Headline);

    // Select again after resorting
    const testColumnReselected = container.querySelectorAll('.col-col1_subprop');
    expect(getColumn(testColumnReselected)).toEqual(["4", "3", "2", "1"]);
});

test('multisort=false lets only sort one column', async () => {
    resetSorting();
    const rows = JSON.parse(JSON.stringify(originalRows));
    const columnDefinition = JSON.parse(JSON.stringify(originalColumnDefinition));
    const { container, getByText } = render(ExtendedTable, {
        data: rows,
        columns: columnDefinition,
        multisort: false,
        sortingFunction: sortByColumn
    });

    const column2Headline = getByText('Column2');
    expect(column2Headline).toBeInTheDocument();

    const testColumn = container.querySelectorAll('.col-col1_subprop');
    expect(getColumn(testColumn)).toEqual(["1", "2", "3", "4"]);

    await fireEvent.click(column2Headline);

    // Select again after resorting
    const testColumnReselected = container.querySelectorAll('.col-col1_subprop');
    expect(getColumn(testColumnReselected)).toEqual(["4", "2", "1", "3"]);
});

test('initial sort works as expected', async () => {
    resetSorting();
    const rows = JSON.parse(JSON.stringify(originalRows));
    const columnDefinition = JSON.parse(JSON.stringify(originalColumnDefinition));
    const { container, getByText } = render(ExtendedTable, {
        data: rows,
        columns: columnDefinition,
        initialSortBy: 'col2',
        initialSortDirection: 'desc',
        sortingFunction: sortByColumn
    });

    const testColumn = container.querySelectorAll('.col-col2');
    expect(getColumn(testColumn)).toEqual(["zzz", "xabc", "test", "bla"]);
});
