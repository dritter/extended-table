<script>
    import {multisort} from '../stores/sorted-store';
    import { resetSorting } from "../../../src/sortBy";

    let sortMode = $multisort;

    const changeSortMode = (value) => {
        resetSorting();
        multisort.set(value);
    }
</script>

<div>
    Sort
    <label>
        <input type="radio" value={true} bind:group={sortMode} on:change={() => changeSortMode(true)} /> multiple columns
    </label>
    <label>
        <input type="radio" value={false} bind:group={sortMode} on:change={() => changeSortMode(false)} /> single columns
    </label>
</div>