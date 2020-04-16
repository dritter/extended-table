import { readable } from 'svelte/store';
import {default as originalData} from '../../../fixtures/fixtures.json';

export const data = readable(
    [],
    (set) => set(originalData)
);