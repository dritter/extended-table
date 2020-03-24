<script>
    import { onMount } from 'svelte';
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
    export let collapsedPlaceholder = '...';
    export let stickyHeaders = true;
    export let stickyOffset = 0;
    export let expandAll = false;
    export let autoCollapse = false;

    const clearCaches = () => {
        columns = columns;
        data = data;
    };

    let windowWidth;
    let table;
    onMount(() => {
        if (autoCollapse) {
            let heads = table.querySelectorAll('thead th');
            let tableRect = table.getBoundingClientRect();

            let viewportWidth = windowWidth - tableRect.left;
            let cumulatedHeadWidths = 0;
            for (let i = 0; i <= heads.length; i++) {
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
            clearCaches();
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
        clearCaches();
    };

    if (initialSortBy) {
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

    th {
        font-weight: 700;
    }

    th.sticky {
        background: #fff;
        position: sticky;
        top: var(--sticky-offset);
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
        position: relative;
        width: 100%;
    }

    .hidden {
        display: none;
    }
</style>

<svelte:window bind:innerWidth={windowWidth} />
<table style="--sticky-offset:{stickyOffset}" bind:this={table}>
    <thead>
        <tr>
            {#each columns as column}
                <th on:click={() => sortBy(column)} class="{ column.sortable ? 'mouse-pointer' : ''}" class:sticky={stickyHeaders} class:hidden={column.hidden}>
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
            <tr on:click={() => onRowClick(d)} class="{getRowClasses(rowIndex)}" class:mouse-pointer={onRowClick !== defaultRowClickHandler}>
                {#each columns as column, columnIndex}
                    {#if column.clickHandler}
                        <td on:click|stopPropagation={() => column.clickHandler(d)}  class="{getColumnClasses(columnIndex, column.propertyPath)}"  class:hidden={column.hidden}>
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
                    {:else}
                        <td class="{getColumnClasses(columnIndex, column.propertyPath)}" class:hidden={column.hidden}>
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
                    {/if}
                {/each}
            </tr>
            <slot name="additionalRow" rowData={d}></slot>
        {/each}
    </tbody>
</table>