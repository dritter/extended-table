import '@testing-library/jest-dom/extend-expect';
import {buildTable} from "./util";

const sortableMods = [{sortable: true}, {sortable: true}, {sortable: true}];

test('sorting works properly', async () => {
    const table = buildTable({columnMods: sortableMods});
    const column2 = table.columns[1];
    expect(column2.getHeadline()).toEqual("Column2");

    expect(column2.getValues()).toEqual(["xabc", "test", "zzz", "bla"]);
    await column2.click();

    // Select again after resorting
    expect(column2.getValues()).toEqual(["bla", "test", "xabc", "zzz"]);
});

test('sorting works properly reversed', async () => {
    const table = buildTable({columnMods: sortableMods});
    const column2 = table.columns[1];

    expect(column2.getValues()).toEqual(["xabc", "test", "zzz", "bla"]);

    await column2.click();
    await column2.click();

    // Select again after resorting
    expect(column2.getValues()).toEqual(["zzz", "xabc", "test", "bla"]);
});

test('sorting works properly with nested objects', async () => {
    const table = buildTable({columnMods: sortableMods});

    const column1 = table.columns[0];
    expect(column1.getHeadline()).toEqual('Column1');
    expect(column1.getValues()).toEqual(["1", "2", "3", "4"]);

    await column1.click();
    await column1.click();

    // Select again after resorting
    expect(column1.getValues()).toEqual(["4", "3", "2", "1"]);
});

test('multisort=false lets only sort one column', async () => {
    const table = buildTable({
        columnMods: sortableMods,
        props: {sorting: {multisort: false}}
    });

    const column2 = table.columns[1];
    expect(column2.getHeadline()).toEqual('Column2');

    const testColumn = table.columns[0];
    expect(testColumn.getValues()).toEqual(["1", "2", "3", "4"]);

    await column2.click();

    // Select again after resorting
    expect(testColumn.getValues()).toEqual(["4", "2", "1", "3"]);
});

test('initial sort works as expected', async () => {
    const table = buildTable({
        columnMods: sortableMods,
        props: {sorting: {initial: { propertyPath: 'col2', direction: 'desc'}}}
    });

    const testColumn = table.columns[1];
    expect(testColumn.getValues()).toEqual(["zzz", "xabc", "test", "bla"]);
});
