import {render} from "@testing-library/svelte";
import '@testing-library/jest-dom/extend-expect';
import * as Benchmark from 'benchmark';
const suite = new Benchmark.Suite('ExtendedTable-Performance');

import * as fs from 'fs';
import {buildTable} from "../util.js";
import SlotRenderingTest from "../Components/SlotRenderingTest.svelte";

const sortableMods = [{sortable: true}, {sortable: true}, {sortable: true}];

const log = fs.openSync('./test/performance/output.txt', 'a')

/**
 * Artificial test, because we run the benchmarks in
 * jest, so that jest-babel handles all the
 * compiling of svelte and ESM modules for us.
 */
test('test', (done) => {
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
        .on('cycle', (event) => {
            fs.appendFileSync(log, String(event.target));
        })
        .run({ async: true, onComplete: done });
});