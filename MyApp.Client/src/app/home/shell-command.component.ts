import { Component, Input, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'shell-command',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="{{className}} relative bg-gray-700 text-gray-300 pl-5 py-3 sm:rounded flex">
        <div class="flex ml-2 w-full justify-between cursor-pointer" (click)="copy($event)">
            <div>
                <span>$ </span>
                <label #commandLabel class="cursor-pointer">
                    <ng-content></ng-content>
                </label>
            </div>
            <small class="text-xs text-gray-400 px-3 -mt-1">sh</small>
        </div>
        @if (successText) {
            <div class="absolute right-0 -mr-28 -mt-3 rounded-md bg-green-50 p-3">
                <div class="flex">
                    <div class="flex-shrink-0">
                        <!-- Replace with Angular-compatible icon -->
                        <i class="h-5 w-5 text-green-400">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                                <path fill="currentColor"
                                    d="M12 2C6.5 2 2 6.5 2 12S6.5 22 12 22 22 17.5 22 12 17.5 2 12 2M10 17L5 12L6.41 10.59L10 14.17L17.59 6.58L19 8L10 17Z" />
                            </svg>
                        </i>
                    </div>
                    <div class="ml-3">
                        <p class="text-sm font-medium text-green-800">
                            {{ successText }}
                        </p>
                    </div>
                </div>
            </div>
        }
    </div>
  `
})
export class ShellCommandComponent {
  @Input() className: string = '';
  
  @ViewChild('commandLabel') commandLabel!: ElementRef;
  
  successText: string = '';

  async copy(event: MouseEvent) {
    const targetElement = event.target as HTMLElement;
    const parentElement = targetElement.parentElement;
    
    if (!parentElement) return;
    
    const label = this.commandLabel.nativeElement;
    const textToCopy = label.innerText;
    
    try {
      await navigator.clipboard.writeText(textToCopy);
      
      // Optional: still select the text visually to indicate what was copied
      if (typeof window.getSelection === 'function') {
        const range = document.createRange();
        range.selectNodeContents(label);
        window.getSelection()?.removeAllRanges();
        window.getSelection()?.addRange(range);
      }
      
      this.successText = 'copied';
      setTimeout(() => {
        this.successText = '';
      }, 3000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  }
}