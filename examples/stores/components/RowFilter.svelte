<script>
    import { filterProp, filterValue } from '../stores/filtered-store';

    export let columnDefinition = [];

    // Initial
    filterProp.set(columnDefinition[0].propertyPath);
</script>

<div>
    Filter
    <select bind:value={$filterProp}>
        {#each columnDefinition as question}
            <option value={question.propertyPath}>
                {question.title}
            </option>
        {/each}
    </select>
    for
    <input bind:value={$filterValue} />

    {#if $filterProp.includes('.')}
        Attention: In this example, filter is only applied to the propertyPath (not on combined columns).
    {/if}
</div>
