import '@testing-library/jest-dom/extend-expect';
import {buildTable} from "./util";

test('setting headline css classes works properly', async () => {
    const mods = [
        {},
        { headerClassName: 'test-class' },
        { headerClassName: {
            value: (columnIndex) => {
                return 'other-test-class';
            }}
        }
    ];
    const table = buildTable({columnMods: mods});

    const column2Headline = table.columns[1];
    expect(column2Headline.getHeaderCssClasses()).toContain('test-class');
    const column3Headline = table.columns[2];
    expect(column3Headline.getHeaderCssClasses()).toContain('other-test-class');
});

test('setting css cell classes works properly', async () => {
    const mods = [
        {},
        { className: 'test-class' },
        { className: {
            value: (data, columnIndex, rowIndex) => {
                return `my-col-${data.col2} other-test-class`;
            }}
        }
    ];
    const table = buildTable({columnMods: mods});

    const column2 = table.columns[1];
    expect(column2.getCssClasses()).toContain('test-class');
    const column3 = table.columns[2];
    expect(column3.getCssClasses()).toContain('other-test-class');
    expect(column3.getCssClasses()).toContain('my-col-xabc');
});

test('setting css row classes works properly', async () => {
    const rowDefinition = {
    classNames: [
        'my-row-class',
        { propertyPath: 'col2' },
        { value: (data, rowIndex) => data.col2 === "xabc" ? "my-other-class" : "" },
    ]};
    const table = buildTable({
        props: {
            rows: rowDefinition
        }
    });

    const row = table.rows[0];
    const rowClasses = row.getRowClasses();
    expect(rowClasses).toContain('my-row-class');
    expect(rowClasses).toContain('xabc');
    expect(rowClasses).toContain('my-other-class');
});