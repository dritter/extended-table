<script>
    import ExtendedTable from "../../src/ExtendedTable.svelte";
    import {default as data} from '../../fixtures/fixtures.json';

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
            value: (rowData) => `${rowData.location.postcode} ${rowData.location.state} ${rowData.location.city}`,
        },
    ];

    let rows = data.slice(0, 10);

    let theme = "light";
</script>

Theme
<label>
    <input type="radio" value="light" bind:group={theme} /> Light
</label>
<label>
    <input type="radio" value="dark" bind:group={theme} /> Dark
</label>

<!-- extra div for scoping -->
<div style="
        --theme-background-color: {theme === 'light' ? '#ffffff' : '#7f8c8d'};
        --theme-headline-background-color: {theme === 'light' ? '#ffffff' : '#34495e'};
        --theme-text-color: {theme === 'light' ? '#34495e' : '#ecf0f1'};
">
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

    div :global(tbody .row-even) {
        background: red;
    }

    div :global(.col-last_name) {
        background-color: goldenrod;
    }

    div :global(.col-location_postcode) {
        transform: rotate(-45deg);
    }
</style>