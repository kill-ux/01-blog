import { Component, inject } from '@angular/core';
import { Theme, ThemeService } from '../services/theme';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-theme-toggle',
  imports: [],
  templateUrl: './theme-toggle.html',
  styleUrl: './theme-toggle.css'
})
export class ThemeToggle {
  currentTheme: Theme = 'light';
  private themeSubscription: Subscription;
  themeSer = inject(ThemeService)
  

}
