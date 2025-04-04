import { Injectable, signal, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { JsonServiceClient } from '@servicestack/client';
import { Authenticate, AuthenticateResponse } from 'src/dtos';

const authKey = 'auth'

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private router = inject(Router);
    private client = inject(JsonServiceClient);

    // User state managed with signals
    public user = signal<AuthenticateResponse | undefined>(undefined);

    // Computed signals for derived state
    signedIn = computed(() => !!this.user());

    constructor() {
        this.loadUserFromSession();
        this.revalidate();
    }

    private loadUserFromSession(): void {
        try {
            const user = sessionStorage.getItem(authKey);
            if (user) {
                this.user.set(JSON.parse(user));
            }
        } catch (e) {
            console.error('Error loading user data from session', e);
        }
    }

    async revalidate(): Promise<void> {
        const api = await this.client.api(new Authenticate());

        if (api.succeeded) {
            this.user.set(api.response!);
            sessionStorage.setItem(authKey, JSON.stringify(api.response!));
            return;
        }
        else if (api.error) {
            // If response is not OK, clear the user
            this.clear();
        }
    }

    clear() {
        this.user.set(undefined);
        sessionStorage.removeItem(authKey);
    }

    signIn(user?: AuthenticateResponse, redirectTo='/'): void {
        if (user?.userName) {
            this.user.set(user)
            sessionStorage.setItem(authKey, JSON.stringify(user));
            this.router.navigate([redirectTo]);
        } else {
            this.signOut();
        }
    }

    signOut(redirectTo='/signin'): void {
        this.clear();
        this.client.api(new Authenticate({ provider: 'logout' }));
        this.router.navigate([redirectTo]);
    }

    hasRole(role: string): boolean {
        const currentUser = this.user();
        return currentUser?.roles?.includes(role) || false;
    }

    hasPermission(permission: string): boolean {
        const currentUser = this.user();
        return currentUser?.permissions?.includes(permission) || false;
    }
}