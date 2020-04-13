import {fireEvent, render} from "@testing-library/svelte";
import ExtendedTable from "../src/ExtendedTable.svelte";

export const buildTable = (rows, columns, props) => {
    props = props || {};
    !props.sortingFunction ? props.sortingFunction = () => {} : true;

    const { container } = render(ExtendedTable, {
        data: rows,
        columns: columns,
        ...props
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

    return container;
};