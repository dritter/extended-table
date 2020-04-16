import { writable, derived } from 'svelte/store';
import { data } from './data-store';
import { sortByColumn } from "../../../src/sortBy";

export const sortColumns = writable([]);
export const activeColumn = writable({});
export const multisort = writable(true);

export const sorted = derived(
    [activeColumn, sortColumns, data, multisort],
    ([$activeColumn, $sortColumns, $data, $multisort]) => {
        sortByColumn($activeColumn, $sortColumns, $data, $multisort, () => {});

        return $data;
    }
);