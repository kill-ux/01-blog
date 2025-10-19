import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { Theme, ThemeService } from '../services/theme';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-theme-toggle',
  imports: [],
  templateUrl: './theme-toggle.html',
  styleUrl: './theme-toggle.css'
})
export class ThemeToggle implements OnInit, OnDestroy {
  currentTheme = signal<Theme>('light');
  private themeSubscription: Subscription | null = null;
  themeService = inject(ThemeService)
  

  ngOnInit(): void {
    this.themeSubscription = this.themeService.currentTheme$.subscribe(theme => {
      this.currentTheme.set(theme);
    });
  }

  sdfsd(){
    console.log("gggggggg")
  }

  toggleTheme(): void {
    console.log("gggggggg")
    this.themeService.toggleTheme();
  }

  setTheme(theme: Theme): void {
    this.themeService.setTheme(theme);
  }

  ngOnDestroy(): void {
    if (this.themeSubscription) {
      this.themeSubscription.unsubscribe();
    }
  }


}
