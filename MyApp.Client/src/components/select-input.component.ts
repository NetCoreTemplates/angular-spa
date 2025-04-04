import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter, ElementRef, OnInit, ViewChild, Optional, Inject, effect } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { errorResponse, humanize, KeyValuePair, omit, toPascalCase } from '@servicestack/client';
import { ApiState } from './';

@Component({
    selector: 'select-input',
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: SelectInputComponent,
            multi: true
        }
    ],
    host: {
        '[attr.id]': 'null',
        '[attr.name]': 'null',
    },
    imports: [CommonModule],
    template: `
<div>
    @if (useLabel) {
      <label [for]="id" [ngClass]="'block text-sm font-medium text-gray-700 dark:text-gray-300 ' + (labelClass || '')">{{ useLabel }}</label>
    }
  <select #input
    [id]="id" 
    [name]="id" 
    [ngClass]="'mt-1 block w-full pl-3 pr-10 py-2 text-base focus:outline-none sm:text-sm rounded-md dark:text-white dark:bg-gray-900 dark:border-gray-600 ' 
        + (!errorField ? 'border-gray-300 text-gray-900 focus:ring-indigo-500 focus:border-indigo-500' : 'border-red-300 text-red-900 focus:ring-red-500 focus:border-red-500') 
        + ' ' + inputClass"
    [value]="modelValue"
    (input)="onSelectChange($event)"
    [attr.aria-invalid]="errorField != null"
    [attr.aria-describedby]="id + '-error'">
    @for (entry of kvpValues; track $index) {
    <option [value]="entry.key">{{ entry.value }}</option>
    }
  </select>
  @if (errorField) {
    <p class="mt-2 text-sm text-red-500" [id]="id + '-error'">{{ errorField }}</p>
  }
</div>  
  `
})
export class SelectInputComponent implements ControlValueAccessor, OnInit {
    @ViewChild('input') elRef!: ElementRef;

    @Input() status?: any;
    @Input() id!: string;
    @Input() modelValue?: string;
    @Input() inputClass?: string;
    @Input() label?: string;
    @Input() labelClass?: string;
    @Input() options?: any;
    @Input() values?: string[];
    @Input() entries?: { key: string, value: string }[];
    @Input() set class(value: string) {
        this.hostClass = value;
    }

    @Output() updateModelValue = new EventEmitter<string>();

    kvpValues: KeyValuePair<string, string>[] = [];
    errorField: string | null = null;
    useLabel: string = '';
    hostClass: string = '';

    // ApiState context from Vue needs to be managed differently in Angular
    // This is a simplified approach - you may need to create a service for this
    apiState: any;

    // ControlValueAccessor implementation
    private onChange: any = () => { };
    private onTouched: any = () => { };

    // Injecting ApiState (optional)
    constructor(@Optional() @Inject('ApiState') private ctx?: ApiState) {
        if (this.ctx) {
            // Create an effect that runs whenever ApiState error signal changes
            effect(() => {
                const apiError = this.ctx?.error();
            });
        }
    }

    ngOnInit() {
        this.useLabel = this.label ?? humanize(toPascalCase(this.id));
        this.updateKvpValues();
        this.errorField = errorResponse.call({ responseStatus: this.status ?? this.apiState?.error }, this.id);
    }

    updateKvpValues() {
        if (this.entries) {
            this.kvpValues = this.entries;
        } else if (this.values) {
            this.kvpValues = this.values.map(x => ({ key: x, value: x }));
        } else if (this.options) {
            this.kvpValues = Object.keys(this.options).map(key => ({ key, value: this.options[key] }));
        } else {
            this.kvpValues = [];
        }
    }

    onSelectChange(event: Event) {
        const value = (event.target as HTMLSelectElement).value;
        this.updateModelValue.emit(value);
        this.onChange(value);
    }

    // ControlValueAccessor interface implementations
    writeValue(value: string): void {
        this.modelValue = value;
    }

    registerOnChange(fn: any): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: any): void {
        this.onTouched = fn;
    }

    setDisabledState(isDisabled: boolean): void {
        // Implementation for disabled state if needed
    }
}