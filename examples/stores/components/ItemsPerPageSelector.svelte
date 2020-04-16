<script>
    import { itemsPerPage } from '../stores/paginated-store';
</script>

<div>
    Show
    <select bind:value={$itemsPerPage}>
        {#each [5, 10, 20] as itemsPerPage}
            <option value={itemsPerPage}>
                {itemsPerPage}
            </option>
        {/each}
    </select>
    items per Page.
</div>