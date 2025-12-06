import { Component, inject, OnInit, output } from '@angular/core';
import { AuthService } from '../../features/auth/services/auth-api';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { MatMenu, MatMenuModule } from '@angular/material/menu';
import { environment } from '../../../environments/environment';
import { ThemeToggle } from "../../Theme/theme-toggle/theme-toggle";
import { Notifications } from "../../features/user/notifications/notifications";

import {MatSidenavModule} from '@angular/material/sidenav';

/**
 * Component for the application's navigation bar.
 * Displays navigation links, user authentication status, theme toggle, and notifications.
 */
@Component({
	selector: 'app-navbar',
	imports: [RouterLink, MatMenu, MatMenuModule, ThemeToggle, Notifications, RouterLinkActive, MatSidenavModule],
	templateUrl: './navbar.html',
	styleUrl: './navbar.css'
})
export class Navbar {
	public authService = inject(AuthService)
	public router = inject(Router)
	opened = output<void>();
	
	apiUrl = environment.API_URL;

	/**
	 * Logs out the current user by calling the authentication service.
	 */
	logout() {
		this.authService.logout()
	}

	/**
	 * Navigates to the blog creation page.
	 */
	createBlog() {
		this.router.navigate(["create"])
	}

	/**
	 * Navigates to the admin dashboard.
	 */
	dashboard() {
		this.router.navigate(["dashboard"])
	}

	/**
	 * Emits an event to toggle the mobile menu.
	 */
	toggleMobileMenu(){
		this.opened.emit()
	}
}