import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-insert-event',
  templateUrl: './insert-event.component.html',
  styleUrls: ['./insert-event.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
})
export class InsertEventComponent {
  showForm: boolean = false;

  // Define the event object with the necessary fields, including the image in Base64 format
  event = {
    eventName: '',
    eventDate: '',
    eventLocation: '',
    description: '',
    imageBase64: '' // Field for Base64 image
  };

  successMessage: string | undefined;
  errorMessage: string | undefined;

  constructor(private http: HttpClient, private router: Router) {}

  // Toggles the visibility of the form
  toggleFormVisibility(): void {
    this.showForm = !this.showForm;
  }

  // Handles file selection and converts the image file to Base64
  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.event.imageBase64 = reader.result as string; // Store the Base64 string
      };
      reader.readAsDataURL(file); // Read the file as a Data URL
    }
  }

  // Submits the event data to the backend API
  onSubmit(): void {
    const apiUrl = 'http://localhost:5000/api/events';

    // Log the event data before sending it to the backend
    console.log('Event Data to be sent:', this.event);

    this.http.post(apiUrl, this.event).subscribe({
      next: (response: any) => {
        console.log('Response from server:', response); // Log response
        this.successMessage = 'Event added successfully!';
        this.errorMessage = undefined;
        this.resetForm();
        this.showForm = false;
      },
      error: (error) => {
        console.error('Error adding event:', error); // Log error details
        this.errorMessage = 'Failed to add event. Please try again.';
        this.successMessage = undefined;
      }
    });
  }

  // Resets the form fields to their default values
  resetForm(): void {
    this.event = {
      eventName: '',
      eventDate: '',
      eventLocation: '',
      description: '',
      imageBase64: '' // Reset the Base64 string
    };
  }

  // Navigate to the dashboard after successful submission
  navigateToDashboard(): void {
    this.router.navigate(['/dashboard']);
  }
}
