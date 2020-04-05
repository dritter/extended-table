# Theming

ExtendedTable sets a variety of css classes, so that you can style your table easily. Only drawback is that it have to be global styles.
 You can add elements around the component to add more specificity:

```html 
<div>
    <ExtendedTable />
</div>

<style>
div :global(.col-even) {
    // Your styles
}
```

## Defined CSS-Classes

### Column Classes

Even columns get `col-even`, Odd ones `col-odd`.

If you defined a `propertyPath`, you get that as class. The classes will be prefixed with `col-` and all non alphanumeric characters will be replaced with underscores.
Let's assume you have a column where you access a nested object `tales.fairy`. This column will have the class `col-tales_fairy`.

### Row Classes

Rows get classes the same way as columns. Even rows are `row-even`, odd ones `row-odd`.