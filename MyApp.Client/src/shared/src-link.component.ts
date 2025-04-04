import { Component, Input } from '@angular/core';
import { lastRightPart, combinePaths } from '@servicestack/client';

@Component({
  selector: 'src-link',
  template: `
  @if (iconSrc) {
    <a [href]="url" class="mr-3 text-gray-500 hover:text-gray-600 text-decoration-none">
      <img [src]="iconSrc" class="w-5 h-5 inline-flex text-purple-800 mr-1" alt="file icon"/>{{fileName}}
    </a>
  }
  @else {
    <a [href]="url" class="mr-3 text-gray-400 hover:text-gray-500 text-decoration-none">
      <ng-content></ng-content> {{fileName}}
    </a>
  }
  `
})
export class SrcLinkComponent {
  @Input() href!: string;
  @Input() iconSrc?: string;

  get url(): string {
    const baseUrl = "https://github.com/NetCoreTemplates/angular-spa/blob/main";
    return this.href.includes('://') ? this.href : combinePaths(baseUrl, this.href);
  }

  get fileName(): string {
    return lastRightPart(this.href, '/');
  }
}