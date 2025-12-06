import { Component, inject, signal } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { Navbar } from './layouts/navbar/navbar';
import { ThemeService } from './Theme/services/theme';


/**
 * Root component of the Angular application.
 * Handles the main application layout and theme management.
 */
@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})

export class App {
  themeService = inject(ThemeService)
}
