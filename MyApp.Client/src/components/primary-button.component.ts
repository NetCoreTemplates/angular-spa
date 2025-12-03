import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'primary-button',
    imports: [CommonModule, RouterLink],
    template: `
    <ng-template #content><ng-content></ng-content></ng-template>
    @if (href) {
        <a [href]="href" [class]="cls">
            <ng-container *ngTemplateOutlet="content"></ng-container>
        </a>
    } @else {
        <button [routerLink]="routerLink" [type]="type || 'button'" [class]="cls" [disabled]="disabled">
            <ng-container *ngTemplateOutlet="content"></ng-container>
        </button>
    }
  `,
})
export class PrimaryButtonComponent {
    @Input() type: 'submit' | 'button' | 'reset' = 'submit';
    @Input() routerLink?: string;
    @Input() href?: string;
    @Input() disabled = false;
    @Input() color: 'blue' | 'purple' | 'red' | 'green' | 'sky' | 'cyan' | 'indigo' = 'indigo';

    private readonly colorClasses = {
        blue: 'focus:ring-indigo-500 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:hover:bg-blue-400 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800',
        purple: 'focus:ring-indigo-500 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 disabled:hover:bg-purple-400 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800',
        red: 'focus:ring-red-500 bg-red-600 hover:bg-red-700 disabled:bg-red-400 disabled:hover:bg-red-400 focus:ring-red-500 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-500',
        green: 'focus:ring-green-500 bg-green-600 hover:bg-green-700 disabled:bg-green-400 disabled:hover:bg-green-400 focus:ring-green-500 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-500',
        sky: 'focus:ring-sky-500 bg-sky-600 hover:bg-sky-700 disabled:bg-sky-400 disabled:hover:bg-sky-400 dark:bg-sky-600 dark:hover:bg-sky-700 dark:focus:ring-sky-500',
        cyan: 'focus:ring-cyan-500 bg-cyan-600 hover:bg-cyan-700 disabled:bg-cyan-400 disabled:hover:bg-cyan-400 dark:bg-cyan-600 dark:hover:bg-cyan-700 dark:focus:ring-cyan-500',
        indigo: 'focus:ring-indigo-500 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 disabled:hover:bg-indigo-400 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800',
    };

    get cls(): string {
        const baseClasses = "cursor-pointer inline-flex justify-center rounded-md border border-transparent py-2 px-4 text-sm font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 dark:ring-offset-black text-white";
        return `${baseClasses} ${this.colorClasses[this.color] || this.colorClasses.indigo}`;
    }
}
