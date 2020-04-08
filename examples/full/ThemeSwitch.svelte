<script>
    export let theme = "light";
</script>

<div>
    Theme
    <label>
        <input type="radio" value="light" bind:group={theme} /> Light
    </label>
    <label>
        <input type="radio" value="dark" bind:group={theme} /> Dark
    </label>
</div>