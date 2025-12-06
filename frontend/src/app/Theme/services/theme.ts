import { Injectable, signal } from "@angular/core";

export type Theme = 'light' | 'dark';

const prismThemeLink = document.getElementById('prismTheme');

const themesCode = {
  light: 'https://cdn.jsdelivr.net/npm/prismjs@1.29.0/themes/prism-coy.css',
  dark: 'https://cdn.jsdelivr.net/npm/prismjs@1.29.0/themes/prism-funky.css'
};


/**
 * Service for managing the application's theme (light or dark mode).
 * Handles theme initialization, setting, applying, and toggling.
 */
@Injectable({
    providedIn: 'root'
})
export class ThemeService {
    currentTheme = signal<Theme>('light');
    /**
     * Constructs the ThemeService and initializes the theme.
     */
    constructor() {
        this.initializeTheme()
    }

    /**
     * Initializes the application's theme based on user preferences stored in local storage
     * or the system's preferred color scheme.
     */
    initializeTheme() {
        const savedTheme = localStorage.getItem('theme') as Theme;
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
        const initialTheme = savedTheme || (systemPrefersDark ? 'dark' : 'light')

        this.setTheme(initialTheme)
    }

    /**
     * Sets the application's theme.
     * @param theme The theme to set ('light' or 'dark').
     */
    setTheme(theme: Theme) {
        this.currentTheme.set(theme);
        this.applyTheme(theme);
        localStorage.setItem('theme', theme);
    }

    /**
     * Applies the selected theme to the document's HTML element and updates the Prism.js theme.
     * @param theme The theme to apply ('light' or 'dark').
     */
    applyTheme(theme: Theme) {
        document.documentElement.setAttribute('data-theme', theme)
        document.documentElement.classList.remove('light-theme', 'dark-theme');
        document.documentElement.classList.add(`${theme}-theme`);
        prismThemeLink?.setAttribute('href', themesCode[theme]);

        // Update meta theme-color for mobile browsers
        this.updateMetaThemeColor(theme);
    }

    /**
     * Updates the meta theme-color tag for mobile browsers based on the current theme.
     * @param theme The current theme ('light' or 'dark').
     */
    private updateMetaThemeColor(theme: Theme): void {
        const themeColor = theme === 'dark' ? '#121212' : '#ffffff';
        let metaThemeColor = document.querySelector('meta[name="theme-color"]');

        if (!metaThemeColor) {
            metaThemeColor = document.createElement('meta');
            metaThemeColor.setAttribute('name', 'theme-color');
            document.head.appendChild(metaThemeColor);
        }

        metaThemeColor.setAttribute('content', themeColor);
    }

    /**
     * Toggles the application's theme between 'light' and 'dark'.
     */
    toggleTheme(): void {
        const newTheme = this.currentTheme() === 'light' ? 'dark' : 'light';
        this.setTheme(newTheme);
    }
}
