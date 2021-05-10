import {deepValue} from "@jsier/deep-value";

const slugEx = new RegExp(/[^a-z0-9\-]/ig);
const sluggify = (input) => {
    if (!input) {
        return
    }
    return ("" + input).replace(slugEx, '_');
};

const getOddEvenClass = (index, prefix) => {
    return index % 2 === 0 ? `${prefix}-even` : `${prefix}-odd`;
};

export const getCellClasses = (columnIndex, rowIndex, column, data) => {
    const classes = [];

    if (column.propertyPath) {
        classes.push(`col-${sluggify(column.propertyPath)}`);
    }
    if (typeof column.className === 'string') {
        classes.push(column.className);
    }
    if (typeof column.className?.value === 'function') {
        classes.push(column.className.value(data, columnIndex, rowIndex));
    }
    if (typeof column.className?.propertyPath === 'string') {
        classes.push(sluggify(deepValue(data, column.className.propertyPath)));
    }
    classes.push(getOddEvenClass(columnIndex + 1, 'col'));

    return classes.join(' ');
};

export const getRowClasses = (index, rows, data) => {
    const classes = [];

    rows.forEach((row) => {
        if (typeof row === 'string') {
            classes.push(row);
        }
        if (typeof row.value === 'function') {
            classes.push(row.value(data, index));
        }
        if (row.propertyPath) {
            classes.push(sluggify(deepValue(data, row.propertyPath)));
        }
    });
    classes.push(getOddEvenClass(index + 1, 'row'));

    return classes.join(' ');
};

export const getHeadlineClasses = (index, column) => {
    const classes = [];

    if (column.sortable) {
        classes.push('mouse-pointer');
    }
    if (column.propertyPath) {
        classes.push('col-head-' + sluggify(column.propertyPath));
    }
    if (typeof column.headerClassName === 'string') {
        classes.push(column.headerClassName);
    }
    if (typeof column.headerClassName?.value === 'function') {
        classes.push(column.headerClassName.value(index));
    }

    return classes.join(' ');
};