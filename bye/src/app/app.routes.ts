import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import {UserComponent} from './user/user.component'
import {EventsComponent} from './events/events.component'
import {InsertEventComponent} from './insert-event/insert-event.component'
import {UserRoleFetchComponent} from './user-role-fetch/user-role-fetch.component'
export const routes: Routes = [
  { path: 'signup', component: SignupComponent },
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'UserComponent', component: UserComponent },
  { path: 'EventComponent', component: EventsComponent },
  { path: 'InsertEventComponent', component: InsertEventComponent },
  { path: 'UserRoleFetchComponent', component: UserRoleFetchComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' }, // Redirect to login by default
];
