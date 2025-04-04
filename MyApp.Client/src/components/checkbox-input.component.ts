import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter, forwardRef, Optional, Inject, effect, ViewChild, ElementRef } from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { errorResponse, humanize, ResponseStatus, toPascalCase } from '@servicestack/client';
import { ApiState } from './';

@Component({
    selector: 'checkbox-input',
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => CheckboxInputComponent),
            multi: true
        }
    ],
    host: {
        '[attr.id]': 'null',
        '[attr.name]': 'null',
    },
    imports: [
        CommonModule,
        FormsModule,
    ],
    template: `
<div [ngClass]="class + ' relative flex items-start'">
  <div class="flex items-center h-5">
      <input #input
        type="checkbox"
        [id]="id"
        [name]="name"
        [checked]="checked"
        [disabled]="disabled"
        [required]="required"
        [attr.aria-checked]="indeterminate ? 'mixed' : checked"
        [class]="'focus:ring-indigo-500 h-4 w-4 text-indigo-600 rounded border-gray-300 dark:border-gray-600 dark:bg-gray-800 ' + 
            (checked ? '' : 'bg-white dark:bg-black') + ' ' +
            (disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer') + ' ' +
            inputClass"
        (change)="toggle()"
      />
    </div>
    <div class="ml-3 text-sm">
      <label [for]="id" [class]="'font-medium text-gray-700 dark:text-gray-300 ' + (disabled ? 'opacity-50' : '') + ' ' + labelClass">
        {{ useLabel }}
        @if (required) {
        <span class="text-red-500 ml-1">*</span>
        }
      </label>

      @if (errorField) {
        <p class="mt-2 text-sm text-red-500" [id]="id + '-error'">{{ errorField }}</p>
      }
      @else if (help) {
          <p class="mt-2 text-sm text-gray-500" [id]="id + '-description'">{{ help }}</p>
      }
    </div>
</div>  
  `
})
export class CheckboxInputComponent implements ControlValueAccessor {
    @ViewChild('input') elRef!: ElementRef;

    @Input() class?: string;
    @Input() status?: ResponseStatus | null;
    @Input() label?: string;
    @Input() id: string = '';
    @Input() name: string = '';
    @Input() checked: boolean = false;
    @Input() disabled: boolean = false;
    @Input() color: 'primary' | 'secondary' | 'success' | 'danger' = 'primary';
    @Input() required: boolean = false;
    @Input() indeterminate: boolean = false;
    @Input() help: string = '';

    @Input() labelClass: string = '';
    @Input() inputClass: string = '';

    @Output() onChange = new EventEmitter<boolean>();

    // Injecting ApiState (optional)
    constructor(@Optional() @Inject('ApiState') private ctx?: ApiState) {
        if (this.ctx) {
            // Create an effect that runs whenever ApiState error signal changes
            effect(() => {
                const apiError = this.ctx?.error();
            });
        }
    }

    // For ControlValueAccessor
    private onTouched: any = () => { };
    private onChanged: any = () => { };

    toggle() {
        if (this.disabled) return;

        this.checked = !this.checked;
        this.indeterminate = false;
        this.onChange.emit(this.checked);
        this.onChanged(this.checked);
        this.onTouched();
    }

    // ControlValueAccessor methods
    writeValue(value: boolean): void {
        this.checked = value;
    }

    registerOnChange(fn: any): void {
        this.onChanged = fn;
    }

    registerOnTouched(fn: any): void {
        this.onTouched = fn;
    }

    setDisabledState(isDisabled: boolean): void {
        this.disabled = isDisabled;
    }

    get useLabel(): string {
        return this.label ?? humanize(toPascalCase(this.id));
    }

    get errorField(): string | null {
        return errorResponse.call({ responseStatus: this.status ?? this.ctx?.error() }, this.id);
    }

}