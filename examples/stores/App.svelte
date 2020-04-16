<script>
    // General
    import ExtendedTable from "../../src/ExtendedTable.svelte";

    // Stores
    import {sortColumns, activeColumn} from './stores/sorted-store';
    import {paged} from './stores/paginated-store';

    // Components
    import ThemeSwitch from "./components/ThemeSwitch.svelte";
    import RowFilter from "./components/RowFilter.svelte";
    import ColumnFilter from "./components/ColumnFilter.svelte";
    import SortModeSelector from "./components/SortModeSelector.svelte";
    import Pagination from "./components/Pagination.svelte";
    import ItemsPerPageSelector from "./components/ItemsPerPageSelector.svelte";

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

    // Set sortColumns initially
    sortColumns.set(columnDefinition);
    const sortByWrapper = (column, columns, innerRows, multisort, cacheClearCallback) => {
        // We only need to set the active column in the store.
        // The rest is done by the sorted-store.
        activeColumn.set(column);
    };

    const getBirthday = (person) => {
        if (!person.birthdate) {
            return "Unknown";
        }

        let birthday = new Date(person.birthdate * 1000);
        return birthday.toLocaleDateString();
    };

    let theme = "light";
</script>

<ThemeSwitch bind:theme={theme} />

<RowFilter columnDefinition={columnDefinition} />
<ColumnFilter bind:columns={columnDefinition} />
<SortModeSelector />

<div style="
        --theme-background-color: {theme === 'light' ? '#ffffff' : '#7f8c8d'};
        --theme-headline-background-color: {theme === 'light' ? '#ffffff' : '#34495e'};
        --theme-text-color: {theme === 'light' ? '#34495e' : '#ecf0f1'};
        "
     class="table1"
>
    <ExtendedTable data={$paged} columns={columnDefinition} sortingFunction={sortByWrapper}>
        <!-- Since we are operating on the original data, we can access all Properties like gender here -->
        <div slot="column-2" let:data={person}>
            {#if person.gender === 'male'}&#9794;{:else}&#9792;{/if} {person.first_name} {person.last_name}
        </div>
        <tr slot="additionalRow" let:rowData={person}>
            <td colspan="3">
                Birthday: {getBirthday(person)}; Email: {person.email}
            </td>
        </tr>
    </ExtendedTable>
</div>

<Pagination />
<ItemsPerPageSelector />

<div class="table2">
    <ExtendedTable data={$paged} columns={columnDefinition} />
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