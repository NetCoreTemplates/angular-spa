import { Component, signal, effect, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { ApiState, provideApiState, tailwindComponents } from 'src/components';
import { PageComponent } from '../page.component';
import { Register, RegisterResponse } from 'src/dtos';
import { AuthService } from 'src/services/auth.service';
import { JsonServiceClient, toPascalCase } from '@servicestack/client';
import { SrcPageComponent } from 'src/shared/src-page.component';

@Component({
    selector: 'app-sign-up',
    providers: [
        ...provideApiState()
    ],
    imports: [
        CommonModule,
        FormsModule,
        RouterModule,
        PageComponent,
        SrcPageComponent,
        ...tailwindComponents(),
    ],
    templateUrl: './signup.component.html',
})
export class SignUpComponent {
    private router = inject(Router);
    private route = inject(ActivatedRoute);
    private authService = inject(AuthService);
    private client = inject(JsonServiceClient);
    api = inject(ApiState);

    request = signal<Register>(new Register({
        displayName: '',
        userName: '',
        password: '',
        confirmPassword: '',
    }));
    signedIn = this.authService.signedIn;

    constructor() {
        effect(() => {
            if (this.signedIn()) {
                const redirectTo = this.getRedirect() || '/';
                this.router.navigate([redirectTo]);
            }
        });
    }

    getRedirect(): string | null {
        return this.route.snapshot.queryParamMap.get('redirect');
    }

    setUser(email: string): void {
        const parts = email.split('@');
        const first = parts[0];
        const last = parts[1].split('.')[0];

        const request = this.request();
        request.displayName = toPascalCase(first) + ' ' + toPascalCase(last);
        request.userName = email;
        request.password = request.confirmPassword = 'p@55wOrd';
        this.request.set(request);
    }

    async onSubmit(e: Event): Promise<void> {
        e.preventDefault();

        const request = new Register(this.request());

        if (request.password !== request.confirmPassword) {
            this.api.setErrorField('confirmPassword', 'Passwords do not match');
            return;
        }

        this.api.begin();


        const api = await this.client.api(request);
        if (api.succeeded) {
            await this.authService.revalidate();
            const registerResponse = api.response as RegisterResponse;

            if (registerResponse.redirectUrl) {
                location.href = registerResponse.redirectUrl;
            } else {
                this.router.navigate(['/signin']);
            }
        }

        this.api.complete(api.error);
    }
}