import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { TasksComponent } from './tasks/tasks.component';
import { ValuesComponent } from './values/values.component';
import { LightComponent } from './lights/lights.component';
import { SmartHomeComponent } from './smart-home/smart-home.component';

import { NgxChartsModule } from '@swimlane/ngx-charts';
import { MatDialogModule, MatButtonModule, MatCardModule, MatSlideToggleModule, MatButtonToggleModule, MatSliderModule } from '@angular/material';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';

// The fit componnent
import { MyfitComponent } from './myfit/myfit.component';
import { UserService } from './core/fit.service';
import { MyFitResource } from './myfit/myfit.resource';

// The custom sleep data bar chart
import { MySeriesHorizontal } from './series-horizontal-stacked-custom/series-horizontal-custom.component';
import { MyBarHorizontalStackedComponent } from './series-horizontal-stacked-custom/series-horizontal-stacked-custom.component';

// configure Google Api
import { GoogleApiModule, NgGapiClientConfig, NG_GAPI_CONFIG } from 'ng-gapi';

const gapiClientConfig: NgGapiClientConfig = {
  client_id: '216942560837-n69urbnusio46s1fgioeli3ffs3tg6u1.apps.googleusercontent.com',
  discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/fitness/v1/rest'],
  scope: [
    'https://www.googleapis.com/auth/fitness.activity.read',
    'https://www.googleapis.com/auth/fitness.body.read',
    'https://www.googleapis.com/auth/fitness.location.read',
  ].join(' ')
};

@NgModule({
  declarations: [
    AppComponent,
    ValuesComponent,
    LightComponent,
    SmartHomeComponent,
    ValuesComponent,
    MyfitComponent,
    MySeriesHorizontal,
    MyBarHorizontalStackedComponent,
    TasksComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    FormsModule,
    HttpClientModule,
    GoogleApiModule.forRoot({
      provide: NG_GAPI_CONFIG,
      useValue: gapiClientConfig
    }),
    BrowserAnimationsModule,
    FlexLayoutModule,
    NgxChartsModule,
    MatDialogModule,
    MatButtonModule,
    MatSlideToggleModule,
    MatButtonToggleModule,
    MatCardModule,
    MatSliderModule,
    MatGridListModule,
    MatIconModule
  ],
  providers: [UserService, MyFitResource],
  bootstrap: [AppComponent]
})
export class AppModule { }
