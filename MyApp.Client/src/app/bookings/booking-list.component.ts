import { Component, OnInit, signal, inject, computed } from '@angular/core';
import { CommonModule, DatePipe, CurrencyPipe } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { JsonServiceClient, ResponseStatus } from '@servicestack/client';
import { Booking, QueryBookings } from 'src/dtos';
import { SrcPageComponent } from 'src/shared/src-page.component';
import { PageComponent } from '../page.component';
import { ApiState, provideApiState, tailwindComponents } from 'src/components';

@Component({
    selector: 'app-booking-list',
    templateUrl: './booking-list.component.html',
    providers: [
        ...provideApiState()
    ],
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
    api = inject(ApiState);

    // Signals for state
    allBookings = signal<Booking[]>([]);

    ngOnInit(): void {
        this.loadBookings();
    }

    async loadBookings(): Promise<void> {
        this.api.begin();

        const api = await this.client.api(new QueryBookings({
            orderByDesc: 'BookingStartDate',
        }));
        if (api.succeeded) {
            this.allBookings.set(api.response!.results);
        }
        
        this.api.complete(api.error);
    }

    navigateToCreate(): void {
        this.router.navigate(['/bookings/create']);
    }

    navigateToEdit(id: number): void {
        this.router.navigate(['/bookings/edit', id]);
    }
}