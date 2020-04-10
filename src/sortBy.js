import sort from 'fast-sort';
import { deepValue } from '@jsier/deep-value';

export const sortByDefinition = (data, definition) => {
    sort(data).by(definition);
};

export const sortBy = (data, propertyPath, direction) => {
    const def = {};
    def[direction] = (u) => {
        return deepValue(u, propertyPath);
    };

    sortByDefinition(data, def);

    return data;
};

let sortDefinition = new Set();
export const sortByColumn = (column, columns, data, multisort, cacheClearCallback) => {
    if (!column.sortable) {
        return;
    }

    if (sortDefinition.has(column) && column.direction === 'desc') {
        sortDefinition.delete(column);
        column.direction = '';
    } else if (sortDefinition.has(column)) {
        column.direction = 'desc';
    } else {
        if (!multisort) {
            columns.map((c) => c.direction = undefined);
            sortDefinition = new Set();
        }
        column.direction = 'asc';
        sortDefinition.add(column);
    }
    const sortDefinitionArray = Array.from(sortDefinition.values());

    if (!sortDefinitionArray || !sortDefinitionArray.length) {
        cacheClearCallback();
        return;
    }
    sortByDefinition(
        data,
        sortDefinitionArray.map((def) => {
            const newDef = {};
            newDef[def.direction || 'asc'] = (u) => {
                return deepValue(u, def.propertyPath);
            };
            return newDef;
        })
    );

    cacheClearCallback();
};