<script>
    import { onMount } from 'svelte';
    import { deepValue } from '@jsier/deep-value';
    import stickybits from 'stickybits/dist/stickybits.es';
    import { sortByDefinition, sortByColumn } from './sortBy';
    import { getHeadlineClasses, getRowClasses, getCellClasses } from './cssClassNames';

    export let data = [];
    const defaultRowClickHandler = (row) => true;
    export let onRowClick = defaultRowClickHandler;

    export let config = {}
    const defaults = {
        sorting: {
            iconAsc: '↑',
            iconDesc: '↓',
            multisort: true, // or multicolumn?
            function: sortByColumn,
            initial: {
                propertyPath: null,
                direction: 'asc',
                showSortIndicators: true,
            },
        },
        collapsing: {
            automatically: false,
            expandAll: false,
            placeholder: '...',
        },
        sticky: {
            headers: true,
            offset: 0,
        },
        columns: [],
        rows: {
            classNames: [],
        },
    };

    const mergeConfig = (target, source) => {
        for (const key of Object.keys(source)) {
            if (source[key] instanceof Object && key in target) {
                Object.assign(source[key], mergeConfig(target[key], source[key]))
            }
        }

        Object.assign(target || {}, source)
        return target
    }

    const _config = mergeConfig(defaults, config)

    const clearCaches = () => {
        _config.columns = _config.columns;
        data = data;
    };

    let windowWidth;
    let table;
    onMount(() => {
        let heads = table.querySelectorAll('thead th');
        if (_config.sticky.headers) {
            stickybits(heads, {stickyBitStickyOffset: _config.sticky.offset});
        }

        if (_config.collapsing.automatically) {
            let tableRect = table.getBoundingClientRect();

            let viewportWidth = windowWidth - tableRect.left;
            let cumulatedHeadWidths = 0;
            for (let i = 0; i < heads.length; i++) {
                let head = heads[i];
                let rect = head.getBoundingClientRect();

                if (cumulatedHeadWidths + rect.width > viewportWidth) {
                    if (_config.collapsing.expandAll) {
                        _config.columns.filter((column, index) => index >= (i - 1))
                                .map((column) => column.hidden = true);
                        _config.columns[i].hidden = false;
                        _config.columns[i].collapsed = true;
                    } else {
                        _config.columns.filter((column, index) => index >= i)
                            .map((column) => column.collapsed = true);
                    }

                    clearCaches();
                    break;
                }

                cumulatedHeadWidths += rect.width;
            }
        }
    });

    if (_config.sorting.initial.propertyPath) {
        if (_config.sorting.initial.showSortIndicators) {
            const initialSortColumn = _config.columns.find((c) => c.propertyPath === _config.sorting.initial.propertyPath);
            initialSortColumn.propertyPath = _config.sorting.initial.propertyPath;
            initialSortColumn.direction = _config.sorting.initial.direction;
        }
        const def = {};
        def[_config.sorting.initial.direction] = (u) => {
            return deepValue(u, _config.sorting.initial.propertyPath);
        };
        sortByDefinition(data, [def]);
    }

    const expandColumn = (column) => {
        if (_config.collapsing.expandAll) {
            _config.columns.map((column) => {
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

    .overflow-container {
        max-width: 100vw;
        position: relative;
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
</style>

<svelte:window bind:innerWidth={windowWidth} />
<div class="overflow-container">
<table bind:this={table} class="et">
    <thead>
        <tr>
            {#each _config.columns as column, columnHeaderIndex}
                <th on:click={() => _config.sorting.function(column, _config.columns, data, _config.sorting.multisort, clearCaches)} class="{getHeadlineClasses(columnHeaderIndex, column)}" class:hidden={column.hidden}>
                    {#if column.collapsed}
                        <div on:click|stopPropagation={expandColumn(column)}>
                            {@html _config.collapsing.placeholder}
                        </div>
                    {:else}
                        {@html column.title}
                        {#if column.direction === 'asc'}
                            {_config.sorting.iconAsc}
                        {:else if column.direction === 'desc'}
                            {_config.sorting.iconDesc}
                        {/if}
                    {/if}
                </th>
            {/each}
        </tr>
        <slot name="additionalHeaderRow"></slot>
    </thead>
    <tbody>
        {#each data as d, rowIndex}
            <tr on:click={() => onRowClick(d)} class="{getRowClasses(rowIndex, _config.rows.classNames, d)}" class:mouse-pointer={onRowClick !== defaultRowClickHandler}>
                {#each _config.columns as column, columnIndex}
                    <td on:click={(event) => onCellClick(event, column, d, columnIndex)} class="{getCellClasses(columnIndex, rowIndex, column, d)}" class:hidden={column.hidden}>
                        {#if column.collapsed}
                            <div class="mouse-pointer" on:click|stopPropagation={expandColumn(column)}>
                                {@html _config.collapsing.placeholder}
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
</div>