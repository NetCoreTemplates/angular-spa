import { Routes } from '@angular/router';
import { BookingListComponent } from './booking-list.component';
import { BookingCreateComponent } from './booking-create.component';
import { BookingEditComponent } from './booking-edit.component';
import { authGuard } from 'src/guards';

export const BOOKING_ROUTES: Routes = [
  { 
    path: 'bookings', 
    component: BookingListComponent,
    canActivate: [authGuard]
  },
  { 
    path: 'bookings/create', 
    component: BookingCreateComponent,
    canActivate: [authGuard]
  },
  { 
    path: 'bookings/edit/:id', 
    component: BookingEditComponent,
    canActivate: [authGuard]
  }
];
