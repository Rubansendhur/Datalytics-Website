import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { Router } from '@angular/router'; // Import Router
export interface User {
  id: string; // Unique ID
  username?: string; // Username can be optional
  email?: string; // Email can be optional
}

@Component({
  selector: 'app-aboutus',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './aboutus.component.html',
  styleUrl: './aboutus.component.css'
})
export class AboutusComponent {
  users: User[] = []; // Array to hold user data
 errorMessage: string | undefined; // Variable to hold error messages

  constructor(private http: HttpClient, private router: Router) {}
  
  ngOnInit(): void {
    this.fetchUsers(); // Fetch users when the component initializes
  }

  fetchUsers(): void {
    const apiUrl = 'http://localhost:5000/api/users'; // Replace with your actual API URL

    this.http.get<{ message: string; users: User[] }>(apiUrl).subscribe({
      next: (data) => {
        this.users = data.users; // Assign the fetched user data to the users array
        this.errorMessage = undefined; // Clear any previous error message
      },
      error: (error) => {
        this.errorMessage = 'Failed to fetch users'; // Set error message on failure
        console.error('Error fetching users:', error); // Log the error for debugging
      }
    });
  }
 // Inject HttpClient and Router
  navigateToDashboard(): void {
    this.router.navigate(['/Dashboard']); // Navigate to the dashboard route
  }
}
