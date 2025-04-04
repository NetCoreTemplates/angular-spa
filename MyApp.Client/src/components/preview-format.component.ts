import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { FormatInfo } from '@servicestack/client';
import { formatValue } from './formatters';

@Component({
    selector: 'preview-format',
    template: `
  @if (isComplexType(value)) {
      @if (includeCount && isArray) {
        <span class="mr-2">{{ value.length }}</span>
      }
      <span [innerHTML]="formattedValue"></span>
    }
    @else {
      <span [innerHTML]="formattedValue"></span>
    }
  `
})
export class PreviewFormatComponent implements OnInit, OnChanges {
    @Input() value: any;
    @Input() format?: FormatInfo | null;
    @Input() includeIcon: boolean = true;
    @Input() includeCount: boolean = true;
    @Input() maxFieldLength: number = 150;
    @Input() maxNestedFields: number = 2;
    @Input() maxNestedFieldLength: number = 30;

    isArray: boolean = false;
    formattedValue: SafeHtml = '';

    constructor(private sanitizer: DomSanitizer) { }

    ngOnInit(): void {
        this.updateFormattedValue();
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['value'] || changes['format']) {
            this.updateFormattedValue();
        }
    }

    private updateFormattedValue(): void {
        this.isArray = Array.isArray(this.value);

        // Create an object with all our attributes to pass to the formatter
        const attrs = {
            includeIcon: this.includeIcon,
            includeCount: this.includeCount,
            maxFieldLength: this.maxFieldLength,
            maxNestedFields: this.maxNestedFields,
            maxNestedFieldLength: this.maxNestedFieldLength
        };

        // Use the formatter service and sanitize the HTML
        const formattedHtml = formatValue(this.value, this.format, attrs);
        this.formattedValue = this.sanitizer.bypassSecurityTrustHtml(formattedHtml);
    }

    isComplexType(value: any): boolean {
        return value !== null && typeof value === 'object';
    }
}
