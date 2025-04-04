import { Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ShellCommandComponent } from './shell-command.component';

@Component({
  selector: 'getting-started',
  standalone: true,
  imports: [CommonModule, FormsModule, ShellCommandComponent],
  template: `
    <div class="flex flex-col w-96">
        <h4 class="py-6 text-center text-xl">Create New Project</h4>

        <input type="text" [(ngModel)]="project" (ngModelChange)="updateProjectZip()" (keydown)="validateSafeName($event)"
            autocomplete="off" spellcheck="false"
            class="mb-8 sm:text-lg rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 dark:bg-gray-800" />

        <section class="w-full flex justify-center text-center">
            <div class="mb-2">
                <div class="flex justify-center text-center">
                    <a class="archive-url hover:no-underline" [href]="zipUrl()">
                        <div class="bg-white dark:bg-gray-800 px-4 py-4 mr-4 mb-4 rounded-lg shadow-lg text-center items-center justify-center hover:shadow-2xl dark:border-2 dark:border-pink-600 dark:hover:border-blue-600"
                            style="min-width: 150px;">
                            <div class="text-center font-extrabold flex items-center justify-center mb-2">
                                <div class="text-4xl text-blue-400 my-3">
                                    <svg class="w-12 h-12 text-red-600" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="m12 2.5l8.84 3.15l-1.34 11.7L12 21.5l-7.5-4.15l-1.34-11.7L12 2.5m0 2.1L6.47 17h2.06l1.11-2.78h4.7L15.45 17h2.05L12 4.6m1.62 7.9h-3.23L12 8.63l1.62 3.87Z"></path></svg>
                                </div>
                            </div>
                            <div class="text-xl font-medium text-gray-700 dark:text-gray-300">Angular SPA</div>
                            <div class="flex justify-center h-8"></div>
                            <span class="archive-name px-4 pb-2 text-blue-600 dark:text-indigo-400">{{ projectZip }}</span>
                        </div>
                    </a>
                </div>
            </div>
        </section>

        <shell-command class="mb-2">dotnet tool install -g x</shell-command>
        <shell-command class="mb-2">x new {{ template }} {{ project }}</shell-command>

        <h4 class="py-6 text-center text-xl">In <b class="text-red-700">/{{project}}.Client</b></h4>
        <shell-command class="mb-2">npm install</shell-command>

        <h4 class="py-6 text-center text-xl">In <b class="text-red-700">/{{project}}</b>, Create Database</h4>
        <shell-command class="mb-2">npm run migrate</shell-command>

        <h4 class="py-6 text-center text-xl">Run .NET Project</h4>
        <shell-command class="mb-2">dotnet watch</shell-command>
    </div>  
  `,
})
export class GettingStartedComponent implements OnInit {
  @Input() template: string = '';
  
  defaultValue = 'ProjectName';
  project: string = '';
  projectZip: string = '';
  
  ngOnInit(): void {
    this.project = this.defaultValue;
    this.updateProjectZip();
  }
  
  handleChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.project = input.value;
    this.updateProjectZip();
  }
  
  updateProjectZip(): void {
    this.projectZip = (this.project || 'MyApp') + '.zip';
  }
  
  zipUrl(): string {
    return `https://account.servicestack.net/archive/${this.template}?Name=${this.project || 'MyApp'}`;
  }
  
  validateSafeName(event: KeyboardEvent): void {
    if (event.key.match(/[\W]+/g)) {
      event.preventDefault();
    }
  }
}