import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterModule, NgClass],
  templateUrl: './footer.component.html'
})
export class FooterComponent {
  getNavClass(isActive: boolean): string {
    return [
      "text-sm leading-6 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-50",
      isActive ? "font-bold" : "",
    ].join(" ");
  }
}