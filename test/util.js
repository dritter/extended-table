import {fireEvent, render} from "@testing-library/svelte";
import ExtendedTable from "../src/ExtendedTable.svelte";
import { sortByColumn, resetSorting } from '../src/sortBy';
import { sluggify } from '../src/cssClassNames';

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
    resetSorting();
    config = config || {};
    config.props = config.props || {};

    const columns = config.columns || freshCopy(defaultColumns);
    const rows = config.rows || freshCopy(defaultRows);

    if (config.columnMods) {
        config.columnMods.forEach((mod, index) => {
            Object.assign(columns[index], mod);
        })
    }

    const tableConfig = {
        columns: columns,
    }
    if (!config.props.sortingFunction) {
        tableConfig.sorting = {
            function: sortByColumn
        }
    }
    if (config.props.sorting) {
        tableConfig.sorting = config.props.sorting;
    }
    if (config.props.rows) {
        tableConfig.rows = config.props.rows;
    }
    if (config.props.collapsing) {
        tableConfig.collapsing = config.props.collapsing;
    }

    const { container } = render(ExtendedTable, {
        data: rows,
        config: tableConfig,
        ...config.props
    });

    columns.forEach((col, index) => {
        const cssIndex = index + 1;
        col.cssClass = sluggify(col.propertyPath);

        col.getHeadline = () => {
            const headCell = container.querySelector(`th:nth-of-type(${cssIndex})`);
            return headCell.textContent.trim();
        };

        col.click = async (row) => {
            let cell;
            if (!row) {
                cell = container.querySelector(`th:nth-of-type(${cssIndex})`);
            } else {
                cell = container.querySelector(`tbody tr:nth-of-type(${row}) .col-${col.cssClass}`);
            }
            await fireEvent.click(cell);
        };

        col.getValues = () => {
            const cells = container.querySelectorAll(`.col-${col.cssClass}`);

            return Array.prototype.map.call(cells, (element) => element.textContent.trim());
        };

        col.expand = async () => {
            const cell = container.querySelector(`th:nth-of-type(${cssIndex}) div`);
            await fireEvent.click(cell);
        };

        col.getHeaderCssClasses = () => {
            const cell = container.querySelector(`th:nth-of-type(${cssIndex})`);

            return cell.className.split(/\s+/)
        }

        col.getCssClasses = (row) => {
            row = row || 1
            const cell = container.querySelector(`tbody tr:nth-of-type(${row}) .col-${col.cssClass}`);

            return cell.className.split(/\s+/)
        }
    });

    rows.forEach((row, index) => {
        const cssIndex = index + 1;
        row.getRowClasses = () => {
            const tableRow = container.querySelector(`tbody tr:nth-of-type(${cssIndex})`);

            return tableRow.className.split(/\s+/)
        }
    })

    return {
        ref: container,
        columns: columns,
        rows: rows
    };
};