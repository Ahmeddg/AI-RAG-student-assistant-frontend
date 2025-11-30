import { Component } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Smart Study Assistant';
  currentRoute = 'home';

  constructor(private router: Router) {
    this.router.events.subscribe(() => {
      this.updateCurrentRoute();
    });
  }

  updateCurrentRoute(): void {
    const url = this.router.url.split('/').pop() || 'home';
    this.currentRoute = url || 'home';
  }

  navigate(route: string): void {
    this.router.navigate([route]);
  }
}
