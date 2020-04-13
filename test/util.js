import {fireEvent, render} from "@testing-library/svelte";
import ExtendedTable from "../src/ExtendedTable.svelte";


const defaultRows = [
    { col1: {subprop: 1}, col2: "xabc", unrelated: "test1", col3: "hier ist zzz"},
    { col1: {subprop: 2}, col2: "test", unrelated: "test2", col3: "hier ist zzzX"},
    { col1: {subprop: 3}, col2: "zzz", unrelated: "test3", col3: "hier ist zzzA"},
    { col1: {subprop: 4}, col2: "bla", unrelated: "test4", col3: "hier ist zzzT"},
];

let defaultColumns = [
    {
        title: 'Column1',
        propertyPath: 'col1.subprop',
    },
    {
        title: 'Column2',
        propertyPath: 'col2',
    },
    {
        title: 'Column3',
        propertyPath: 'col3',
    },
];

const freshCopy = (obj) => JSON.parse(JSON.stringify(obj));

export const buildTable = (config) => {
    config = config || {};
    config.props = config.props || {};
    !config.props.sortingFunction ? config.props.sortingFunction = () => {} : true;

    let columns = config.columns || freshCopy(defaultColumns);
    let rows = config.rows || freshCopy(defaultRows);

    if (config.columnMods) {
        config.columnMods.forEach((mod, index) => {
            Object.assign(columns[index], mod);
        })
    }

    const { container } = render(ExtendedTable, {
        data: rows,
        columns: columns,
        ...config.props
    });

    const slugEx = new RegExp(/[^a-z0-9]/g);
    columns.forEach((col, index) => {
        let cssIndex = index + 1;
        col.cssClass = col.propertyPath.replace(slugEx, '_');

        col.getHeadline = () => {
            let headCell = container.querySelector(`th:nth-of-type(${cssIndex})`);
            return headCell.textContent.trim();
        };

        col.click = async (row) => {
            let cell;
            if (!row) {
                cell = container.querySelector(`th:nth-of-type(${cssIndex})`);
            } else {
                cell = container.querySelector(`tbody tr:nth-of-type(${row}) ${col.cssClass}`);
            }
            await fireEvent.click(cell);
        };

        col.getValues = () => {
            let cells = container.querySelectorAll(`.col-${col.cssClass}`);

            return Array.prototype.map.call(cells, (element) => element.textContent.trim());
        };

        col.expand = async () => {
            let cell = container.querySelector(`th:nth-of-type(${cssIndex}) div`);
            await fireEvent.click(cell);
        };
    });

    return {
        ref: container,
        columns: columns,
        rows: rows
    };
};