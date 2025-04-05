import { Component, inject, OnInit } from '@angular/core';
import { Forecast, GetWeatherForecast, ResponseStatus } from 'src/dtos';
import { ApiHttpClient } from 'src/components/services/api-http-client.service';
import { PageComponent } from "../page.component";
import { SrcPageComponent } from 'src/shared/src-page.component';
import { DatePipe } from '@angular/common';
import { tailwindComponents } from 'src/components';

@Component({
  selector: 'weather',
  imports: [
    DatePipe,
    PageComponent,
    SrcPageComponent,
    ...tailwindComponents(),
  ],
  templateUrl: './weather.component.html'
})
export class WeatherComponent implements OnInit {
  http = inject(ApiHttpClient);

  public error: ResponseStatus | null = null;
  public forecasts: Forecast[] = [];
  public testValue:string = '';

  ngOnInit() {
    this.getForecasts();
  }

  getForecasts() {
    this.http.api(new GetWeatherForecast({ date:'2025-04-01' })).subscribe({
      next:(result) => {
        this.error = null;
        this.forecasts = result;
      },
      error:(error) => {
        this.error = error;
      }
    });
  }

  formatDate(date: string): string {
    return new Intl.DateTimeFormat().format(new Date(date))
  }
}
