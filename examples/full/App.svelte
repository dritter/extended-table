<script>
    import ExtendedTable from "../../src/ExtendedTable.svelte";
    import {default as data} from '../../fixtures/fixtures.json';
    import Pagination from "./Pagination.svelte";
    import RowFilter from "./RowFilter.svelte";

    let columnDefinition = [
        {
            title: 'Username',
            propertyPath: 'username',
        },
        {
            title: 'Name',
            value: (rowData) => `${rowData.title} ${rowData.first_name} ${rowData.last_name}`,
            propertyPath: 'last_name',
        },
        {
            title: 'Location',
            propertyPath: 'location.postcode',
        },
    ];

    /*
     * Functions for switching items per page
     */
    let itemsPerPage = 10;
    const switchShownItemsPerPage = () => {
        rerender(fullData);
    };

    /*
     * Functions for Pagination and RowFilter
     */
    let activePage = 0;
    let rows = [];
    const getPage = (page, data) => {
        activePage = page;
        let offset = (page) * itemsPerPage;

        rows = data.slice(offset, offset + itemsPerPage);
    };

    const calculatePages = (data) => {
        return Math.ceil(data.length / itemsPerPage);
    };

    let pages = 0;
    const rerender = (data) => {
        fullData = data;
        pages = calculatePages(data);
        getPage(0, data);
    };

    let fullData = [];
    const reset = () => {
        rerender(JSON.parse(JSON.stringify(data)));
    };
    reset();

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

    /**
     * Theming
     */
    let theme = "light";
</script>

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
    <RowFilter filterProp={filterProp} rows={data} on:change={(event) => rerender(event.detail)} on:reset={reset} />
    {#if filterProp.includes('.')}
        Attention: In this example, filter is only applied to the propertyPath (not on combined columns).
    {/if}
</div>
<div>
    Theme
    <label>
        <input type="radio" value="light" bind:group={theme} /> Light
    </label>
    <label>
        <input type="radio" value="dark" bind:group={theme} /> Dark
    </label>
</div>
<div style="
        --theme-background-color: {theme === 'light' ? '#ffffff' : '#7f8c8d'};
        --theme-headline-background-color: {theme === 'light' ? '#ffffff' : '#34495e'};
        --theme-text-color: {theme === 'light' ? '#34495e' : '#ecf0f1'};
        "
     class="table1"
>
    <ExtendedTable columns={columnDefinition} data={rows}>
        <!-- Since we are operating on the original data, we can as for gender here -->
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
<Pagination totalPages={pages} activePage={activePage} on:change={(event) => getPage(event.detail.page, fullData)} />

<div>
    Show
    <select bind:value={itemsPerPage} on:change={switchShownItemsPerPage}>
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