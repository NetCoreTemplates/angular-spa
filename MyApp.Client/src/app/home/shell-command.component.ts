import { Component, Input, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'shell-command',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div [class]="containerClasses" (click)="copy($event)">
      <!-- Background pattern -->
      <div class="absolute inset-0 bg-grid-slate-100 dark:bg-grid-slate-800 opacity-50"
           [style.backgroundImage]="'radial-gradient(circle, rgba(0,0,0,0.05) 1px, transparent 1px)'"
           [style.backgroundSize]="'16px 16px'"></div>

      <div class="relative flex items-center justify-between px-4 py-3">
        <!-- Left side - Terminal icon and command -->
        <div class="flex items-center gap-3 flex-1 min-w-0 cursor-pointer">
          <svg class="w-4 h-4 text-slate-500 dark:text-slate-400 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19h8"/><path d="m4 17 6-6-6-6"/></svg>
          <div class="flex items-center gap-2 min-w-0 flex-1">
            <code #commandRef class="text-sm font-mono text-slate-900 dark:text-slate-100 truncate">
              <ng-content></ng-content>
            </code>
          </div>
        </div>

        <!-- Right side - Copy button -->
        <div class="flex items-center gap-2 ml-4">
          <button
            (click)="copy($event)"
            [class]="buttonClasses"
            [attr.aria-label]="copied ? 'Copied!' : 'Copy command'">
            @if (copied) {
              <svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
            } @else {
              <svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
            }
          </button>
        </div>
      </div>
    </div>
  `
})
export class ShellCommandComponent {
  @Input() className: string = '';

  @ViewChild('commandRef') commandRef!: ElementRef;

  copied: boolean = false;

  get containerClasses(): string {
    return [
      'group relative overflow-hidden rounded-lg border border-slate-200 dark:border-slate-700',
      'bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800',
      'shadow-sm hover:shadow-md transition-all duration-200',
      this.className
    ].filter(Boolean).join(' ');
  }

  get buttonClasses(): string {
    const baseClasses = 'flex items-center justify-center p-2 rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2';

    if (this.copied) {
      return `${baseClasses} bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border border-green-300 dark:border-green-700`;
    }

    return `${baseClasses} bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 hover:border-slate-400 dark:hover:border-slate-500`;
  }

  async copy(event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();

    const textToCopy = this.commandRef?.nativeElement?.textContent || '';

    try {
      await navigator.clipboard.writeText(textToCopy);
      this.copied = true;
      setTimeout(() => this.copied = false, 2000);
    } catch (err) {
      // Fallback for older browsers
      const $el = document.createElement('textarea');
      $el.value = textToCopy;
      $el.style.position = 'fixed';
      $el.style.opacity = '0';
      document.body.appendChild($el);
      $el.select();
      document.execCommand('copy');
      document.body.removeChild($el);

      this.copied = true;
      setTimeout(() => this.copied = false, 2000);
    }
  }
}
