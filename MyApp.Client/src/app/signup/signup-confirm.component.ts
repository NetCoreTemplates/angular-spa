import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { PageComponent } from '../page.component';

@Component({
  selector: 'app-signup-confirm',
  standalone: true,
  imports: [
    CommonModule,
    PageComponent,
  ],
  template: `
    <app-page title="Signup confirmation" class="max-w-lg">
      <div class="mt-8 mb-20">
      @if (confirmLink) {
        <p class="my-4">
          Normally this would be emailed:
          <a class="pl-2 font-semibold" id="confirm-link" [href]="confirmLink">
            Click here to confirm your account
          </a>
        </p>
      }
        <p class="my-4">Please check your email to confirm your account.</p>
      </div>
    </app-page>
  `
})
export class SignupConfirmComponent {
  private route = inject(ActivatedRoute);
  confirmLink: string | null = null;

  constructor() {
    this.confirmLink = this.route.snapshot.queryParamMap.get('confirmLink');
  }
}