import { Component, effect, Inject, Input, OnInit, Optional } from '@angular/core';
import { ApiState } from './';

@Component({
  selector: 'app-loading',
  template: `
  <div [class]="classes" title="loading...">
    @if (showIcon) {
      <svg version="1.1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="24px" height="30px" viewBox="0 0 24 30">
        <rect x="0" y="10" width="4" height="10" fill="#333" opacity="0.2">
          <animate attributeName="opacity" attributeType="XML" values="0.2; 1; .2" begin="0s" dur="0.6s" repeatCount="indefinite" />
          <animate attributeName="height" attributeType="XML" values="10; 20; 10" begin="0s" dur="0.6s" repeatCount="indefinite" />
          <animate attributeName="y" attributeType="XML" values="10; 5; 10" begin="0s" dur="0.6s" repeatCount="indefinite" />
        </rect>
        <rect x="8" y="10" width="4" height="10" fill="#333" opacity="0.2">
          <animate attributeName="opacity" attributeType="XML" values="0.2; 1; .2" begin="0.15s" dur="0.6s" repeatCount="indefinite" />
          <animate attributeName="height" attributeType="XML" values="10; 20; 10" begin="0.15s" dur="0.6s" repeatCount="indefinite" />
          <animate attributeName="y" attributeType="XML" values="10; 5; 10" begin="0.15s" dur="0.6s" repeatCount="indefinite" />
        </rect>
        <rect x="16" y="10" width="4" height="10" fill="#333" opacity="0.2">
          <animate attributeName="opacity" attributeType="XML" values="0.2; 1; .2" begin="0.3s" dur="0.6s" repeatCount="indefinite" />
          <animate attributeName="height" attributeType="XML" values="10; 20; 10" begin="0.3s" dur="0.6s" repeatCount="indefinite" />
          <animate attributeName="y" attributeType="XML" values="10; 5; 10" begin="0.3s" dur="0.6s" repeatCount="indefinite" />
        </rect>
      </svg>
    }
    <span class="ml-1 text-gray-400">{{showText}}</span>
  </div>  
  `
})
export class LoadingComponent implements OnInit {
  @Input() class?: string;
  @Input() icon?: boolean;
  @Input() text?: string;
  @Input() loading?: boolean;

  showIcon = true;
  showText = 'loading...';
  classes = 'flex';

  constructor(@Optional() @Inject('ApiState') private ctx?: ApiState) { }

  ngOnInit(): void {
    this.showIcon = this.icon || this.icon === undefined;
    this.showText = this.text === undefined ? 'loading...' : this.text;
    this.classes = ['flex', this.class].join(' ');
  }
}

@Component({
  selector: 'form-loading',
  imports: [LoadingComponent],
  template: `
  @if (isLoading) {
    <app-loading [class]="class" [icon]="icon" [text]="text"></app-loading>
  }
  `,
})
export class FormLoadingComponent implements OnInit {
  @Input() class?: string;
  @Input() loading?: boolean;
  @Input() icon?: boolean;
  @Input() text?: string;

  isLoading = false;

  constructor(@Optional() @Inject('ApiState') private ctx?: ApiState) { 
    if (this.ctx) {
      effect(() => {
        const apiLoading = this.ctx?.loading();
        this.update();
      });
    }
  }

  ngOnInit(): void {
    this.update();
  }

  update() {
    this.isLoading = this.loading !== undefined ? this.loading : this.ctx?.loading() ?? false;
  }
}
