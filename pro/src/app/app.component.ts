import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: true // This should be present
})
export class AppComponent {
  title = 'Your App Title'; // Example property
}
