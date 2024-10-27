import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  standalone: true,
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
  imports: [FormsModule, CommonModule, HttpClientModule] // Include HttpClientModule
})
export class SignupComponent {
  username: string = '';
  email: string = '';
  password: string = '';
  errorMessage: string | null = null;  // To store error messages
  successMessage: string | null = null; // To store success messages
  submittedData: { username: string; email: string; password: string } | null = null; // To store submitted data
  
  constructor(private http: HttpClient, private router: Router) {} // Inject HttpClient and Router

  // Navigate to login page
  navigateToLogin() {
    this.router.navigate(['/login']); // Use the router to navigate to login
  }

  // Handle the signup form submission
  onSignup(signupForm: any) {
    // Clear any previous messages
    this.errorMessage = null;
    this.successMessage = null;

    if (signupForm.valid) {
      // Store submitted data
      this.submittedData = {
        username: this.username,
        email: this.email,
        password: this.password,
      };

      // Print submitted data in console
      console.log('Submitted Data:', this.submittedData);

      // Send data to the backend
      this.http.post('https://datalytics-website.onrender.com/api/signup', this.submittedData)
        .subscribe({
          next: (response: any) => {
            console.log('Response from server:', response); // Log response from server

            // Check for success response and message
            if (response && response.message === 'User created successfully') {
              this.successMessage = 'Signup successful! Redirecting to login...'; // Show success message
              
              // Reset form fields and data after successful signup
              signupForm.reset();
              this.submittedData = null;

              // Redirect to login page after a 2-3 second delay
              setTimeout(() => {
                this.navigateToLogin();
              }, 2000);
            } else {
              // Handle unexpected response structure (just in case)
              this.errorMessage = 'An unexpected error occurred. Please try again later.';
            }
          },
          error: (error) => {
            console.error('Error occurred while signing up:', error); // Log error
            
            // Handle specific errors from the server
            if (error.status === 400 && error.error.message === 'Email already exists') {
              this.errorMessage = 'This email is already in use.';
            } else if (error.status === 400 && error.error.message === 'Username already exists') {
              this.errorMessage = 'This username is already taken.';
            } else {
              this.errorMessage = 'An unexpected error occurred. Please try again later.';
            }
          }
        });
    } else {
      this.errorMessage = 'Please fill out all required fields correctly.';
    }
  }
}
