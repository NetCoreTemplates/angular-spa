import { Component, OnInit, signal, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Booking, DeleteBooking, QueryBookings, UpdateBooking } from 'src/dtos';
import { JsonServiceClient } from '@servicestack/client';
import { MetadataService } from 'src/components/services/metadata.service';
import { SrcPageComponent } from 'src/shared/src-page.component';
import { PageComponent } from '../page.component';
import { ApiState, provideApiState, tailwindComponents } from 'src/components';

@Component({
    selector: 'app-booking-edit',
    templateUrl: './booking-edit.component.html',
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
export class BookingEditComponent implements OnInit {
    private route = inject(ActivatedRoute);
    private router = inject(Router);
    private client = inject(JsonServiceClient);
    meta = inject(MetadataService);
    api = inject(ApiState);

    // Signals
    booking = signal<Booking>(new Booking());

    ngOnInit(): void {
        // Get booking ID from route params
        const id = this.route.snapshot.paramMap.get('id');
        if (id) {
            this.fetchBooking(parseInt(id, 10));
        } else {
            this.api.setErrorMessage('Booking ID is required');
        }
    }

    async fetchBooking(id: number): Promise<void> {
        this.api.begin();

        const api = await this.client.api(new QueryBookings({ id }));
        if (api.succeeded) {
            this.booking.set(api.response!.results[0]);
        }

        this.api.complete(api.error);
    }

    async save(): Promise<void> {
        this.api.begin();

        const api = await this.client.api(new UpdateBooking(this.booking()));
        if (api.succeeded) {
            this.router.navigate(['/bookings']);
        }
        
        this.api.complete(api.error);
    }

    async delete() {
        this.api.begin();

        const api = await this.client.api(new DeleteBooking({ id: this.booking().id }));
        if (api.succeeded) {
            this.router.navigate(['/bookings']);
        }
        
        this.api.complete(api.error);
    }

    async cancelBooking(cancelled:boolean) {
        this.api.begin();

        const api = await this.client.api(new UpdateBooking({ id: this.booking().id, cancelled }));
        if (api.succeeded) {
            this.router.navigate(['/bookings']);
        }
        
        this.api.complete(api.error);
    }

    close(): void {
        this.router.navigate(['/bookings']);
    }
}