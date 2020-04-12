<script>
    import { onMount, createEventDispatcher } from 'svelte';

    const dispatch = createEventDispatcher();

    export let rows = [];
    export let filterProp = '';
    export let filterCallback = null;

    if (filterCallback === null) {
        // Dynamic import
        import('./rowFilter').then((filterObj) => {
            console.log(filterObj);
            filterCallback = filterObj.filter;
        });
    }

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

        rows = filterCallback(rows, filterProp, value);
        dispatch('change', rows);
    }
</script>

<label>
    <input on:input={(event) => doFilter(event)}>
</label>
