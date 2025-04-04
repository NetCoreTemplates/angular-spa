import { Injectable, Provider, signal, NgModule } from "@angular/core";
import { createErrorStatus, ResponseError, ResponseStatus } from "@servicestack/client";

import { CellFormatComponent } from "./cell-format.component";
import { CheckboxInputComponent } from "./checkbox-input.component";
import { ConfirmDeleteComponent } from "./confirm-delete.component";
import { DarkModeToggleComponent } from "./dark-mode-toggle.component";
import { DataGridComponent } from "./data-grid.component";
import { ErrorSummaryComponent } from "./error-summary.component";
import { FormLoadingComponent, LoadingComponent } from "./form-loading.component";
import { IconComponent } from "./icon.component";
import { PreviewFormatComponent } from "./preview-format.component";
import { PrimaryButtonComponent } from "./primary-button.component";
import { SecondaryButtonComponent } from "./secondary-button.component";
import { SelectInputComponent } from "./select-input.component";
import { TextInputComponent } from "./text-input.component";
import { TextareaInputComponent } from "./textarea-input.component";
import { BehaviorSubject } from "rxjs";

// Export all components so they can be imported individually
export {
  CellFormatComponent,
  CheckboxInputComponent,
  ConfirmDeleteComponent,
  DarkModeToggleComponent,
  DataGridComponent,
  ErrorSummaryComponent,
  FormLoadingComponent,
  IconComponent,
  LoadingComponent,
  PreviewFormatComponent,
  PrimaryButtonComponent,
  SecondaryButtonComponent,
  SelectInputComponent,
  TextInputComponent,
  TextareaInputComponent
};

const COMPONENTS = [
  CellFormatComponent,
  CheckboxInputComponent,
  ConfirmDeleteComponent,
  DarkModeToggleComponent,
  DataGridComponent,
  ErrorSummaryComponent,
  FormLoadingComponent,
  IconComponent,
  LoadingComponent,
  PreviewFormatComponent,
  PrimaryButtonComponent,
  SecondaryButtonComponent,
  SelectInputComponent,
  TextInputComponent,
  TextareaInputComponent
];

export function tailwindComponents() {
    return COMPONENTS;
}

export function provideApiState(): Provider[] {
    return [
        ApiState,
        { provide: 'ApiState', useExisting: ApiState }
    ];
}

@Injectable({ providedIn: 'root' })
export class ApiState {
    private errorSignal = signal<ResponseStatus | undefined>(undefined);
    private loadingSignal = signal<boolean>(false);
    
    error = this.errorSignal.asReadonly();
    loading = this.loadingSignal.asReadonly();

    begin() {
        this.errorSignal.set(undefined);
        this.loadingSignal.set(true);        
    }

    complete(error?: ResponseStatus) {
        this.errorSignal.set(error);
        this.loadingSignal.set(false);
    }

    setError(error?: ResponseStatus) {
        this.errorSignal.set(error);
    }
    setErrorMessage(message: string, errorCode?: string) {
        this.errorSignal.set(createErrorStatus(message, errorCode));
    }
    setErrorField(fieldName: string, message: string, errorCode?: string) {
        const error = createErrorStatus(message, errorCode);
        error.errors = [
            new ResponseError({ fieldName, message })
        ]
        this.errorSignal.set(error);
    }
    clearError() {
        this.errorSignal.set(undefined);
    }

    setLoading(isLoading: boolean) {
        this.loadingSignal.set(isLoading);
    }
}