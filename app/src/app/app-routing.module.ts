import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './views/dashboard/dashboard.component';
import { PropertiesViewComponent } from './views/properties-view/properties-view.component';
import { PropertyFormComponent } from './views/property-form/property-form.component';

const routes: Routes = [
  { path: '', redirectTo: "/dashboard", pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'properties', component: PropertiesViewComponent },
  { path: 'add-property', component: PropertyFormComponent },
  { path: 'edit-property/:id', component: PropertyFormComponent },
  { path: '**', redirectTo: "/dashboard", pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
