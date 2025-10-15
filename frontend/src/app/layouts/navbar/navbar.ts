import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../../features/auth/services/auth-api';
import { RouterLink } from '@angular/router';
import { MatIcon } from '@angular/material/icon';
import { MatMenu, MatMenuModule } from '@angular/material/menu';
import { environment } from '../../../environments/environment';
import { UserService } from '../../features/user/services/user-service';

@Component({
	selector: 'app-navbar',
	imports: [RouterLink, MatMenu, MatMenuModule],
	templateUrl: './navbar.html',
	styleUrl: './navbar.css'
})
export class Navbar implements OnInit {
	public authService = inject(AuthService)
	public userService = inject(UserService)
	//  environment.API_URL
	apiUrl = environment.API_URL;

	ngOnInit(): void {
		this.userService.getUserById(this.authService.currentUser?.id).subscribe({
			next: data => {
				this.authService.currentUserSubject.next(data.user)
			}
		})
	}

	logout() {
		this.authService.logout()
	}

}