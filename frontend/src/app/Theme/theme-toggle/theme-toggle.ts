import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { Theme, ThemeService } from '../services/theme';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-theme-toggle',
  imports: [],
  templateUrl: './theme-toggle.html',
  styleUrl: './theme-toggle.css'
})
export class ThemeToggle {
  themeService = inject(ThemeService)

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }
}
