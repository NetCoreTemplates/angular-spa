import { CommonModule } from '@angular/common';
import { Component, EventEmitter, forwardRef, Output } from '@angular/core';
import { FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
    selector: 'confirm-delete',
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => ConfirmDeleteComponent),
            multi: true
        }
    ],
    imports: [
        CommonModule,
        FormsModule,
    ],
    template: `
    <div>
        <input id="confirmDelete" type="checkbox" 
                class="focus:ring-indigo-500 h-4 w-4 text-indigo-600 rounded border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:ring-offset-black"
                [(ngModel)]="deleteConfirmed" />
        <label for="confirmDelete" class="ml-2 mr-2 select-none">confirm</label>
        <span (click)="onClick()" [ngClass]="cls">
            <ng-content>Delete</ng-content>
        </span>
    </div>  
  `
})
export class ConfirmDeleteComponent {
    deleteConfirmed: boolean = false;

    @Output() delete = new EventEmitter<void>();

    onClick(): void {
        if (this.deleteConfirmed) {
            this.delete.emit();
        }
    }

    get cls(): string {
        const baseClasses = [
            "select-none", "inline-flex", "justify-center", "py-2", "px-4",
            "border", "border-transparent", "shadow-sm", "text-sm",
            "font-medium", "rounded-md", "text-white"
        ];

        const conditionalClasses = this.deleteConfirmed
            ? ["cursor-pointer", "bg-red-600", "hover:bg-red-700", "focus:outline-none",
                "focus:ring-2", "focus:ring-offset-2", "focus:ring-red-500"]
            : ["bg-red-400"];

        return [...baseClasses, ...conditionalClasses].join(' ');
    }
}
