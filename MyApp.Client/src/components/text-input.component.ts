import { CommonModule } from '@angular/common';
import { Component, Input, forwardRef, ElementRef, ViewChild, OnInit, booleanAttribute, Optional, Inject, effect, signal, OnChanges } from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { errorResponse, humanize, ResponseStatus, toPascalCase } from '@servicestack/client';
import { ApiState } from './';
import { textInputValue } from './utils';

@Component({
  selector: 'text-input',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TextInputComponent),
      multi: true
    }
  ],
  host: {
    '[attr.id]': 'null',
    '[attr.name]': 'null',
    '[attr.type]': 'null'
  },
  imports: [
    CommonModule,
    FormsModule,
  ],
  template: `
  <div [ngClass]="class">
      <ng-content select="[slot='header']"></ng-content>

      @if (useLabel) {
          <label [for]="id"
              [ngClass]="'block text-sm font-medium text-gray-700 dark:text-gray-300 ' + (labelClass || '')">
              {{ useLabel }}
          </label>
      }

      <div [ngClass]="fixShadow('mt-1 relative shadow-sm rounded-md')">
        <input #input
          [type]="useType"
          [id]="id"
          [name]="name" 
          [placeholder]="usePlaceholder"
          [disabled]="disabled"
          [required]="required"
          [class.border-red-500]="error"
          [ngClass]="cls" 
          [ngModel]="value"
          (ngModelChange)="onModelChange($event)"
          (blur)="onBlur()"
        />

        @if (errorField()) {
        <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
          <svg class="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
          </svg>
        </div>        
        }
      </div>

      @if (errorField()) {
        <p class="mt-2 text-sm text-red-500" [id]="id + '-error'">{{ errorField() }}</p>
      }
      @if (!errorField() && help) {
          <p class="mt-2 text-sm text-gray-500" [id]="id + '-description'">{{ help }}</p>
      }

      <ng-content select="[slot='footer']"></ng-content>
  </div>
  `,
})
export class TextInputComponent implements ControlValueAccessor, OnInit, OnChanges {
  @ViewChild('input') elRef!: ElementRef;

  @Input() class?: string;
  @Input() status?: ResponseStatus | null;
  @Input() label?: string;
  @Input() id: string = '';
  @Input() name: string = '';
  @Input() type?: string;
  @Input() placeholder?: string;
  @Input({ transform: booleanAttribute }) required: boolean = false;
  @Input({ transform: booleanAttribute }) disabled: boolean = false;
  @Input() error: string = '';
  @Input() help: string = '';

  @Input() inputClass?: string;
  @Input() labelClass?: string;

  errorField = signal<string | null>(null);

  // Injecting ApiState (optional)
  constructor(@Optional() @Inject('ApiState') private ctx?: ApiState) {
    if (this.ctx) {
      // Create an effect that runs whenever ApiState error signal changes
      effect(() => {
        // Read both signals to establish dependencies
        const apiError = this.ctx?.error();
        this.update();
      });
    }

  }

  value: string = '';
  isDisabled: boolean = false;

  private onChange: (value: null|string|number) => void = () => { };
  private onTouched: () => void = () => { };

  ngOnInit() {
    if (!this.id) {
      throw new Error('<text-input id="fieldName"> id is missing');
    }

    // Use the ID as the name if none is provided
    if (!this.name) {
      this.name = this.id;
    }

    this.update();
  }

  ngOnChanges() {
    // Re-evaluate errors when @Input status changes
    this.update();
  }

  writeValue(value: string): void {
    this.value = value || '';

    // Update the input element value when available
    if (this.elRef) {
      const inputValue = textInputValue(this.useType, this.value);
      // Use setTimeout to ensure the input is updated after the view has rendered
      setTimeout(() => this.elRef.nativeElement.value = inputValue, 0)
    }
  }
 
  onModelChange(newValue: string): void {
    // Convert string to number if input type is 'number'
    if (this.useType === 'number') {
      const numValue =  newValue === '' 
        ? null 
        : parseFloat(newValue);
      this.value = newValue; // Keep original string in component
      this.onChange(numValue); // Pass number to form control if valid
    } else {
      this.value = newValue;
      this.onChange(newValue);
    }
  }  
  
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  onBlur(): void {
    this.onTouched();
  }

  focus() {
    this.elRef?.nativeElement?.focus();
  }

  update() {
    const ret = errorResponse.call({ responseStatus: this.status ?? this.ctx?.error() }, this.id)
    this.errorField.set(ret);
  }

  get useType(): string {
    return this.type || 'text';
  }

  get useLabel(): string {
    return this.label ?? humanize(toPascalCase(this.id));
  }

  get usePlaceholder(): string {
    return this.placeholder ?? this.useLabel;
  }

  fixShadow(cls: string): string {
    return this.type === 'range' ? cls.replace('shadow-sm ', '') : cls;
  }

  get cls() {
    return ['w-full cursor-text flex flex-wrap sm:text-sm rounded-md dark:text-white dark:bg-gray-900 border focus-within:border-transparent focus-within:ring-1 focus-within:outline-none',
      this.errorField()
        ? 'pr-10 border-red-300 text-red-900 placeholder-red-300 focus-within:outline-none focus-within:ring-red-500 focus-within:border-red-500'
        : 'shadow-sm border-gray-300 dark:border-gray-600 focus-within:ring-indigo-500 focus-within:border-indigo-500'
      , this.inputClass || ''].join(' ');
  }
}