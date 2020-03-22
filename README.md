# ExtendedTable

## Usage

```html
<script>
    import ExtendedTable from "extended-table";
    
    let rows = [
        { startnumber: {number: 1}},
        { startnumber: {number: 2}},
        { startnumber: {number: 3}},
        { startnumber: {number: 4}},
    ];
    
    let columnDefinition = [
        {
            title: 'Start&shy;number',
            propertyPath: 'startnumber.number'
        },
    ];
</script>

<ExtendedTable columns={columnDefinition} data={rows}>
</ExtendedTable>
```

## Features

### Sorting

To make a column sortable, set `sortable: true` in the column definition. The
column needs to have a property path set to make sorting work.

Initial sorting could be controlled via the props `initialSortBy` and
`initialSortDirection`, where `initialSortBy` is a property path (string).

### Flexible Rendering

The easiest way to render a column is to provide a `propertyPath`. This could
even be in nested Object. Have a look at [deep-value](https://github.com/seidme/jsier/tree/master/deep-value#usage)
to see more ways how to express paths.

To render slightly more complex data you could specify `value`, that needs to
be a function:
```JavaScript
    value: (rowData, rowIndex, columnIndex) => `Place ${rowIndex + 1}: ${rowData.name}`
```

If this is not enough, you could render columns as slots. You could currently
specify no more than 20 slots due to a [limitation in Svelte](https://github.com/sveltejs/svelte/issues/3480). All slots are
named `column-X`, `X` being the number:
```html
<ExtendedTable columns={columnDefinition} data={rows}>
    <div slot="column-1" let:data={person} let:rowIndex={index}>
        <Person person="{person}" on:edited={event => setValue(event.detail, index)}></Person>
    </div>
</ExtendedTable>
```

Of course, all three ways can be combined per Table. On a column level you have to
decide on one way.

### ClickHandlers

To specify what happens when you click on a Row, you could set the `onRowClick`
property. This should be a callback function.

For controlling what happens if you click a table cell, you could add a `clickHandler`
on the column definition.

### Collapsible Columns

If you have very large columns, you can render them as collapsible by setting
`collapsed: false` on the column definition.

### Sticky Headers

Just set the `stickyHeaders={true}` prop, and you are ready. Please note, that
specifying an overflow on a parent element will break the stickyness.

Additionally, you could define an offset, if you use fixed elements above (like
a navigation header). Set `stickyOffset="100px"`.

## Limitations

This component aims for comfort more than for performance. So if you want to
display thousands of rows, you may run into performance issues.

## FAQ

### How to add an extra row with colspan?

This could be done, if you fill the slot `additionalRow`. You'll get the data
as `rowData`. Example:
```html
    <tr slot="additionalRow" let:rowData={crew} class="keep-together">
        <td colspan="7">
            <MyOtherComponent myProp={crew} />
        </td>
    </tr>
```

### Why is there no pagination?

IMHO, putting a pagination into this component would be too much. This should
be done from outside.

### How can I filter rows?

Like pagination this should be done from the outside. So its up to you to add
a filter.

## Dependencies

Currently there are two dependencies:
  - [fast-sort](https://github.com/snovakovic/fast-sort) for sorting
  - [deep-value](https://github.com/seidme/jsier/tree/master/deep-value) for
    propertyPath resolution

## TODO

This component is still not done. There are some open points:
  - [ ] Make headers sticky optionally.
  - [ ] Add Theming. Currently all styles are static.
  - [ ] Improve Responsiveness. It would be nice to control collapsing columns
        on small screens. Like [this](https://codepen.io/SitePoint/pen/LEwdjw) or [this](https://codepen.io/AllThingsSmitty/pen/MyqmdM).
  - [ ] Perfomance Testing
  - [ ] Add examples for combining with filtering / pagination.
  - [ ] Add Unit Tests.
  - [ ] Create NPM package
  - [ ] Add WAI-ARIA attributes
