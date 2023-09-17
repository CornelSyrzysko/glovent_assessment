import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';2
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
import { ImageModule } from 'primeng/image';
import { MessagesModule } from 'primeng/messages';
import { MessageModule } from 'primeng/message';

import { DynamicDialogModule, DialogService } from 'primeng/dynamicdialog';
import { ConfirmationService } from 'primeng/api';


import { CamelToTitlePipe } from './helpers/camel-to-title.pipe';
import { LoaderComponent } from './components/loader/loader.component';
import { ErrorDialogComponent } from './components/error-dialog/error-dialog.component';
import { BackButtonDirective } from './directives/back-button.directive';
import { initializeApp,provideFirebaseApp } from '@angular/fire/app';
// import { getStorage, provideStorage }
// from '@angular/fire/storage';
import { environment } from '../environments/environment';
import { provideFirestore,getFirestore } from '@angular/fire/firestore';
import { AngularFireModule, FIREBASE_OPTIONS } from '@angular/fire/compat';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';


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
    // AngularFireModule.initializeApp(environment.firebase),
    // provideFirebaseApp(() => initializeApp(environment.firebase)),

    // provideStorage(() => getStorage()),
    // AngularFireModule.initializeApp(environment.firebaseConfig),
    // AngularFireDatabaseModule,
    AngularFireStorageModule,

    //all primeNG Modules
    TableModule,
    ButtonModule,
    InputTextModule,
    DropdownModule,
    InputNumberModule,
    InputTextareaModule,
    ConfirmDialogModule,
    DynamicDialogModule,
    FileUploadModule,
    ImageModule,
    MessagesModule,
    MessageModule,

  ],
  providers: [{
    provide: HTTP_INTERCEPTORS,
    useClass: DataInterceptor,
    multi: true
  },
  { provide: FIREBASE_OPTIONS, useValue: environment.firebase },
  DialogService, ConfirmationService
],
  bootstrap: [AppComponent]
})
export class AppModule { }
