import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { JsonServiceClient } from '@servicestack/client';
import { Booking, CreateBooking, RoomType } from 'src/dtos';
import { MetadataService } from 'src/components/services/metadata.service';
import { PageComponent } from '../page.component';
import { SrcPageComponent } from 'src/shared/src-page.component';
import { ApiState, provideApiState, tailwindComponents } from 'src/components';

@Component({
  selector: 'app-booking-create',
  templateUrl: './booking-create.component.html',
    providers: [
        ...provideApiState()
    ],
  imports: [
    CommonModule,
    FormsModule,
    PageComponent,
    SrcPageComponent,
    ...tailwindComponents(),
  ],
})
export class BookingCreateComponent {
  private router = inject(Router);
  private client = inject(JsonServiceClient);
  meta = inject(MetadataService);
  api = inject(ApiState);

  // Signals
  booking = signal<Booking>(new Booking({
    name: '',
    roomType: RoomType.Single,
    roomNumber: 0,
    bookingStartDate: new Date().toISOString().split('T')[0], // Today
    cost: 0,
    cancelled: false
  }));
  bookingGet = this.booking.asReadonly();

  async save(): Promise<void> {
    this.api.begin();

    const request = new CreateBooking(this.booking());
    const api = await this.client.api(request);
    if (api.succeeded) {
      // Navigate back to bookings list after successful save
      this.router.navigate(['/bookings']);
    }

    this.api.complete(api.error);
  }

  cancel(): void {
    // Navigate back without saving
    this.router.navigate(['/bookings']);
  }
}