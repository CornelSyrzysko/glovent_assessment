import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DataInterceptor } from './services/data-interceptor.service';
import { DashboardComponent } from './views/dashboard/dashboard.component';
import { PropertiesViewComponent } from './views/properties-view/properties-view.component';
import { PropertyFormComponent } from './views/property-form/property-form.component';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GoogleMapsModule } from '@angular/google-maps'

import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { FileUploadModule } from 'primeng/fileupload';

import { DynamicDialogModule, DialogService } from 'primeng/dynamicdialog';
import { ConfirmationService } from 'primeng/api';


import { CamelToTitlePipe } from './helpers/camel-to-title.pipe';
import { LoaderComponent } from './components/loader/loader.component';
import { ErrorDialogComponent } from './components/error-dialog/error-dialog.component';
import { BackButtonDirective } from './directives/back-button.directive';


@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    PropertiesViewComponent,
    PropertyFormComponent,
    CamelToTitlePipe,
    LoaderComponent,
    ErrorDialogComponent,
    BackButtonDirective
  ],
  imports: [
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    BrowserModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    RouterModule,
    GoogleMapsModule,

    //all primeNG Modules
    TableModule,
    ButtonModule,
    InputTextModule,
    DropdownModule,
    InputNumberModule,
    InputTextareaModule,
    ConfirmDialogModule,
    DynamicDialogModule,
    FileUploadModule
  ],
  providers: [{
    provide: HTTP_INTERCEPTORS,
    useClass: DataInterceptor,
    multi: true
  },
  DialogService, ConfirmationService
],
  bootstrap: [AppComponent]
})
export class AppModule { }
