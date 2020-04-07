<script>
    export let columns = [];

    let showColumns = false;

    const toggleShow = () => {
        showColumns = !showColumns;

        columns = columns;
    };

    const toggleColumn = (column) => {
        column.hidden = !column.hidden;

        columns = columns;
    };
</script>

<div class="container" style="height: {showColumns ? (columns.length + 1.5) : '1.5'}em;">
    <button on:click={toggleShow}>Filter Columns</button>

    {#if showColumns}
        <div class="columns--open">
            {#each columns as column}
                <div on:click={() => toggleColumn(column)} class="mouse-pointer">
                    {#if column.hidden}
<!--                        <span class="unchecked">&#x274C;</span>-->
                        <span class="unchecked">&#x2612;</span>
                    {:else}
<!--                        <span class="checked">&#x2714;</span>-->
                        <span class="checked">&#x2611;</span>
                    {/if}
                    {@html column.title}
                </div>
            {/each}
        </div>
    {/if}
</div>

<style>
    .container {
        position: relative;
        z-index: 5;
    }

    .columns--open {
        background-color: #fff;
        position: absolute;
        top: 1.2em;
        left: 0;
    }

    .mouse-pointer:hover {
        cursor: pointer;
    }

    .checked {
        color: green;
    }

    .unchecked {
        color: firebrick;
    }
</style>