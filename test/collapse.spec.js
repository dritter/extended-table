import '@testing-library/jest-dom/extend-expect';
import { buildTable } from './util';

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


test('expanding works properly', async () => {
    const rows = JSON.parse(JSON.stringify(originalRows));
    const columnDefinition = JSON.parse(JSON.stringify(originalColumnDefinition));
    buildTable(rows, columnDefinition);

    const column2Headline = columnDefinition[1];
    expect(column2Headline.getHeadline()).toEqual('...');
    expect(column2Headline.getValues()).toEqual(["...", "...", "...", "..."]);

    await column2Headline.expand();

    expect(column2Headline.getHeadline()).toEqual('Column2');
    expect(column2Headline.getValues()).toEqual(["xabc", "test", "zzz", "bla"]);
});

test('expanding all columns works properly', async () => {
    const rows = JSON.parse(JSON.stringify(originalRows));
    const columnDefinition = JSON.parse(JSON.stringify(originalColumnDefinition));

    const table = buildTable(rows, columnDefinition, {expandAll: true});

    const column2Headline = columnDefinition[1];
    expect(column2Headline.getHeadline()).toEqual('...');

    const testColumn = columnDefinition[2];
    expect(testColumn.getValues()).toEqual(["...", "...", "...", "..."]);

    await column2Headline.expand();

    // Select again after resorting
    expect(testColumn.getValues()).toEqual(["hier ist zzz", "hier ist zzzX", "hier ist zzzA", "hier ist zzzT"]);
});

test('expanding does not trigger sorting', async () => {
    const rows = JSON.parse(JSON.stringify(originalRows));
    const columnDefinition = JSON.parse(JSON.stringify(originalColumnDefinition));
    const table = buildTable(rows, columnDefinition);

    const column2Headline = columnDefinition[1];

    const testColumn = columnDefinition[0];
    expect(testColumn.getValues()).toEqual(["1", "2", "3", "4"]);

    await column2Headline.expand();
    expect(testColumn.getValues()).toEqual(["1", "2", "3", "4"]);
});