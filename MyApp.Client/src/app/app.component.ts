import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ResponseStatus } from '@servicestack/client';
import { HeaderComponent } from './header.component';
import { FooterComponent } from './footer.component';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet, 
    HeaderComponent,
    FooterComponent,
  ],
  templateUrl: './app.component.html'
})
export class AppComponent {
  public error: ResponseStatus | null = null;

  title = 'MyApp';
}
