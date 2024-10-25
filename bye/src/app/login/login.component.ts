// frontend/src/app/login/login.component.ts
import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router'; // Import Router
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'] 
})
export class LoginComponent {
  usernameOrEmail: string = '';
  password: string = '';
  errorMessage: string | null = '';
  successMessage: string | null = '';

  // Inject HttpClient and Router
  constructor(private http: HttpClient, private router: Router) {}

  // Handle the login logic
  login() {
    // Reset messages before sending request
    this.errorMessage = null;
    this.successMessage = null;

    // Define the login request payload
    const loginPayload = {
      usernameOrEmail: this.usernameOrEmail,
      password: this.password
    };

    // Send POST request to the backend (replace with your actual API endpoint)
    this.http.post('http://localhost:5000/api/login', loginPayload).subscribe({
      next: (response: any) => {
        // Simulating successful login by checking for success message from API
        if (response && response.message === 'Login successful') {
          this.successMessage = 'Login successful! Redirecting to the dashboard...';
          this.errorMessage = null;

          // Optionally store the token or session data here (if backend provides it)
          // localStorage.setItem('token', response.token);

          // Redirect to dashboard or any other page after a short delay
          setTimeout(() => {
            this.router.navigate(['/dashboard']);
          }, 2000); // Delay of 2 seconds to show the success message
        }
      },
      error: (error) => {
        // Display error message when login fails
        if (error.status === 401 || error.status === 400) {
          this.errorMessage = 'Invalid credentials. Please try again.';
        } else {
          this.errorMessage = 'An unexpected error occurred. Please try again later.';
        }
        this.successMessage = null; // Reset success message
      }
    });
  }

  // Navigate to signup page
  navigateToSignup() {
    this.router.navigate(['/signup']);
  }
}
