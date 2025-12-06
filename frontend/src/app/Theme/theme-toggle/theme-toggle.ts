import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { Theme, ThemeService } from '../services/theme';
import { Subscription } from 'rxjs';

/**
 * Component for toggling between light and dark themes.
 * Interacts with the ThemeService to change the application's theme.
 */
@Component({
  selector: 'app-theme-toggle',
  imports: [],
  templateUrl: './theme-toggle.html',
  styleUrl: './theme-toggle.css'
})
export class ThemeToggle {
  themeService = inject(ThemeService)

  /**
   * Toggles the application's theme using the ThemeService.
   */
  toggleTheme(): void {
    this.themeService.toggleTheme();
  }
}
