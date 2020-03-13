<script>
    import { deepValue } from '@jsier/deep-value';
    import { sortByDefinition } from './sortBy';

    export let data = [];
    export let columns = [];
    const defaultRowClickHandler = (row) => true;
    export let onRowClick = defaultRowClickHandler;

    export let iconAsc = '↑';
    export let iconDesc = '↓';
    export let initialSortBy = null;
    export let initialSortDirection = 'asc';

    let sortDefinition = new Set();

    const sortBy = (column) => {
        if (!column.sortable) {
            return;
        }

        if (sortDefinition.has(column) && column.direction === 'desc') {
            sortDefinition.delete(column);
            column.direction = '';
        } else if (sortDefinition.has(column)) {
            column.direction = 'desc';
        } else {
            column.direction = 'asc';
            sortDefinition.add(column);
        }
        const sortDefinitionArray = Array.from(sortDefinition.values());

        if (!sortDefinitionArray || !sortDefinitionArray.length) {
            columns = columns;
            return;
        }
        sortByDefinition(
            data,
            sortDefinitionArray.map((def) => {
                const newDef = {};
                newDef[def.direction || 'asc'] = (u) => {
                    return deepValue(u, def.propertyPath);
                };
                return newDef;
            })
        );
        // Invalidate cache
        data = data;
        columns = columns;
    };

    if (initialSortBy) {
        const def = {};
        def[initialSortDirection] = (u) => {
            return deepValue(u, initialSortBy);
        };
        sortByDefinition(data, [def]);
    }

    const getClasses = (classes, index, prefix) => {
        if (index % 2 === 0) {
            classes.push('even');
        } else {
            classes.push('odd');
        }

        return classes.map((c) => prefix + '-' + c)
            .join(" ");
    };

    const slugEx = new RegExp(/[^a-z0-9]/g);
    const sluggify = (input) => {
        return input.replace(slugEx, '_');
    };

    const getColumnClasses = (index, propertyPath) => {
        let classes = [];
        propertyPath && classes.push(sluggify(propertyPath));

        return getClasses(classes, index, 'col');
    };

    const getRowClasses = (index) => {
        return getClasses([], index, 'row');
    };

    let slots = new Set($$props.$$slots ? Object.getOwnPropertyNames($$props.$$slots) : []);
</script>

<style>
    .mouse-pointer:hover {
        cursor: pointer;
    }

    tbody tr:hover {
        background-color: rgba(0, 0, 0, 0.1) !important;
    }

    table td {
        margin: 0;
        padding: .5rem .625rem .625rem;
    }

    thead td {
        font-weight: 700;
    }

    tbody .row-even {
        background: rgba(153, 202, 255, 0.15);
        border-bottom: 0;
    }

    tbody .col-even {
        background: rgba(153, 202, 255, 0.15);
    }

    table {
        border-collapse: collapse;
        border-spacing: 0;
    }

    .scroll-wrapper {
        width: 100%;
        overflow: scroll;
    }
</style>

