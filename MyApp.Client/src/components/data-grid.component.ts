import { Breakpoint, TableStyleOptions } from './types';
import { Component, Input, Output, EventEmitter, ViewChild, ElementRef, ContentChildren, QueryList, AfterContentInit, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormatInfo, humanify, lastLeftPart, mapGet, MetadataPropertyType, uniqueKeys } from '@servicestack/client';
import { MetadataService } from './services/metadata.service';
import { PreviewFormatComponent } from './preview-format.component';
import { getTypeName } from './utils';
import { grid } from './css';

@Component({
    selector: 'data-grid',
    templateUrl: './data-grid.component.html',
    imports: [
        CommonModule,
        // CellFormatComponent,
        PreviewFormatComponent,
    ]
})
export class DataGridComponent implements AfterContentInit {
    @Input() items: any[] = [];
    @Input() id: string = 'DataGrid';
    @Input() type: string | any;
    @Input() tableStyle: TableStyleOptions = 'stripedRows';
    @Input() selectedColumns?: string[] | string;
    @Input() gridClass?: string;
    @Input() grid2Class?: string;
    @Input() grid3Class?: string;
    @Input() grid4Class?: string;
    @Input() tableClass?: string;
    @Input() theadClass?: string;
    @Input() tbodyClass?: string;
    @Input() theadRowClass?: string;
    @Input() theadCellClass?: string;
    @Input() isSelected?: (row: any) => boolean;
    @Input() allowSelection?: boolean;
    @Input() headerTitle?: (name: string) => string;
    @Input() headerTitles?: { [name: string]: string };
    @Input() visibleFrom?: { [name: string]: Breakpoint | 'never' };
    @Input() rowClass?: (model: any, i: number) => string;
    @Input() rowStyle?: (model: any, i: number) => object | undefined;

    @Output() headerSelected = new EventEmitter<{ name: string, event: Event }>();
    @Output() rowSelected = new EventEmitter<{ item: any, event: Event }>();

    @ViewChild('refResults') refResults?: ElementRef;
    @ContentChildren(TemplateRef) templateRefs!: QueryList<TemplateRef<any>>;

    showFilters: string | null = null;
    visibleColumns: string[] = [];
    metaType: any = {};
    typeProps: MetadataPropertyType[] = [];

    slotTemplates: { [key: string]: TemplateRef<any> } = {};

    // CSS classes for the grid
    gridClassValue: string = '';
    grid2ClassValue: string = '';
    grid3ClassValue: string = '';
    grid4ClassValue: string = '';
    tableClassValue: string = '';
    tbodyClassValue: string = '';
    theadClassValue: string = '';
    theadRowClassValue: string = '';
    theadCellClassValue: string = '';

    // Cell breakpoints for responsive display
    cellBreakpoints = {
        'xs': 'xs:table-cell',
        'sm': 'sm:table-cell',
        'md': 'md:table-cell',
        'lg': 'lg:table-cell',
        'xl': 'xl:table-cell',
        '2xl': '2xl:table-cell',
        'never': '',
    };

    constructor(private meta: MetadataService) { }

    ngAfterContentInit() {
        this.processTemplates();
        this.calculateVisibleColumns();
    }

    ngOnInit() {
        this.initializeGridClasses();
        this.initializeMetadata();
    }

    ngOnChanges() {
        this.initializeGridClasses();
        this.calculateVisibleColumns();
    }

    private initializeGridClasses() {
        // Initialize grid classes based on tableStyle
        this.gridClassValue = this.gridClass ?? grid.getGridClass(this.tableStyle);
        this.grid2ClassValue = this.grid2Class ?? grid.getGrid2Class(this.tableStyle);
        this.grid3ClassValue = this.grid3Class ?? grid.getGrid3Class(this.tableStyle);
        this.grid4ClassValue = this.grid4Class ?? grid.getGrid4Class(this.tableStyle);
        this.tableClassValue = this.tableClass ?? grid.getTableClass(this.tableStyle);
        this.tbodyClassValue = this.tbodyClass ?? grid.getTbodyClass(this.tbodyClass);
        this.theadClassValue = this.theadClass ?? grid.getTheadClass(this.tableStyle);
        this.theadRowClassValue = this.theadRowClass ?? grid.getTheadRowClass(this.tableStyle);
        this.theadCellClassValue = this.theadCellClass ?? grid.getTheadCellClass(this.tableStyle);
    }

