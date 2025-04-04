import { Component, signal } from "@angular/core";
import { PageComponent } from "../page.component";
import { SrcPageComponent } from "src/shared/src-page.component";
import { tailwindComponents } from "src/components";

@Component({
    selector: 'counter',
    templateUrl: './counter.component.html',
    imports: [
        PageComponent,
        SrcPageComponent,
        ...tailwindComponents(),
    ],
})
export class CounterComponent {
    count = signal(0);
}
