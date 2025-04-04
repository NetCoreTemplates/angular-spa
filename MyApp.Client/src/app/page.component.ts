import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-page',
    template: `
    <div [ngClass]="class + ' mt-8 mb-20 mx-auto'">
        <h1 class="mb-4 text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-50 sm:text-4xl">
            {{ heading ?? title }}
        </h1>
        <ng-content></ng-content>
    </div>  
  `,
    imports: [CommonModule],
})
export class PageComponent implements OnInit {
    @Input() title: string = '';
    @Input() heading?: string;
    @Input() class?: string = 'max-w-screen-md';

    ngOnInit(): void {
        if (this.title) document.title = this.title;
    }
}