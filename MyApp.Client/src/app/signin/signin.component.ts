import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { signal } from '@angular/core';
import { JsonServiceClient } from '@servicestack/client';
import { PageComponent } from '../page.component';
import { AuthService } from 'src/services/auth.service';
import { Authenticate } from 'src/dtos';
import { ApiState, provideApiState, tailwindComponents } from 'src/components';
import { SrcPageComponent } from 'src/shared/src-page.component';

@Component({
    selector: 'app-signin',
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
    templateUrl: './signin.component.html',
})
export class SignInComponent implements OnInit {
    private router = inject(Router);
    private route = inject(ActivatedRoute);
    private authService = inject(AuthService);
    private client = inject(JsonServiceClient);
    api = inject(ApiState);

    request = signal<Authenticate>(new Authenticate({
        provider: 'credentials',
        userName: '',
        password: '',
        rememberMe: false
    }));
    signedIn = this.authService.signedIn;

    ngOnInit(): void {
        if (this.signedIn()) {
            this.redirectIfSignedIn();
        }
    }

    setUser(email: string): void {
        const request = this.request();
        request.userName = email;
        request.password = 'p@55wOrd';
        this.request.set(request);
    }

    getRedirect(): string {
        const redirect = this.route.snapshot.queryParamMap.get('redirect');
        return redirect || '/';
    }

    redirectIfSignedIn(): void {
        this.router.navigate([this.getRedirect()], { replaceUrl: true });
    }

    async onSubmit(event: Event): Promise<void> {
        event.preventDefault();
        this.api.begin();

        const api = await this.client.api(new Authenticate(this.request()));

        if (api.succeeded) {
            this.authService.signIn(api.response!, this.getRedirect());
        }

        this.api.complete(api.error);
    }
}