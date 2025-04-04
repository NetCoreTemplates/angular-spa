import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ImageInfo, mapGet, MetadataPropertyType, MetadataType } from '@servicestack/client';
import { MetadataService } from './services/metadata.service';
import { IconComponent } from './icon.component';
import { formatValue } from 'src/components/formatters';
import { isComplexType } from 'src/components/utils';

@Component({
    selector: 'cell-format',
    imports: [
        IconComponent,
    ],
    template: `
    @if (!hasRef) {
        @if (isArrayValue) {
        <span class="flex">
          <span class="mr-2">{{ arrayLength }}</span>
          <span [innerHTML]="formattedValue"></span>
        </span>
        }
        @else {
        <span [innerHTML]="formattedValue"></span>
        }
    }
    @else {
        @if (labelValue) {
        <span class="flex" [title]="refTitle">
            @if (iconImage) {
            <app-icon [image]="iconImage" class="w-5 h-5 mr-1"></app-icon>
            }
            <span>{{ labelValue }}</span>
        </span>
        }
        @if (!labelValue) {
        <span [innerHTML]="formattedValue"></span>
        }
    }
  `,
})
export class CellFormatComponent implements OnChanges {
    @Input() type: MetadataType | undefined;
    @Input() propType: MetadataPropertyType | undefined;
    @Input() modelValue: any;

    // Content rendering properties
    formattedValue: SafeHtml = '';
    hasRef: boolean = false;
    isArrayValue: boolean = false;
    arrayLength: number = 0;
    labelValue: any = null;
    refTitle: string = '';
    iconImage: ImageInfo | undefined;

    constructor(
        private sanitizer: DomSanitizer,
        private meta: MetadataService
    ) { }

    ngOnChanges(changes: SimpleChanges): void {
        this.updateRenderedContent();
    }

    private updateRenderedContent(): void {
        if (!this.propType || !this.propType.name) {
            return;
        }

        // Get the value from the model
        const value = mapGet(this.modelValue, this.propType.name);

        // Format the value
        const formatInfo = this.propFormat(this.propType);
        this.formattedValue = this.sanitizer.bypassSecurityTrustHtml(
            formatValue(value, formatInfo)
        );

        // Check if it's an array
        this.isArrayValue = isComplexType(value) && Array.isArray(value);
        if (this.isArrayValue) {
            this.arrayLength = value.length;
        }

        // Handle references
        const ref = this.propType.ref;
        this.hasRef = !!ref;

        if (ref) {
            const modelProps = this.meta.typeProperties(this.type);
            const complexRefProp = modelProps.find(x => x.type === ref.model);

            if (complexRefProp) {
                const complexRefValue = mapGet(this.modelValue, complexRefProp.name!);
                this.labelValue = complexRefValue && ref.refLabel ?
                    mapGet(complexRefValue, ref.refLabel) : null;

                if (this.labelValue) {
                    this.refTitle = `${ref.model} ${value}`;
                    const refType = this.meta.typeOf(ref.model);
                    this.iconImage = refType?.icon;
                }
            }
        }
    }

    private propFormat(prop: MetadataPropertyType) {
        if (prop?.format)
            return prop.format
        if (prop?.type == 'TimeSpan' || prop?.type == 'TimeOnly')
            return { method: 'time' }
        return null
    }
}
