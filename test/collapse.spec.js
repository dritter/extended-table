import '@testing-library/jest-dom/extend-expect';
import { buildTable } from './util';

const mods = [{}, {collapsed: true}, {collapsed: true}];

test('expanding works properly', async () => {
    const table = buildTable({columnMods: mods});

    const column2Headline = table.columns[1];
    expect(column2Headline.getHeadline()).toEqual('...');
    expect(column2Headline.getValues()).toEqual(["...", "...", "...", "..."]);

    await column2Headline.expand();

    expect(column2Headline.getHeadline()).toEqual('Column2');
    expect(column2Headline.getValues()).toEqual(["xabc", "test", "zzz", "bla"]);
});

test('expanding all columns works properly', async () => {
    const table = buildTable({columnMods: mods, props: {expandAll: true}});

    const column2Headline = table.columns[1];
    expect(column2Headline.getHeadline()).toEqual('...');

    const testColumn = table.columns[2];
    expect(testColumn.getValues()).toEqual(["...", "...", "...", "..."]);

    await column2Headline.expand();

    // Select again after resorting
    expect(testColumn.getValues()).toEqual(["hier ist zzz", "hier ist zzzX", "hier ist zzzA", "hier ist zzzT"]);
});

test('expanding does not trigger sorting', async () => {
    const table = buildTable({columnMods: mods});

    const column2Headline = table.columns[1];

    const testColumn = table.columns[0];
    expect(testColumn.getValues()).toEqual(["1", "2", "3", "4"]);

    await column2Headline.expand();
    expect(testColumn.getValues()).toEqual(["1", "2", "3", "4"]);
});