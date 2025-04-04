import { Component, Input, OnChanges, SimpleChanges, ElementRef, Renderer2 } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ImageInfo } from '@servicestack/client';
import { iconOnError } from './files';
import { MetadataService } from './services/metadata.service';

@Component({
    selector: 'app-icon',
    template: `
    @if (isSvg) {
    <span [innerHTML]="svgContent"></span>
    }
    @else {
    <img [src]="imageSource" [class]="imageClass" (error)="onImageError($event)" [alt]="alt || ''">
    }
  `
})
export class IconComponent implements OnChanges {
    @Input() image?: ImageInfo;
    @Input() svg?: string;
    @Input() src?: string;
    @Input() alt?: string;
    @Input() type?: string;
    @Input() class?: string;

    // Component state
    isSvg: boolean = false;
    svgContent: SafeHtml = '';
    imageSource: string = '';
    imageClass: string = '';

    constructor(
        private sanitizer: DomSanitizer,
        private renderer: Renderer2,
        private el: ElementRef,
        private meta: MetadataService
    ) { }

    ngOnChanges(changes: SimpleChanges): void {
        this.updateIcon();
    }

    private updateIcon(): void {
        let image = this.image;

        // Handle type-based icon lookup
        if (this.type) {
            const metaType = this.meta.typeOf(this.type);
            if (!metaType) {
                console.warn(`Type ${this.type} does not exist`);
            }
            if (!metaType?.icon) {
                console.warn(`Type ${this.type} does not have a [Svg] icon`);
            } else {
                image = metaType.icon as ImageInfo;
            }
        }

        // Determine SVG content
        let svgContent: string = this.svg || image?.svg || '';
        this.isSvg = svgContent.startsWith('<svg ');

        if (this.isSvg) {
            // Process SVG content with classes
            const processedSvg = this.processSvgClasses(svgContent, image?.cls || '');
            this.svgContent = this.sanitizer.bypassSecurityTrustHtml(processedSvg);
        } else {
            // Handle image source
            this.imageSource = this.meta.ui().assetsPathResolver(this.src || image?.uri || '');
            this.imageClass = `${image?.cls || ''} ${this.class || ''}`.trim();
        }
    }

    private processSvgClasses(svg: string, imageClass: string): string {
        const svgTag = this.leftPart(svg, '>');
        const clsPos = svgTag.indexOf('class=');
        const cls = `${imageClass} ${this.class || ''}`.trim();

        if (clsPos === -1) {
            // No class attribute, add it
            return `<svg class="${cls}" ${svg.substring(4)}`;
        } else {
            // Modify existing class
            const clsQuoteChar = svgTag.charAt(clsPos + 'class='.length);
            const clsQuotePos = clsPos + 'class='.length + 1;

            // Find the end of the class attribute
            let endQuotePos = svgTag.indexOf(clsQuoteChar, clsQuotePos);
            if (endQuotePos === -1) {
                // Malformed SVG, just return original
                return svg;
            }

            const beforeClass = svg.substring(0, clsQuotePos);
            const afterClass = svg.substring(endQuotePos);
            return `${beforeClass}${cls} ${afterClass}`;
        }
    }

    // Utility to get the left part of a string before a delimiter
    private leftPart(str: string, delimiter: string): string {
        const index = str.indexOf(delimiter);
        return index === -1 ? str : str.substring(0, index);
    }

    // Handle image loading errors
    onImageError(event: Event): void {
        iconOnError(event.target as HTMLImageElement);
    }
}
