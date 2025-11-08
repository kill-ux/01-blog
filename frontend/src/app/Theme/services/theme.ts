import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";

export type Theme = 'light' | 'dark';

const prismThemeLink = document.getElementById('prismTheme');

const themesCode = {
  light: 'https://cdn.jsdelivr.net/npm/prismjs@1.29.0/themes/prism-coy.css',
  dark: 'https://cdn.jsdelivr.net/npm/prismjs@1.29.0/themes/prism-funky.css'
};


@Injectable({
    providedIn: 'root'
})
export class ThemeService {
    private currentThemeSubject: BehaviorSubject<Theme>;
    public currentTheme$: Observable<Theme>;

    constructor() {
        this.currentThemeSubject = new BehaviorSubject<Theme>('light')
        this.currentTheme$ = this.currentThemeSubject.asObservable()
        this.initializeTheme()
    }

    initializeTheme() {
        const savedTheme = localStorage.getItem('theme') as Theme;
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
        const initialTheme = savedTheme || (systemPrefersDark ? 'dark' : 'light')

        this.setTheme(initialTheme)
        this.watchSystemTheme();
    }

    setTheme(theme: Theme) {
        this.currentThemeSubject.next(theme)
        this.applyTheme(theme);

        // if (theme === 'light') {
        //     localStorage.removeItem('theme'); // Remove to use system preference
        // } else {
        localStorage.setItem('theme', theme);
        // }
    }

    watchSystemTheme() {
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener("change", (e) => {
            if (!localStorage.getItem('theme')) {
                const newTheme = e.matches ? 'dark' : 'light';
                this.setTheme(newTheme);
            }
        })
    }

    applyTheme(theme: Theme) {
        document.documentElement.setAttribute('data-theme', theme)
        document.documentElement.classList.remove('light-theme', 'dark-theme');
        document.documentElement.classList.add(`${theme}-theme`);
        prismThemeLink?.setAttribute('href', themesCode[theme]);

        // Update meta theme-color for mobile browsers
        this.updateMetaThemeColor(theme);
    }

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

    toggleTheme(): void {
        const newTheme = this.currentThemeSubject.value === 'light' ? 'dark' : 'light';
        this.setTheme(newTheme);
    }

    getCurrentTheme(): Theme {
        return this.currentThemeSubject.value;
    }
}
