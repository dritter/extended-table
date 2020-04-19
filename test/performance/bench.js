import {render} from "@testing-library/svelte";

const Benchmark = require('benchmark');
const suite = new Benchmark.Suite();

import '@testing-library/jest-dom/extend-expect';
import {buildTable} from "../util";
import SlotRenderingTest from "../Components/SlotRenderingTest.svelte";

const sortableMods = [{sortable: true}, {sortable: true}, {sortable: true}];

suite
    .add('default rendering', () => {
        buildTable({columnMods: sortableMods});
    })
    .add('slot rendering', () => {
        render(SlotRenderingTest);
    })
    .add('sorting', () => {
        const table = buildTable({columnMods: sortableMods});
        const column2 = table.columns[1];

        (async () => {
            await column2.click();
        })();
    })
    .on('cycle', event => {
        console.log(String(event.target));
    })
    .run();