import { Component, inject, OnInit, output } from '@angular/core';
import { AuthService } from '../../features/auth/services/auth-api';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { MatMenu, MatMenuModule } from '@angular/material/menu';
import { environment } from '../../../environments/environment';
import { ThemeToggle } from "../../Theme/theme-toggle/theme-toggle";
import { Notifications } from "../../features/user/notifications/notifications";

import {MatSidenavModule} from '@angular/material/sidenav';

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

	logout() {
		this.authService.logout()
	}

	createBlog() {
		this.router.navigate(["create"])
	}

	dashboard() {
		this.router.navigate(["dashboard"])
	}

	toggleMobileMenu(){
		this.opened.emit()
	}
}