import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/svelte'

import ExtendedTable from '../src/ExtendedTable.svelte'

const rows = [
    { col1: {subprop: 1}, col2: "xabc", unrelated: "test1", col3: "hier ist zzz"},
    { col1: {subprop: 2}, col2: "test", unrelated: "test2", col3: "hier ist zzzX"},
    { col1: {subprop: 3}, col2: "zzz", unrelated: "test3", col3: "hier ist zzzA"},
    { col1: {subprop: 4}, col2: "bla", unrelated: "test4", col3: "hier ist zzzT"},
];

let columnDefinition = [
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
    const { container, getByText } = render(ExtendedTable, {
        data: rows,
        columns: columnDefinition
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
