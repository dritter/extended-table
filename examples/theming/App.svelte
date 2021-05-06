<script>
    import ExtendedTable from "../../src/ExtendedTable.svelte";
    import {default as rawData} from '../../fixtures/fixtures.json';

    let columnDefinition = [
        {
            title: 'Username',
            propertyPath: 'username',
            headerClassName: 'headline__username',
        },
        {
            title: 'Name',
            value: (rowData) => `${rowData.title} ${rowData.first_name} ${rowData.last_name}`,
            propertyPath: 'last_name',
            className: {
                propertyPath: 'username',
                value: (rowData, column, columnIndex, rowIndex) => rowData.username === 'goldenkoala410' ? 'success' : '',
            }
        },
        {
            title: 'Location',
            propertyPath: 'location.postcode',
            value: (rowData) => `${rowData.location.postcode} ${rowData.location.state} ${rowData.location.city}`,
            headerClassName: {
                value: (columnDefinition) => columnDefinition.propertyPath + '-TEST',
            }
        },
    ];

    let rowCssClasses = [
        {className: {propertyPath: 'location.postcode'}},
        {className: {value: (data, row, rowIndex) => (rowIndex + 1) % 2 === 0 ? data.last_name : ""}},
        {className: {value: (data, row, rowIndex) => data.title === "mr" ? "male my-other-class" : ""}},
    ];

    let data = rawData.slice(0, 10);

    let theme = "light";
</script>

Theme
<label>
    <input type="radio" value="light" bind:group={theme} /> Light
</label>
<label>
    <input type="radio" value="dark" bind:group={theme} /> Dark
</label>

<!-- extra divs for scoping to win the specificity wars :( -->
<div>
    <div style="
            --theme-background-color: {theme === 'light' ? '#ffffff' : '#7f8c8d'};
            --theme-headline-background-color: {theme === 'light' ? '#ffffff' : '#34495e'};
            --theme-text-color: {theme === 'light' ? '#34495e' : '#ecf0f1'};
    ">
        <ExtendedTable columns={columnDefinition} data={data} rowCssClasses={rowCssClasses}></ExtendedTable>
    </div>
</div>

<style>
    div :global(table) {
        background-color: var(--theme-background-color);
        color: var(--theme-text-color);
    }
    div :global(table.et th) {
        background-color: var(--theme-headline-background-color);
    }

    div div :global(tbody .row-even) {
        background-color: red;
    }

    div div :global(tbody .goldenkoala410.success) {
        background-color: green;
    }

    div :global(.col-last_name) {
        background-color: goldenrod;
    }

    div :global(.col-location_postcode) {
        transform: rotate(-45deg);
    }

    div :global(tbody tr.male) {
        background-color: #2793da;
    }
</style>
