<script>
    import ExtendedTable from "../../src/ExtendedTable.svelte";
    import Pagination from "./Pagination.svelte";
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

    let rows = [];
    let itemsPerPage = 10;
    const getPage = (page) => {
        let offset = (page) * itemsPerPage;

        rows = data.slice(offset, offset + itemsPerPage);
    };
    getPage(0);

    let pages = Math.ceil(data.length / itemsPerPage);
</script>

<ExtendedTable columns={columnDefinition} data={rows}></ExtendedTable>
<Pagination totalPages={pages} on:change={(event) => getPage(event.detail.page)} />
