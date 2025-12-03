import { Component, computed, inject } from "@angular/core";
import { PageComponent } from "../page.component";
import { SrcPageComponent } from "src/shared/src-page.component";
import { RouterLink } from '@angular/router';
import { tailwindComponents } from "src/components";
import { AuthService } from "src/services/auth.service";
import { MetadataService } from "src/components/services/metadata.service";
import { svgToDataUri } from "src/components/files";

@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    imports: [
        RouterLink,
        PageComponent,
        SrcPageComponent,
        ...tailwindComponents(),
    ],
})
export class ProfileComponent {
    authService = inject(AuthService);
    meta = inject(MetadataService);
    user = computed(() => this.authService.user());

    signout(): void {
        this.authService.signOut();
    }

    onIconError(event: Event): void {
        const svg = this.meta.ui().userIcon?.svg
        if (svg) {
            (event.currentTarget as HTMLImageElement).src = svgToDataUri(svg);
        }
    }
}
