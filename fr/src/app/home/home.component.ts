import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http'; // Import HttpClient

// Event interface
export interface Event {
  _id: string;
  eventName: string;
  eventDate: string;
  eventLocation: string;
  description: string;
  imageBase64: string;  // Since the image is returned as a base64 string
}

// Define the structure of the expected API response
interface EventApiResponse {
  events: Event[];
}

// Define the UserRole interface instead of TeamMember
interface UserRole {
  _id: string;
  username: string;
  email: string;
  department: string;
  role: string;
  photoBase64?: string; // Optional in case the photo is missing
}

interface UserRoleApiResponse {
  userRoles: UserRole[];
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, HttpClientModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit {
  events: Event[] = [];  // Events data
  team: UserRole[] = [];  // UserRoles data for displaying as team members
  errorMessage: string | null = null;

  contactForm = {
    name: '',
    email: '',
    message: ''
  };

  constructor(private router: Router, private http: HttpClient) {}

  ngOnInit() {
    this.fetchEvents();  // Fetch events when the component is initialized
    this.fetchTeam();    // Fetch userRoles when the component is initialized
  }

  fetchEvents() {
    this.http.get<EventApiResponse>('https://datalytics-website.onrender.com/api/events')  // Replace with your backend API URL
      .subscribe(
        (response) => {
          const today = new Date();
          if (response && Array.isArray(response.events)) {
            this.events = response.events
              .filter(event => new Date(event.eventDate) >= today) // Filter out past events
              .sort((a, b) => new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime()); // Sort by upcoming date
          }
        },
        (error) => {
          this.errorMessage = 'Failed to load events. Please try again later.';
          console.error('Error fetching events:', error);
        }
      );
  }

  fetchTeam() {
    this.http.get<UserRoleApiResponse>('https://datalytics-website.onrender.com/api/events')  // Replace with your backend API URL
      .subscribe(
        (response) => {
          if (response && Array.isArray(response.userRoles)) {
            this.team = response.userRoles;  // Assign fetched userRoles to the team array
          } else {
            console.error('Unexpected response format:', response);
          }
        },
        (error) => {
          this.errorMessage = 'Failed to load team members. Please try again later.';
          console.error('Error fetching team:', error);
        }
      );
  }

  onJoinUs(): void {
    this.router.navigate(['/events']);
  }

  navigateToEvents(): void {
    this.router.navigate(['/events']);
  }

  navigateToAboutUs(): void {
    this.router.navigate(['/about-us']);
  }

  navigateToContactUs(): void {
    this.router.navigate(['/contact-us']);
  }

  onSubmitContactForm(): void {
    console.log('Contact Form Submitted', this.contactForm);
    this.contactForm = {
      name: '',
      email: '',
      message: ''
    };
  }

  goToEventsPage(): void {
    this.router.navigate(['/Events']);
  }

  goToMembersPage(): void {
    this.router.navigate(['/Contact']);
  }

  navigateToDashboard(): void {
    this.router.navigate(['/dashboard']);
  }
}
