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
