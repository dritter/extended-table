<script>
    import ExtendedTable from "../../src/ExtendedTable.svelte";
    import RowFilter from "./RowFilter.svelte";

    import { default as data } from '../../fixtures/fixtures.json';
    // Data needs to be writable
    let rows = data;

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

    let filterProp = "username";
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
    <RowFilter filterProp={filterProp} bind:rows={rows} />
    {#if filterProp.includes('.')}
        Attention: In this example, filter is only applied to the propertyPath (not on combined columns).
    {/if}
</div>

<ExtendedTable columns={columnDefinition} data={rows}></ExtendedTable>