import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/svelte'

import ExtendedTable from '../src/ExtendedTable.svelte'

const rows = [
    { startnumber: {number: 1}, xxx: "xabc", yyy: "test1", zzz: "hier ist zzz"},
    { startnumber: {number: 2}, xxx: "test", yyy: "test2", zzz: "hier ist zzzX"},
    { startnumber: {number: 3}, xxx: "zzz", yyy: "test3", zzz: "hier ist zzzA"},
    { startnumber: {number: 4}, xxx: "bla", yyy: "test4", zzz: "hier ist zzzT"},
];

let columnDefinition = [
    {
        title: 'Startnumber',
        propertyPath: 'startnumber.number',
        sortable: true,
    },
    {
        title: 'Column1',
        propertyPath: 'xxx',
        sortable: true,
    },
    {
        title: 'Column2',
        propertyPath: 'yyy',
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

    const startnumberHeadline = getByText('Column1');
    expect(startnumberHeadline).toBeInTheDocument();

    const testColumn = container.querySelectorAll('.col-xxx');
    expect(getColumn(testColumn)).toEqual(["xabc", "test", "zzz", "bla"]);

    await fireEvent.click(startnumberHeadline);

    // Select again after resorting
    const testColumnReselected = container.querySelectorAll('.col-xxx');
    expect(getColumn(testColumnReselected)).toEqual(["bla", "test", "xabc", "zzz"]);
});
