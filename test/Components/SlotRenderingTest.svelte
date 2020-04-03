<script>
    import ExtendedTable from '../../src/ExtendedTable.svelte'

    const rows = [
        { col1: {subprop: 1}, col2: "xabc", unrelated: "test1", col3: "hier ist zzz"},
        { col1: {subprop: 2}, col2: "test", unrelated: "test2", col3: "hier ist zzzX"},
        { col1: {subprop: 3}, col2: "zzz", unrelated: "test3", col3: "hier ist zzzA"},
        { col1: {subprop: 4}, col2: "bla", unrelated: "test4", col3: "hier ist zzzT"},
    ];

    let columnDefinition = [
        {
            title: 'Column1',
            propertyPath: 'col1.subprop',
        },
        {
            title: 'Column2',
            // Necessary to generate the appropriate column classes, even
            // if we do not need it for rendering.
            propertyPath: 'col2',
        },
        {
            title: 'Column3',
            propertyPath: 'col3',
        },
    ];

    const getNewName = (val) => 'new-' + val;
</script>

<ExtendedTable columns={columnDefinition} data={rows}>
    <div slot="column-2" let:data={row}>{getNewName(row.col2)}</div>
</ExtendedTable>