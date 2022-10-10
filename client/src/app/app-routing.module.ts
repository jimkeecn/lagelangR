import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddComponent } from './add/add.component';
import { EditComponent } from './edit/edit.component';
import { LoginComponent } from './login/login.component';
import { ManagementComponent } from './management/management.component';
import { RegisterComponent } from './register/register.component';
import { TableComponent } from './table/table.component';

const routes: Routes = [
  {
    path: 'login',
    component:LoginComponent
  },
  {
    path: 'data/:code',
    component:TableComponent
  },
  {
    path: 'data/:code/add',
    component:AddComponent
  },
  {
    path: 'data/:code/edit/:id',
    component:EditComponent
  },
  {
    path: 'management',
    component:ManagementComponent
  },
  {
    path: 'register',
    component:RegisterComponent
  },
  {
    path: '',
    redirectTo: "login",
    pathMatch:'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
