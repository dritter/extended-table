# Troubleshooting

## Initial Sort does not work

<details>
  <summary>This may happen if you render the table prematurely.</summary>
  
:x: **Does not work**:
```html
<script>
// Does not work
import { onMount } from 'svelte';

let columns = [{title: 'first'}, {title: 'second'}];
let rows = [];
onMount(async () => {
    rows = await BackendService.getAll();
});
</script>

<ExtendedTable columns={columns} data={rows}></ExtendedTable>
```

:heavy_check_mark: **Works**
```html
<script>
let columns = [{title: 'first'}, {title: 'second'}];
let rows = BackendService.getAll();
</script>

{#await rows then rows}
    <ExtendedTable columns={columns} data={rows}></ExtendedTable>
{/await}
```
</details>