<div class="scroll-wrapper">
<table>
    <thead>
        <tr>
            {#each columns as column}
                <td on:click={() => sortBy(column)} class="{ column.sortable ? 'mouse-pointer' : ''}">
                    {@html column.title}
                    {#if column.direction === 'asc'}
                        {iconAsc}
                    {:else if column.direction === 'desc'}
                        {iconDesc}
                    {/if}
                </td>
            {/each}
        </tr>
    </thead>
    <tbody>
        {#each data as d, rowIndex}
            <tr on:click={() => onRowClick(d)} class="{getRowClasses(rowIndex)}" class:mouse-pointer={onRowClick !== defaultRowClickHandler}>
                {#each columns as column, columnIndex}
                    {#if column.clickHandler}
                        <td on:click|stopPropagation={() => column.clickHandler(d)}  class="{getColumnClasses(columnIndex, column.propertyPath)}">
                            {#if data && slots.has('column-' + (columnIndex + 1))}
                                {#if columnIndex === 0}
                                    <slot name="column-1" data={d} rowIndex={rowIndex} columnIndex={columnIndex}></slot>
                                {:else if columnIndex === 1}
                                    <slot name="column-2" data={d} rowIndex={rowIndex} columnIndex={columnIndex}></slot>
                                {:else if columnIndex === 2}
                                    <slot name="column-3" data={d} rowIndex={rowIndex} columnIndex={columnIndex}></slot>
                                {:else if columnIndex === 3}
                                    <slot name="column-4" data={d} rowIndex={rowIndex} columnIndex={columnIndex}></slot>
                                {:else if columnIndex === 4}
                                    <slot name="column-5" data={d} rowIndex={rowIndex} columnIndex={columnIndex}></slot>
                                {:else if columnIndex === 5}
                                    <slot name="column-6" data={d} rowIndex={rowIndex} columnIndex={columnIndex}></slot>
                                {:else if columnIndex === 6}
                                    <slot name="column-7" data={d} rowIndex={rowIndex} columnIndex={columnIndex}></slot>
                                {:else if columnIndex === 7}
                                    <slot name="column-8" data={d} rowIndex={rowIndex} columnIndex={columnIndex}></slot>
                                {:else if columnIndex === 8}
                                    <slot name="column-9" data={d} rowIndex={rowIndex} columnIndex={columnIndex}></slot>
                                {:else if columnIndex === 9}
                                    <slot name="column-10" data={d} rowIndex={rowIndex} columnIndex={columnIndex}></slot>
                                {:else if columnIndex === 10}
                                    <slot name="column-11" data={d} rowIndex={rowIndex} columnIndex={columnIndex}></slot>
                                {:else if columnIndex === 11}
                                    <slot name="column-12" data={d} rowIndex={rowIndex} columnIndex={columnIndex}></slot>
                                {:else if columnIndex === 12}
                                    <slot name="column-13" data={d} rowIndex={rowIndex} columnIndex={columnIndex}></slot>
                                {:else if columnIndex === 13}
                                    <slot name="column-14" data={d} rowIndex={rowIndex} columnIndex={columnIndex}></slot>
                                {:else if columnIndex === 14}
                                    <slot name="column-15" data={d} rowIndex={rowIndex} columnIndex={columnIndex}></slot>
                                {:else if columnIndex === 15}
                                    <slot name="column-16" data={d} rowIndex={rowIndex} columnIndex={columnIndex}></slot>
                                {:else if columnIndex === 16}
                                    <slot name="column-17" data={d} rowIndex={rowIndex} columnIndex={columnIndex}></slot>
                                {:else if columnIndex === 17}
                                    <slot name="column-18" data={d} rowIndex={rowIndex} columnIndex={columnIndex}></slot>
                                {:else if columnIndex === 18}
                                    <slot name="column-19" data={d} rowIndex={rowIndex} columnIndex={columnIndex}></slot>
                                {:else if columnIndex === 19}
                                    <slot name="column-20" data={d} rowIndex={rowIndex} columnIndex={columnIndex}></slot>
                                {/if}
                            {:else if column.hasOwnProperty('value')}
                                {column.value(d, rowIndex, columnIndex)}
                            {:else if column.propertyPath}
                                {deepValue(d, column.propertyPath)}
                            {/if}
                        </td>
                    {:else}
                        <td class="{getColumnClasses(columnIndex, column.propertyPath)}">
                            {#if data && slots.has('column-' + (columnIndex + 1))}
                                {#if columnIndex === 0}
                                    <slot name="column-1" data={d} rowIndex={rowIndex} columnIndex={columnIndex}></slot>
                                {:else if columnIndex === 1}
                                    <slot name="column-2" data={d} rowIndex={rowIndex} columnIndex={columnIndex}></slot>
                                {:else if columnIndex === 2}
                                    <slot name="column-3" data={d} rowIndex={rowIndex} columnIndex={columnIndex}></slot>
                                {:else if columnIndex === 3}
                                    <slot name="column-4" data={d} rowIndex={rowIndex} columnIndex={columnIndex}></slot>
                                {:else if columnIndex === 4}
                                    <slot name="column-5" data={d} rowIndex={rowIndex} columnIndex={columnIndex}></slot>
                                {:else if columnIndex === 5}
                                    <slot name="column-6" data={d} rowIndex={rowIndex} columnIndex={columnIndex}></slot>
                                {:else if columnIndex === 6}
                                    <slot name="column-7" data={d} rowIndex={rowIndex} columnIndex={columnIndex}></slot>
                                {:else if columnIndex === 7}
                                    <slot name="column-8" data={d} rowIndex={rowIndex} columnIndex={columnIndex}></slot>
                                {:else if columnIndex === 8}
                                    <slot name="column-9" data={d} rowIndex={rowIndex} columnIndex={columnIndex}></slot>
                                {:else if columnIndex === 9}
                                    <slot name="column-10" data={d} rowIndex={rowIndex} columnIndex={columnIndex}></slot>
                                {:else if columnIndex === 10}
                                    <slot name="column-11" data={d} rowIndex={rowIndex} columnIndex={columnIndex}></slot>
                                {:else if columnIndex === 11}
                                    <slot name="column-12" data={d} rowIndex={rowIndex} columnIndex={columnIndex}></slot>
                                {:else if columnIndex === 12}
                                    <slot name="column-13" data={d} rowIndex={rowIndex} columnIndex={columnIndex}></slot>
                                {:else if columnIndex === 13}
                                    <slot name="column-14" data={d} rowIndex={rowIndex} columnIndex={columnIndex}></slot>
                                {:else if columnIndex === 14}
                                    <slot name="column-15" data={d} rowIndex={rowIndex} columnIndex={columnIndex}></slot>
                                {:else if columnIndex === 15}
                                    <slot name="column-16" data={d} rowIndex={rowIndex} columnIndex={columnIndex}></slot>
                                {:else if columnIndex === 16}
                                    <slot name="column-17" data={d} rowIndex={rowIndex} columnIndex={columnIndex}></slot>
                                {:else if columnIndex === 17}
                                    <slot name="column-18" data={d} rowIndex={rowIndex} columnIndex={columnIndex}></slot>
                                {:else if columnIndex === 18}
                                    <slot name="column-19" data={d} rowIndex={rowIndex} columnIndex={columnIndex}></slot>
                                {:else if columnIndex === 19}
                                    <slot name="column-20" data={d} rowIndex={rowIndex} columnIndex={columnIndex}></slot>
                                {/if}
                            {:else if column.hasOwnProperty('value')}
                                {column.value(d, rowIndex, columnIndex)}
                            {:else if column.propertyPath}
                                {deepValue(d, column.propertyPath)}
                            {/if}
                        </td>
                    {/if}
                {/each}
            </tr>
            <slot name="additionalRow" rowData={d}></slot>
        {/each}
    </tbody>
</table>
</div>