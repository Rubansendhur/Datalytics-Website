import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-events',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css'],
})
export class EventsComponent implements OnInit {
  events: any[] = []; // Array to store fetched events
  errorMessage: string = '';
  eventsLoaded: boolean = false; // Track whether events have been loaded

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.fetchEvents(); // Fetch events when the component is initialized
  }

  fetchEvents(): void {
    this.http.get<{ message: string; events: any[] }>('http://localhost:5000/api/events')
      .subscribe(
        (response) => {
          console.log('Fetched events:', response.events); // Log the fetched events
          this.events = response.events; // Assign fetched events to the events array
          this.eventsLoaded = true; // Mark events as loaded
        },
        (error) => {
          console.error('Error fetching events:', error);
          this.errorMessage = 'Failed to load events. Please try again later.';
          this.eventsLoaded = true; // Mark events as loaded even if there's an error
        }
      );
  }

  deleteEvent(eventId: string): void {
    const apiUrl = `http://localhost:5000/api/events/${eventId}`;

    this.http.delete(apiUrl).subscribe({
      next: (response: any) => {
        console.log('Event deleted successfully:', response);
        this.events = this.events.filter(event => event._id !== eventId); // Remove the deleted event from the array
      },
      error: (error) => {
        console.error('Error deleting event:', error);
        this.errorMessage = 'Failed to delete the event. Please try again later.';
      }
    });
  }

  trackByEventId(index: number, event: any): number {
    return event.id; // Ensure 'id' is a unique identifier for your events
  }

  navigateTodashboard(): void {
    this.router.navigate(['/dashboard']);
  }
}
