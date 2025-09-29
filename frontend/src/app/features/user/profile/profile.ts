import { Component, inject, Inject, Injector, OnInit } from '@angular/core';
import { UserService } from '../services/user-service';
import { AuthState } from '../../auth/models/model';

@Component({
	selector: 'app-profile',
	imports: [],
	templateUrl: './profile.html',
	styleUrl: './profile.css'
})
export class Profile implements OnInit {
	userProfile: AuthState | null = null;
	userService = inject(UserService);

	ngOnInit() {
		this.loadProfile();
	}

	loadProfile() {
		// console.log(typeof window == 'undefined');
		this.userService.getProfile().subscribe({
			next: (profile) => {
				this.userProfile = profile;
				console.log('User profile loaded', this.userProfile);
			},
			error: (error) => {
				console.error('Failed to load profile', error);
			}
		});
	}

}