    private initializeMetadata() {
        if (this.type) {
            const typeName = getTypeName(this.type);
            this.metaType = this.meta.typeOf(typeName!);
            this.typeProps = this.meta.typeProperties(this.metaType);
        }
    }

    private processTemplates() {
        // Process all template references to mimic Vue slots
        this.templateRefs.forEach(template => {
            const templateName = (template as any).name
                ?? (template as any)['_declarationTContainer']?.localNames?.[0];
            if (templateName) {
                this.slotTemplates[templateName] = template;
            }
        });
    }

    private calculateVisibleColumns() {
        let columns: string[];

        if (typeof this.selectedColumns === 'string') {
            columns = this.selectedColumns.split(',');
        } else if (this.selectedColumns && this.selectedColumns.length > 0) {
            columns = this.selectedColumns;
        } else if (Object.keys(this.slotTemplates).length > 0) {
            columns = Array.from(new Set(Object.keys(this.slotTemplates).map(key => lastLeftPart(key, 'Header'))));
        } else {
            columns = uniqueKeys(this.items);
        }

        // Filter out hidden columns
        const formatMap = this.typeProps.reduce((acc: { [k: string]: FormatInfo | undefined }, x: MetadataPropertyType) => {
            acc[x.name!.toLowerCase()] = x.format;
            return acc;
        }, {});

        this.visibleColumns = columns.filter(x => formatMap[x.toLowerCase()]?.method !== 'hidden');
    }

    isOpen(column: string): boolean {
        return this.showFilters === column;
    }

    hasSlot(name: string): boolean {
        return !!this.slotTemplates[name];
    }

    hasSlotHeader(column: string): boolean {
        return Object.keys(this.slotTemplates).some(x =>
            x.toLowerCase() === (column + 'Header').toLowerCase());
    }

    slotHeader(column: string): string {
        const key = Object.keys(this.slotTemplates).find(x =>
            x.toLowerCase() === (column + 'Header').toLowerCase());
        return key!;
    }

    hasSlotColumn(column: string): boolean {
        return Object.keys(this.slotTemplates).some(x =>
            x.toLowerCase() === column.toLowerCase());
    }

    slotColumn(column: string): string | null {
        const key = Object.keys(this.slotTemplates).find(x =>
            x.toLowerCase() === column.toLowerCase());
        return key || null;
    }

    headerFormat(column: string): string {
        const title = this.headerTitles && mapGet(this.headerTitles, column) || column;
        return this.headerTitle
            ? this.headerTitle(title)
            : humanify(title);
    }

    columnProp(column: string): MetadataPropertyType | undefined {
        const columnLower = column.toLowerCase();
        return this.typeProps.find(x => x.name!.toLowerCase() === columnLower);
    }

    columnFormat(column: string): FormatInfo | null {
        const prop = this.columnProp(column);
        if (prop?.format)
            return prop.format;
        if (prop?.type === 'TimeSpan' || prop?.type === 'TimeOnly')
            return { method: 'time' };
        return null;
    }

    cellClass(column: string): string {
        if (!this.visibleFrom) return '';

        const breakpoint = mapGet(this.visibleFrom, column) as Breakpoint;
        if (!breakpoint) return '';

        const bpClass = this.cellBreakpoints[breakpoint];
        return bpClass ? `hidden ${bpClass} ` : '';
    }

    getTableRowClass(item: any, i: number): string {
        if (this.rowClass) {
            return this.rowClass(item, i);
        }

        const isSelectedRow = this.isSelected && this.isSelected(item);
        return grid.getTableRowClass(
            this.tableStyle,
            i,
            isSelectedRow ? true : false,
            this.allowSelection ?? this.isSelected != null
        );
    }

    getTableRowStyle(item: any, i: number): object | undefined {
        return this.rowStyle
            ? this.rowStyle(item, i)
            : undefined;
    }

    onHeaderSelected(event: Event, column: string) {
        this.headerSelected.emit({ name: column, event });
    }

    onRowSelected(event: Event, i: number, row: any) {
        this.rowSelected.emit({ item: row, event });
    }

    mapGet(obj: any, key: string): any { return mapGet(obj, key); }

    keys(obj: any): string[] { return Object.keys(obj); }
}
