import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { CounterComponent } from './counter/counter.component';
import { WeatherComponent } from './weather/weather.component';
import { TodoMvcComponent } from './todomvc/todos.component';
import { MarkdownPageComponent } from './markdown-page.component';
import { SignInComponent } from './signin/signin.component';
import { SignUpComponent } from './signup/signup.component';
import { SignupConfirmComponent } from './signup/signup-confirm.component';
import { ProfileComponent } from './profile/profile.component';
import { authGuard } from 'src/guards';

import { BOOKING_ROUTES } from './bookings/booking.routes';

export const routes: Routes = [
    { path:'', pathMatch:'full', component: HomeComponent },
    { path:'counter', component: CounterComponent },
    { path:'weather', component: WeatherComponent },
    { path:'todomvc', component: TodoMvcComponent },
    { path:'signin', component: SignInComponent },
    { path:'signup', component: SignUpComponent },
    { path:'signup-confirm', component: SignupConfirmComponent },
    { path:'profile', component: ProfileComponent, canActivate: [authGuard] },
    { path:'about', component: MarkdownPageComponent, data: { page: 'about.md' } },
    { path:'privacy', component: MarkdownPageComponent, data: { page: 'privacy.md' } },
    ...BOOKING_ROUTES,
    { path:'**', redirectTo:'' }
];
