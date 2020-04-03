import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/svelte'

import SlotRenderingTest from './Components/SlotRenderingTest.svelte';

const getColumn = (nodeList) => {
    return Array.prototype.map.call(nodeList, (element) => element.textContent.trim());
};

test('rendering with slots', async () => {
    const { container } = render(SlotRenderingTest);
    console.log(container.innerHTML);
    console.log("Component", SlotRenderingTest);

    const testColumn = container.querySelectorAll('.col-col2');
    expect(getColumn(testColumn)).toEqual(["new-xabc", "new-test", "new-zzz", "new-bla"]);
});
