
import { Component } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [HttpClientModule, DashboardComponent, RouterModule],
  template: `
    <div>
       <router-outlet></router-outlet>
    </div>
  `,
})
export class AppComponent {
  constructor(private router: Router) {}


  navigateToDashboard() {
    this.router.navigate(['/dashboard']);
  }
}
