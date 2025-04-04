import { Component, OnInit, signal, inject, computed } from '@angular/core';
import { CommonModule, DatePipe, CurrencyPipe } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { JsonServiceClient, ResponseStatus } from '@servicestack/client';
import { Booking, QueryBookings } from 'src/dtos';
import { SrcPageComponent } from 'src/shared/src-page.component';
import { PageComponent } from '../page.component';
import { tailwindComponents } from 'src/components';

@Component({
    selector: 'app-booking-list',
    templateUrl: './booking-list.component.html',
    imports: [
        CommonModule, 
        FormsModule,
        DatePipe, 
        CurrencyPipe,
        PageComponent,
        SrcPageComponent,
        ...tailwindComponents(),
    ],
})
export class BookingListComponent implements OnInit {
    private router = inject(Router);
    private client = inject(JsonServiceClient);

    // Signals for state
    allBookings = signal<Booking[]>([]);
    
    loading = signal<boolean>(true);
    error = signal<ResponseStatus | undefined>(undefined);

    ngOnInit(): void {
        this.loadBookings();
    }

    async loadBookings(): Promise<void> {
        this.loading.set(true);
        this.error.set(undefined);

        const api = await this.client.api(new QueryBookings({
            orderByDesc:'BookingStartDate',
        }));
        if (api.succeeded) {
            this.allBookings.set(api.response!.results);
        } else if (api.error) {
            this.error.set(api.error);
        }
        this.loading.set(false);
    }

    navigateToCreate(): void {
        this.router.navigate(['/bookings/create']);
    }

    navigateToEdit(id: number): void {
        this.router.navigate(['/bookings/edit', id]);
    }
}