import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/svelte'

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
    },
    {
        title: 'Column2',
        propertyPath: 'col2',
        collapsed: true
    },
    {
        title: 'Column3',
        propertyPath: 'col3',
        collapsed: true
    },
];


const getColumn = (nodeList) => {
    return Array.prototype.map.call(nodeList, (element) => element.textContent.trim());
};

test('expanding works properly', async () => {
    const rows = JSON.parse(JSON.stringify(originalRows));
    const columnDefinition = JSON.parse(JSON.stringify(originalColumnDefinition));
    const { container, getByText } = render(ExtendedTable, {
        data: rows,
        columns: columnDefinition
    });

    const column2Headline = container.querySelector('.col-head-col2');
    expect(column2Headline).toBeInTheDocument();
    expect(column2Headline.textContent.trim()).toEqual('...');

    const testColumn = container.querySelectorAll('.col-col2');
    expect(getColumn(testColumn)).toEqual(["...", "...", "...", "..."]);

    await fireEvent.click(column2Headline.querySelector('div'));
    const testColumnHeadlineReselected = container.querySelector('.col-head-col2');
    expect(testColumnHeadlineReselected.textContent.trim()).toEqual('Column2');

    // Select again after resorting
    const testColumnReselected = container.querySelectorAll('.col-col2');
    expect(getColumn(testColumnReselected)).toEqual(["xabc", "test", "zzz", "bla"]);
});

test('expanding all columns works properly', async () => {
    const rows = JSON.parse(JSON.stringify(originalRows));
    const columnDefinition = JSON.parse(JSON.stringify(originalColumnDefinition));
    const { container, getByText } = render(ExtendedTable, {
        data: rows,
        columns: columnDefinition,
        expandAll: true
    });

    const column2Headline = container.querySelector('.col-head-col2');
    expect(column2Headline).toBeInTheDocument();
    expect(column2Headline.textContent.trim()).toEqual('...');

    const testColumn = container.querySelectorAll('.col-col3');
    expect(getColumn(testColumn)).toEqual(["...", "...", "...", "..."]);

    await fireEvent.click(column2Headline.querySelector('div'));

    // Select again after resorting
    const testColumnReselected = container.querySelectorAll('.col-col3');
    expect(getColumn(testColumnReselected)).toEqual(["hier ist zzz", "hier ist zzzX", "hier ist zzzA", "hier ist zzzT"]);
});

test('expanding does not trigger sorting', async () => {
    const rows = JSON.parse(JSON.stringify(originalRows));
    const columnDefinition = JSON.parse(JSON.stringify(originalColumnDefinition));
    const { container, getByText } = render(ExtendedTable, {
        data: rows,
        columns: columnDefinition
    });

    const column2Headline = container.querySelector('.col-head-col2');

    const testColumn = container.querySelectorAll('.col-col1_subprop');
    expect(getColumn(testColumn)).toEqual(["1", "2", "3", "4"]);

    await fireEvent.click(column2Headline.querySelector('div'));
    const testColumnReselected = container.querySelectorAll('.col-col1_subprop');
    expect(getColumn(testColumnReselected)).toEqual(["1", "2", "3", "4"]);
});