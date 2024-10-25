import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

// Define the User interface
export interface User {
  id: string; // Unique ID
  username?: string; // Username can be optional
  email?: string; // Email can be optional
}

// Define the UserInsert interface for new user data
export interface UserInsert {
  username: string; // The username of the user
  role: string;     // The role of the user (e.g., admin, user)
  email: string;    // The email of the user
  department: string; // The department of the user
}

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  users: User[] = []; // Array to hold user data
  newUser: UserInsert = { // Object to hold new user data
    username: '',
    role: '',
    email: '',
    department: ''
  };
  isInsertUserFormVisible = false; // Flag to toggle the visibility of the insert form
  errorMessage: string | undefined; // Variable to hold error messages

  constructor(private http: HttpClient, private router: Router) {} // Inject HttpClient and Router

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

  deleteUser(userId: string): void {
    const deleteUrl = `http://localhost:5000/api/users/${userId}`; // API URL for deleting a user

    this.http.delete<{ message: string }>(deleteUrl).subscribe({
      next: () => {
        this.fetchUsers(); // Refresh the user list after deletion
      },
      error: (error) => {
        this.errorMessage = 'Failed to delete user'; // Set error message on failure
        console.error('Error deleting user:', error); // Log the error for debugging
      }
    });
  }

  insertUser(): void {
    const apiUrl = 'http://localhost:5000/api/addUserRole'; // Replace with your actual API URL for adding a new user

    this.http.post<{ message: string }>(apiUrl, this.newUser).subscribe({
      next: () => {
        this.fetchUsers(); // Refresh the user list after adding the new user
        this.resetNewUserForm(); // Clear the form data
        this.isInsertUserFormVisible = false; // Hide the insert user form
        this.errorMessage = undefined; // Clear any previous error message
      },
      error: (error) => {
        this.errorMessage = 'Failed to add user'; // Set error message on failure
        console.error('Error adding user:', error); // Log the error for debugging
      }
    });
  }

  toggleInsertUserForm(): void {
    this.isInsertUserFormVisible = !this.isInsertUserFormVisible; // Toggle form visibility
  }

  resetNewUserForm(): void {
    this.newUser = { // Reset the new user form
      username: '',
      role: '',
      email: '',
      department: ''
    };
  }

  navigateToDashboard(): void {
    this.router.navigate(['/dashboard']); // Navigate to the dashboard route
  }
}
