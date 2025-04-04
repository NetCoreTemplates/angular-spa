import { CommonModule } from '@angular/common';
import { Component, Input, forwardRef, ElementRef, ViewChild, OnInit, booleanAttribute, Optional, Inject, numberAttribute, signal, effect } from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { errorResponse, humanize, ResponseStatus, toPascalCase } from '@servicestack/client';
import { ApiState } from './';
import { textInputValue } from './utils';

@Component({
  selector: 'textarea-input',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TextareaInputComponent),
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
  <div [ngClass]="class">
      <ng-content select="[slot='header']"></ng-content>

      @if (useLabel) {
          <label [for]="id"
              [ngClass]="'block text-sm font-medium text-gray-700 dark:text-gray-300 ' + (labelClass || '')">
              {{ useLabel }}
          </label>
      }

      <div class="mt-1 relative shadow-sm rounded-md">
          <textarea #input
              [id]="id"
              [name]="name"
              [ngClass]="cls"
              [placeholder]="usePlaceholder"
              [disabled]="disabled"
              [required]="required"
              [attr.rows]="rows"
              [attr.aria-invalid]="errorField != null"
              [attr.aria-describedby]="id + '-error'"
              [class.border-red-500]="error"
              [ngModel]="value"
              (ngModelChange)="onModelChange($event)"
              (blur)="onBlur()"
            ></textarea>
      </div>

      @if (errorField()) {
          <p class="mt-2 text-sm text-red-500" [id]="id + '-error'">{{ errorField() }}</p>
      }
      @if (!errorField() && help) {
          <p class="mt-2 text-sm text-gray-500" [id]="id + '-description'">{{ help }}</p>
      }

      <ng-content select="[slot='footer']"></ng-content>
  </div>
  `
})
export class TextareaInputComponent implements ControlValueAccessor, OnInit {
  @ViewChild('input') elRef!: ElementRef;

  @Input() class?: string;
  @Input() status?: ResponseStatus | null;
  @Input() label?: string;
  @Input() id: string = '';
  @Input() name: string = '';
  @Input() placeholder?: string;
  @Input({ transform: booleanAttribute }) required: boolean = false;
  @Input({ transform: booleanAttribute }) disabled: boolean = false;
  @Input() error: string = '';
  @Input() help: string = '';
  @Input({ transform: numberAttribute }) rows?: number;

  @Input() inputClass?: string;
  @Input() labelClass?: string;

  errorField = signal<string | null>(null);

  // Injecting ApiState (optional)
  constructor(@Optional() @Inject('ApiState') private ctx?: ApiState) {
    if (this.ctx) {
      // Create an effect that runs whenever ApiState error signal changes
      effect(() => {
        // Read the signal value - this creates a dependency
        const apiError = this.ctx?.error();
        this.update();
      });
    }
  }

  value: string = '';
  isDisabled: boolean = false;

  private onChange: (value: string) => void = () => { };
  private onTouched: () => void = () => { };

  ngOnInit() {
    // Generate an ID if none is provided
    if (!this.id) {
      this.id = `text-input-${Math.random().toString(36).substring(2, 9)}`;
    }

    // Use the ID as the name if none is provided
    if (!this.name) {
      this.name = this.id;
    }
  }

  writeValue(value: string): void {
    this.value = value || '';

    // Update the input element value when available
    if (this.elRef) {
      this.elRef.nativeElement.value = this.value;
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
    this.errorField.set(errorResponse.call({ responseStatus: this.status ?? this.ctx?.error() }, this.id));
  }

  get useLabel(): string {
    return this.label ?? humanize(toPascalCase(this.id));
  }

  get usePlaceholder(): string {
    return this.placeholder ?? this.useLabel;
  }

  get cls() {
    return ['w-full cursor-text flex flex-wrap sm:text-sm rounded-md dark:text-white dark:bg-gray-900 border focus-within:border-transparent focus-within:ring-1 focus-within:outline-none',
      this.errorField()
        ? 'pr-10 border-red-300 text-red-900 placeholder-red-300 focus-within:outline-none focus-within:ring-red-500 focus-within:border-red-500'
        : 'shadow-sm border-gray-300 dark:border-gray-600 focus-within:ring-indigo-500 focus-within:border-indigo-500'
      , this.inputClass || ''].join(' ');
  }

  onModelChange(newValue: string): void {
    this.value = newValue;
    this.onChange(newValue);
  }
}
