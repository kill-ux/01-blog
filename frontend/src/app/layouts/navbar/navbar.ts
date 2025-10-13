import { Component, inject } from '@angular/core';
import { AuthService } from '../../features/auth/services/auth-api';
import { RouterLink } from '@angular/router';
import { MatIcon } from '@angular/material/icon';
import { MatMenu, MatMenuModule } from '@angular/material/menu';

@Component({
	selector: 'app-navbar',
	imports: [RouterLink, MatMenu, MatMenuModule],
	templateUrl: './navbar.html',
	styleUrl: './navbar.css'
})
export class Navbar {
	public authService = inject(AuthService)

	logout() {
		this.authService.logout()
	}

}