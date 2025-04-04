import { Component, computed, inject, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { RouterLink } from '@angular/router';
import { tailwindComponents } from 'src/components';
import { MetadataService } from 'src/components/services/metadata.service';
import { svgToDataUri } from 'src/components/files';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    imports: [
        RouterLink,
        ...tailwindComponents(),
    ],
})
export class HeaderComponent {
    authService = inject(AuthService);
    meta = inject(MetadataService);
    user = computed(() => this.authService.user());

    signout(): void {
        this.authService.signOut();
    }

    // Helper method for the active route CSS
    getNavClass(isActive: boolean): string {
        return `p-4 flex items-center justify-start mw-full hover:text-sky-500 dark:hover:text-sky-400 ${isActive ? 'text-link-dark dark:text-link-dark' : ''}`;
    }

    onIconError(event: Event): void {
        const svg = this.meta.ui().userIcon?.svg
        if (svg) {
            (event.currentTarget as HTMLImageElement).src = svgToDataUri(svg);
        }
    }
}
