<script>
    import { onMount } from 'svelte';
    import { deepValue } from '@jsier/deep-value';

    export let rows = [];
    export let filterProp = '';
    let originalRows = [];

    onMount(() => {
        // Backup
        originalRows = JSON.parse(JSON.stringify(rows));
    });

    const reset = () => rows = originalRows;

    const doFilter = (event) => {
        reset();
        let value = event.target.value.trim().toLowerCase();
        if (!value) {
            return;
        }

        rows = rows.filter((row) => {
            let currentValue = "" + deepValue(row, filterProp);

            return currentValue.trim().toLowerCase().includes(value);
        });
    }
</script>

<label>
    <input on:input={(event) => doFilter(event)}>
</label>
