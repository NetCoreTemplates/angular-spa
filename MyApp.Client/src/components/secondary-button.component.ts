import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

type ButtonType = 'submit' | 'button' | 'reset';

@Component({
    selector: 'secondary-button',
    imports: [CommonModule, RouterLink],
    template: `
    <ng-template #content><ng-content></ng-content></ng-template>
    @if (href) {
        <a [href]="href" [class]="buttonClass">
            <ng-container *ngTemplateOutlet="content"></ng-container>
        </a>
    } @else {
        <button [routerLink]="routerLink" [type]="type" [class]="buttonClass" [disabled]="disabled">
            <ng-container *ngTemplateOutlet="content"></ng-container>
        </button>
    }
   `
})
export class SecondaryButtonComponent {
    @Input() type: ButtonType = 'button';
    @Input() disabled = false;
    @Input() routerLink?: string;
    @Input() href?: string;

    // CSS class equivalent to the Vue component's 'cls' constant
    buttonClass = "cursor-pointer inline-flex justify-center rounded-md border border-gray-300 py-2 px-4 text-sm font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-400 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700 focus:ring-indigo-500 dark:focus:ring-indigo-600 dark:ring-offset-black";
}
