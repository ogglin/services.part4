import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireModule } from 'angularfire2';
import {environment} from "../environments/environment";
import { HomeComponent } from './components/home/home.component';
import {ReactiveFormsModule} from "@angular/forms";
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from "@angular/material/input";
import {MatButtonModule} from "@angular/material/button";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {HttpClientModule} from "@angular/common/http";
import { UchetMainComponent } from './components/forms/uchet-main/uchet-main.component';
import { AutocompleteComponent } from './components/items/autocomplete/autocomplete.component';
import { ButtonComponent } from './components/items/button/button.component';
import {MatAutocompleteModule} from "@angular/material/autocomplete";
import {MatSelectModule} from "@angular/material/select";
import {MatTableModule} from "@angular/material/table";
import {MatPaginatorModule} from "@angular/material/paginator";
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {MatIconModule} from "@angular/material/icon";
import {MatSlideToggleModule} from "@angular/material/slide-toggle";
import { DevicesComponent } from './components/forms/devices/devices.component';
import { TasksComponent } from './components/forms/tasks/tasks.component';
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatNativeDateModule} from '@angular/material';
import {MAT_MOMENT_DATE_FORMATS, MatMomentDateModule, MomentDateAdapter} from "@angular/material-moment-adapter";
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from "@angular/material/core";
import {NgxMaterialTimepickerModule} from 'ngx-material-timepicker';
import { AdminComponent } from './components/admin/admin.component';
import {MatSidenavModule} from "@angular/material/sidenav";
import {MatListModule} from "@angular/material/list";
import { CompaniesComponent } from './components/admin/companies/companies.component';
import { AddressesComponent } from './components/admin/addresses/addresses.component';
import { PersonalsComponent } from './components/admin/personals/personals.component';
import { WorksComponent } from './components/admin/works/works.component';
import { StatusesComponent } from './components/admin/statuses/statuses.component';
import {DevicesListComponent} from "./components/admin/devices-list/devices-list.component";
import {SigninComponent} from "./components/forms/signin/signin.component";
import {SignupComponent} from "./components/forms/signup/signup.component";

const material = [
  MatFormFieldModule,
  MatInputModule,
  MatButtonModule,
  BrowserAnimationsModule,
  MatAutocompleteModule,
  MatSelectModule,
  MatTableModule,
  MatButtonToggleModule,
  MatIconModule,
  MatPaginatorModule,
  MatSlideToggleModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatMomentDateModule,
  MatSidenavModule,
  MatListModule
];

@NgModule({
  declarations: [HomeComponent, SigninComponent, SignupComponent, UchetMainComponent, AutocompleteComponent,
    ButtonComponent, DevicesComponent, TasksComponent, AdminComponent, CompaniesComponent, AddressesComponent,
    PersonalsComponent, WorksComponent, StatusesComponent, DevicesListComponent],
  imports: [
    CommonModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    material,
    ReactiveFormsModule,
    HttpClientModule,
    NgxMaterialTimepickerModule.setLocale('ru-RU')
  ],
  providers: [
    {provide: MAT_DATE_LOCALE, useValue: 'ru-RU'},
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
    {provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS},
  ],
  exports: [
    AngularFireModule,
    AngularFirestoreModule,
    material,
    HomeComponent
  ]
})
export class SharedModule { }
