import { TableStyle, TableStyleOptions } from "./types"

function hasTableStyle(style:TableStyleOptions, target:TableStyle) {
    return Array.isArray(style)
        ? style.indexOf(target) >= 0
        : style == target || style.includes(target)
}

export const grid = {
    getGridClass(style:TableStyleOptions="stripedRows") { return grid.gridClass },
    getGrid2Class(style:TableStyleOptions="stripedRows") { return hasTableStyle(style,"fullWidth")
        ? "overflow-x-auto" 
        : grid.grid2Class },
    getGrid3Class(style:TableStyleOptions="stripedRows") { return hasTableStyle(style,"fullWidth")
        ? "inline-block min-w-full py-2 align-middle"
        : grid.grid3Class },
    getGrid4Class(style:TableStyleOptions="stripedRows") { return hasTableStyle(style,"whiteBackground")
        ? ""
        : hasTableStyle(style,"fullWidth")
            ? "overflow-hidden shadow-sm ring-1 ring-black ring-opacity-5"
            : grid.grid4Class },
    getTableClass(style:TableStyleOptions="stripedRows") { return hasTableStyle(style,"fullWidth") || hasTableStyle(style,"verticalLines")
        ? "min-w-full divide-y divide-gray-300"
        : grid.tableClass },
    getTheadClass(style:TableStyleOptions="stripedRows") { return hasTableStyle(style,"whiteBackground")
        ? ""
        : grid.theadClass },
    getTheadRowClass(style:TableStyleOptions="stripedRows") { 
        return grid.theadRowClass + (hasTableStyle(style,"verticalLines") ? " divide-x divide-gray-200 dark:divide-gray-700" : "") },
    getTheadCellClass(style:TableStyleOptions="stripedRows") { 
        return grid.theadCellClass + (hasTableStyle(style,"uppercaseHeadings") ? " uppercase" : "") },
    getTbodyClass(style:TableStyleOptions="stripedRows") {
        return (hasTableStyle(style,"whiteBackground") || hasTableStyle(style,"verticalLines")
            ? "divide-y divide-gray-200 dark:divide-gray-800"
            : grid.tableClass)
        + (hasTableStyle(style,"verticalLines") ? " bg-white" : "") },
    getTableRowClass(style:TableStyleOptions="stripedRows", i:number, selected:boolean, allowSelection:boolean) {
        return (allowSelection ? "cursor-pointer " : "") + 
            (selected ? "bg-indigo-100 dark:bg-blue-800" : (allowSelection ? "hover:bg-yellow-50 dark:hover:bg-blue-900 " : "") + (hasTableStyle(style,"stripedRows")
                ? (i % 2 == 0 ? "bg-white dark:bg-black" : "bg-gray-50 dark:bg-gray-800")
                : "bg-white dark:bg-black")) + 
             (hasTableStyle(style,"verticalLines") ? " divide-x divide-gray-200 dark:divide-gray-700" : "")
    },

    gridClass: "flex flex-col",
    //original -margins + padding forces scroll bars when parent is w-full for no clear benefits?
    //original: -my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8
     grid2Class: "",
     //original: inline-block min-w-full py-2 align-middle md:px-6 lg:px-8
    grid3Class: "inline-block min-w-full py-2 align-middle",
    grid4Class: "overflow-hidden shadow ring-1 ring-black/5 md:rounded-lg",
    tableClass: "min-w-full divide-y divide-gray-200 dark:divide-gray-700",
    theadClass: "bg-gray-50 dark:bg-gray-900",
    tableCellClass: "px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400",
    theadRowClass: "select-none",
    theadCellClass: "px-6 py-4 text-left text-sm font-medium tracking-wider whitespace-nowrap",
    toolbarButtonClass: "inline-flex items-center px-2.5 py-1.5 border border-gray-300 dark:border-gray-700 shadow-sm text-sm font-medium rounded text-gray-700 dark:text-gray-300 bg-white dark:bg-black hover:bg-gray-50 dark:hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:ring-offset-black",
}