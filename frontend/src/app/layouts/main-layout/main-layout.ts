import { Component } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Navbar } from "../navbar/navbar";
import { AuthService } from '../../features/auth/services/auth-api';


import { MatIcon, MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatMenuModule } from "@angular/material/menu";
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';


import { MatListModule } from '@angular/material/list';
import { MatExpansionModule } from '@angular/material/expansion';
import { CommonModule } from '@angular/common';


declare var Prism: any;

/**
 * Component for the main application layout.
 * This component provides a common layout including navigation, sidebar, and handles authentication state.
 */
@Component({
    selector: 'app-main-layout',
    imports: [RouterOutlet, MatToolbarModule, Navbar, CommonModule, RouterLink,
        MatIcon,
        MatSidenavModule,
        MatToolbarModule,
        MatListModule,
        MatIconModule,
        MatButtonModule,
        MatMenuModule,
        MatDividerModule,
        MatExpansionModule
    ],
    templateUrl: './main-layout.html',
    styleUrl: './main-layout.css'
})
export class MainLayout {
    isLoggedIn = false;
    currentUser: any;
    opened = false

    /**
     * Constructs the MainLayout component.
     * @param router The Angular Router service for navigation.
     * @param authService The authentication service for managing user sessions.
     */
    constructor(
        private router: Router,
        private authService: AuthService
    ) {
    }

    /**
     * Initializes the component.
     * Calls authService.initialize() to set up authentication and highlights code blocks if Prism is available.
     */
    ngOnInit() {
        this.authService.initialize()
        setTimeout(() => {
            if (Prism && Prism.plugins.autoloader) {
                Prism.plugins.autoloader.languages_path = 'https://cdn.jsdelivr.net/npm/prismjs@1.29.0/components/';
                Prism.highlightAll(); // Re-highlight all code blocks
            }
        }, 0);
    }

    /**
     * Logs out the current user by calling the authentication service's logout method.
     */
    logout() {
        this.authService.logout()
    }
}
