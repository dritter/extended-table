<script>
    import { onMount } from 'svelte';
    import { deepValue } from '@jsier/deep-value';
    import { sortByDefinition } from './sortBy';
    import { getHeadlineClasses, getRowClasses, getCellClasses } from './cssClassNames';

    export let data = [];
    export let columns = [];
    export let rows = {
        classNames: [],
    };
    const defaultRowClickHandler = (row) => true;
    export let onRowClick = defaultRowClickHandler;

    export let iconAsc = '↑';
    export let iconDesc = '↓';
    export let initialSortBy = null; // PropertyPath
    export let initialSortDirection = 'asc';
    export let showSortIndicatorsOnInitialSort = true;
    export let collapsedPlaceholder = '...';
    export let stickyHeaders = true;
    export let stickyOffset = 0;
    export let expandAll = false;
    export let autoCollapse = false;
    export let multisort = true;
    export let sortingFunction = null;

    if (sortingFunction === null) {
        (async () => {
            // Dynamic import
            let sortByObj = await import('./sortBy');
            sortingFunction = sortByObj.sortByColumn;
        })();
    }

    const clearCaches = () => {
        columns = columns;
        data = data;
    };

    let windowWidth;
    let table;
    onMount(() => {
        let heads = table.querySelectorAll('thead th');

        if (autoCollapse) {
            let tableRect = table.getBoundingClientRect();

            let viewportWidth = windowWidth - tableRect.left;
            let cumulatedHeadWidths = 0;
            for (let i = 0; i < heads.length; i++) {
                let head = heads[i];
                let rect = head.getBoundingClientRect();

                if (cumulatedHeadWidths + rect.width > viewportWidth) {
                    if (expandAll) {
                        columns.filter((column, index) => index >= (i - 1))
                                .map((column) => column.hidden = true);
                        columns[i].hidden = false;
                        columns[i].collapsed = true;
                    } else {
                        columns.filter((column, index) => index >= i)
                            .map((column) => column.collapsed = true);
                    }

                    clearCaches();
                    break;
                }

                cumulatedHeadWidths += rect.width;
            }
        }
    });

    if (initialSortBy) {
        if (showSortIndicatorsOnInitialSort) {
            const initialSortColumn = columns.find((c) => c.propertyPath === initialSortBy);
            initialSortColumn.propertyPath = initialSortBy;
            initialSortColumn.direction = initialSortDirection;
        }
        const def = {};
        def[initialSortDirection] = (u) => {
            return deepValue(u, initialSortBy);
        };
        sortByDefinition(data, [def]);
    }

    const expandColumn = (column) => {
        if (expandAll) {
            columns.map((column) => {
                column.collapsed = false;
                column.hidden = false;
            });
        } else {
            column.collapsed = false;
        }
        clearCaches();
    };

    const onCellClick = (event, column, data, columnIndex) => {
        if (typeof column.clickHandler === 'function') {
            event.stopPropagation();
            column.clickHandler(data, columnIndex);
        }
    }

    let slots = new Set($$props.$$slots ? Object.getOwnPropertyNames($$props.$$slots) : []);
</script>

<style>
    .mouse-pointer:hover {
        cursor: pointer;
    }

    tbody tr:hover {
        background-color: rgba(0, 0, 0, 0.1);
    }

    table td {
        margin: 0;
        padding: .5rem .625rem .625rem;
    }

    th {
        background-color: rgb(255, 255, 255);
        border-bottom: 2px solid rgb(51, 51, 51);
        font-size: 110%;
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
        border-spacing: 0;
    }

    .hidden {
        display: none;
    }

    .sticky {
        position: sticky;
        top: var(--sticky-offset, 0);
    }
</style>

<svelte:window bind:innerWidth={windowWidth} />
<table bind:this={table} style="--sticky-offset:{stickyOffset}" class="{$$props.class}">
    <thead>
        <tr>
            {#each columns as column, columnHeaderIndex}
                <th on:click={() => sortingFunction(column, columns, data, multisort, clearCaches)} class="{getHeadlineClasses(columnHeaderIndex, column)}" class:hidden={column.hidden} class:sticky={stickyHeaders}>
                    {#if column.collapsed}
                        <div on:click|stopPropagation={expandColumn(column)}>
                            {@html collapsedPlaceholder}
                        </div>
                    {:else}
                        {@html column.title}
                        {#if column.direction === 'asc'}
                            {iconAsc}
                        {:else if column.direction === 'desc'}
                            {iconDesc}
                        {/if}
                    {/if}
                </th>
            {/each}
        </tr>
        <slot name="additionalHeaderRow"></slot>
    </thead>
    <tbody>
        {#each data as d, rowIndex}
            <tr on:click={() => onRowClick(d)} class="{getRowClasses(rowIndex, rows.classNames, d)}" class:mouse-pointer={onRowClick !== defaultRowClickHandler}>
                {#each columns as column, columnIndex}
                    <td on:click={(event) => onCellClick(event, column, d, columnIndex)} class="{getCellClasses(columnIndex, rowIndex, column, d)}" class:hidden={column.hidden}>
                        {#if column.collapsed}
                            <div class="mouse-pointer" on:click|stopPropagation={expandColumn(column)}>
                                {@html collapsedPlaceholder}
                            </div>
                        {:else}
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
                        {/if}
                    </td>
                {/each}
            </tr>
            <slot name="additionalRow" rowData={d}></slot>
        {/each}
    </tbody>
</table>
