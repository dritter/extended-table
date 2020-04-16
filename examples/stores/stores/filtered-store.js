import { writable, derived } from 'svelte/store';
import { sorted } from './sorted-store';
import { deepValue } from '@jsier/deep-value';

export const filterProp = writable("");
export const filterValue = writable("");

const filter = (rows, filterProp, value) => {
    if (!rows) {
        return [];
    }

    if (!value) {
        return rows;
    }

    return rows.filter((row) => {
        let currentValue = "" + deepValue(row, filterProp);

        return currentValue.trim().toLowerCase().includes(value);
    });
};

export const filtered = derived(
    [sorted, filterProp, filterValue],
    ([$sorted, $filterProp, $filterValue]) => filter($sorted, $filterProp, $filterValue)
);