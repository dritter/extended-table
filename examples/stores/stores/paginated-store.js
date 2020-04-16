import { writable, derived } from 'svelte/store';
import { filtered } from './filtered-store';

export const activePage = writable(0);
export const itemsPerPage = writable(10);

const getPage = (data, page, itemsPerPage) => {
    let offset = (page) * itemsPerPage;

    return data.slice(offset, offset + itemsPerPage);
};

export const paged = derived(
    [ filtered, activePage, itemsPerPage ],
    ([$filtered, $activePage, $itemsPerPage ]) => {
        return getPage($filtered, $activePage, $itemsPerPage)
    }
);

export const totalPages = derived(
    [filtered, activePage, itemsPerPage],
    ([$filtered, $activePage, $itemsPerPage]) => {
        let maxPages = Math.ceil($filtered.length / $itemsPerPage);

        if ($activePage > maxPages) {
            // Substract one page, because our pages are zero indexed
            activePage.set(maxPages - 1);
        }

        return maxPages;
    }
);