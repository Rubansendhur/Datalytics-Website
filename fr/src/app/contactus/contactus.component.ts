import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

// Define the User interface based on your UserRole schema
export interface User {
  id: string; // Unique ID for the user (can be optional depending on your setup)
  username: string; // Username of the user
  email: string; // Email of the user
  department: string; // Department of the user
  role: string; // Role of the user (e.g., admin, user)
}

@Component({
  selector: 'app-user-role-fetch',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './contactus.component.html',
  styleUrls: ['./contactus.component.css']
})
export class ContactusComponent implements OnInit {
  users: User[] = []; // Array to hold fetched users
  errorMessage: string | undefined; // Variable to hold error messages

  constructor(private http: HttpClient, private router: Router) {} // Inject HttpClient and Router


  ngOnInit(): void {
    this.fetchUsers(); // Fetch users when the component initializes
  }

  fetchUsers(): void {
    const apiUrl = 'http://localhost:5000/api/userRoles'; // API URL for fetching user roles

    this.http.get<{ message: string; userRoles: User[] }>(apiUrl).subscribe({
      next: (data) => {
        this.users = data.userRoles; // Assign the fetched user roles to the users array
        this.errorMessage = undefined; // Clear any previous error message
      },
      error: (error) => {
        this.errorMessage = 'Failed to fetch users'; // Set error message on failure
        console.error('Error fetching users:', error); // Log the error for debugging
      }
    });
  }
  navigateToDashboard(): void {
    this.router.navigate(['/Dashboard']); // Navigate to the dashboard route
  }
}
