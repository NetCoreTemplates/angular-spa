import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { GettingStartedComponent } from 'src/app/home/getting-started.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterModule, GettingStartedComponent],
  templateUrl: './home.component.html'
})
export class HomeComponent {  
}
