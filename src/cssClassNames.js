import {deepValue} from "@jsier/deep-value";

const slugEx = new RegExp(/[^a-z0-9\-]/ig);
const sluggify = (input) => {
    if (!input) {
        return
    }
    return ("" + input).replace(slugEx, '_');
};

const getOddEvenClass = (index, prefix) => {
    if (index % 2 === 0) {
        return `${prefix}-even`;
    }

    return `${prefix}-odd`;
};

export const getCellClasses = (columnIndex, rowIndex, column, data) => {
    const classes = [];
    column.propertyPath && classes.push(`col-${sluggify(column.propertyPath)}`);
    typeof column.className === 'string' && classes.push(column.className);

    if (typeof column.className === 'object') {
        typeof column.className.value === 'function' && classes.push(
            column.className.value(data, columnIndex, rowIndex)
        );
        column.className.propertyPath && classes.push(sluggify(deepValue(data, column.className.propertyPath)));
    }
    classes.push(getOddEvenClass(columnIndex + 1, 'col'));

    return classes.join(' ');
};

export const getRowClasses = (index, rows, data) => {
    const classes = [];

    rows.forEach((row) => {
        typeof row === 'string' && classes.push(row);
        if (typeof row === 'object') {
            typeof row.value === 'function' && classes.push(row.value(data, index));
            row.propertyPath && classes.push(sluggify(deepValue(data, row.propertyPath)));
        }
    });
    classes.push(getOddEvenClass(index + 1, 'row'));

    return classes.join(' ');
};

export const getHeadlineClasses = (index, column) => {
    let classes = [];
    column.sortable && classes.push('mouse-pointer');
    column.propertyPath && classes.push('col-head-' + sluggify(column.propertyPath));
    typeof column.headerClassName === 'string' && classes.push(column.headerClassName);

    if (typeof column.headerClassName === 'object') {
        typeof column.headerClassName.value === 'function' && classes.push(
            column.headerClassName.value(index)
        );
    }

    return classes.join(' ');
};