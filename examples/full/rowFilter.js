import { deepValue } from '@jsier/deep-value';

export const filter = (rows, filterProp, value) => {
    if (!rows) {
        return [];
    }

    if (!value) {
        return rows;
    }

    return rows.filter((row) => {
        let currentValue = "" + deepValue(row, filterProp);

        return currentValue.trim().toLowerCase().includes(value);
    });
};