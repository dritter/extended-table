<script>
    import ExtendedTable from "../../src/ExtendedTable.svelte";
    import {default as originalData} from '../../fixtures/fixtures.json';
    import Pagination from "./Pagination.svelte";
    import {filter} from './rowFilter';
    import ThemeSwitch from "./ThemeSwitch.svelte";

    import {sortByColumn} from "../../src/sortBy";
    import ColumnFilter from "./ColumnFilter.svelte";

    let columnDefinition = [
        {
            title: 'Username',
            propertyPath: 'username',
            sortable: true,
        },
        {
            title: 'Name',
            value: (rowData) => `${rowData.title} ${rowData.first_name} ${rowData.last_name}`,
            propertyPath: 'last_name',
            sortable: true,
        },
        {
            title: 'Location',
            propertyPath: 'location.postcode',
            sortable: true,
        },
    ];

    /*
     * Functions for switching items per page
     */
    let itemsPerPage = 10;
    const switchShownItemsPerPage = () => {
        rerender(filteredAndSortedRows || sortedRows || originalData);
    };

    /*
     * Functions for Pagination and RowFilter
     */
    let activePage = 0;
    let rows = [];
    let sortedRows = null;
    let filteredAndSortedRows = null;
    const getPage = (page, data) => {
        activePage = page;
        let offset = (page) * itemsPerPage;

        return data.slice(offset, offset + itemsPerPage);
    };

    const sortByWrapper = (column, columns, innerRows, multisort, cacheClearCallback) => {
        // Sort the full data instead of just the page
        sortByColumn(column, columns, originalData, multisort, cacheClearCallback);
        sortedRows = originalData;
        filteredAndSortedRows = filter(sortedRows, filterProp, filterValue);
        // Overwrite rows, so that ExtendedTable picks up the new rows.
        rows = getPage(activePage, filteredAndSortedRows);
        cacheClearCallback();
    };

    const calculatePages = (data) => {
        return Math.ceil(data.length / itemsPerPage);
    };

    let pages = 0;
    const rerender = (data) => {
        pages = calculatePages(data);
        rows = getPage(0, data);
    };
    rerender(JSON.parse(JSON.stringify(originalData)));

    /*
     * Special functions for rendering
     */
    const getGenderIcon = (person) => {
        return person.gender === 'male' ? '&#9794;' : '&#9792;';
    };

    const getBirthday = (person) => {
        if (!person.birthdate) {
            return "Unknown";
        }

        let birthday = new Date(person.birthdate * 1000);
        return birthday.toLocaleDateString();
    };

    /*
     * Filter stuff
     */
    let filterProp = "username";

    let filterValue = null;
    const doFilter = (event) => {
        let filterRows = sortedRows || originalData;
        filterValue = event.target.value.trim().toLowerCase();
        if (!filterValue) {
            filterValue = null;
            rerender(sortedRows);
            return;
        }

        filteredAndSortedRows = filter(filterRows, filterProp, filterValue);
        rerender(filteredAndSortedRows);
    };

    /**
     * Theming
     */
    let theme = "light";
</script>

<ThemeSwitch bind:theme={theme} />
<div>
    Filter
    <select bind:value={filterProp}>
        {#each columnDefinition as question}
            <option value={question.propertyPath}>
                {question.title}
            </option>
        {/each}
    </select>
    for
    <input on:input={(event) => doFilter(event)} />

    {#if filterProp.includes('.')}
        Attention: In this example, filter is only applied to the propertyPath (not on combined columns).
    {/if}
</div>
<ColumnFilter bind:columns={columnDefinition} />

<div style="
        --theme-background-color: {theme === 'light' ? '#ffffff' : '#7f8c8d'};
        --theme-headline-background-color: {theme === 'light' ? '#ffffff' : '#34495e'};
        --theme-text-color: {theme === 'light' ? '#34495e' : '#ecf0f1'};
        "
     class="table1"
>
    <ExtendedTable columns={columnDefinition} data={rows} sortingFunction={sortByWrapper}>
        <!-- Since we are operating on the original data, we can access all Properties like gender here -->
        <div slot="column-2" let:data={person}>
            {@html getGenderIcon(person)} {person.first_name} {person.last_name}
        </div>
        <tr slot="additionalRow" let:rowData={person}>
            <td colspan="3">
                Birthday: {getBirthday(person)}; Email: {person.email}
            </td>
        </tr>
    </ExtendedTable>
</div>
<Pagination totalPages={pages} activePage={activePage} on:blur={(event) => rows = getPage(event.detail.page, filteredAndSortedRows)} />

<div>
    Show
    <select bind:value={itemsPerPage} on:blur={switchShownItemsPerPage}>
        {#each [5, 10, 20] as itemsPerPage}
            <option value={itemsPerPage}>
                {itemsPerPage}
            </option>
        {/each}
    </select>
    items per Page.
</div>

<!-- extra div for scoping -->
<div class="table2">
    <ExtendedTable columns={columnDefinition} data={rows}></ExtendedTable>
</div>

<style>
    div :global(table) {
        background-color: var(--theme-background-color);
        color: var(--theme-text-color);
    }
    div :global(table.et th) {
        background-color: var(--theme-headline-background-color);
    }

    .table1 :global(.col-last_name) {
        background-color: goldenrod;
    }

    .table2 :global(.col-location_postcode) {
        transform: rotate(-45deg);
    }
</style>