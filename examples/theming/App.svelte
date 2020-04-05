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
</script>

<!-- extra div for scoping -->
<div>
    <ExtendedTable columns={columnDefinition} data={rows}></ExtendedTable>
</div>

<style>
    div :global(.col-last_name) {
        background-color: goldenrod;
    }

    div :global(.col-location_postcode) {
        transform: rotate(-45deg);
    }
</style>