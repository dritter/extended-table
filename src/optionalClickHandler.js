// Actions do not support multiple arguments:
// https://github.com/sveltejs/svelte/issues/3987
export const optionalClickHandler = (node, config) => {
    const handleClick = (event) => {
        event.stopPropagation();
        if (typeof config.column.clickHandler !== 'function') {
            return
        }
        config.column.clickHandler(config.data);
    }
    node.addEventListener('click', handleClick);

    return {
        update(newConfig) {
            config = newConfig;
        },
        destroy() {
            node.removeEventListener('click', handleClick);
        }
    };
}