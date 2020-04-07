<script>
    import { onMount, createEventDispatcher } from 'svelte';
    import { deepValue } from '@jsier/deep-value';

    const dispatch = createEventDispatcher();

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
            dispatch('reset');
            return;
        }

        rows = rows.filter((row) => {
            let currentValue = "" + deepValue(row, filterProp);

            return currentValue.trim().toLowerCase().includes(value);
        });
        dispatch('change', rows);
    }
</script>

<label>
    <input on:input={(event) => doFilter(event)}>
</label>
