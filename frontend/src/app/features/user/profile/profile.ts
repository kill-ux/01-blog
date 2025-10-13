import { Component, inject, Inject, Injector, OnInit } from '@angular/core';
import { UserService } from '../services/user-service';
import { AuthState, User } from '../../auth/models/model';
import { AuthService } from '../../auth/services/auth-api';
import { ActivatedRoute } from '@angular/router';
import { Blogs } from "../../blog/pages/blogs/blogs";
import { DatePipe } from '@angular/common';

@Component({
	selector: 'app-profile',
	imports: [Blogs, DatePipe],
	templateUrl: './profile.html',
	styleUrl: './profile.css'
})
export class Profile implements OnInit {
	userProfile: User | null = null;
	userService = inject(UserService);
	constructor(private router: ActivatedRoute) { }

	public authService = inject(AuthService)

	ngOnInit() {
		console.log(this.authService.currentUser)
		this.loadProfile();
	}

	loadProfile() {
		let id = this.router.snapshot.paramMap.get("id")
		this.userService.getUserById(id).subscribe({
			next: (profile) => {
				this.userProfile = profile.user;
				console.log('User profile loaded', this.userProfile);
			},
			error: (error) => {
				console.error('Failed to load profile', error);
			}
		});
	}

	subscribe(id: number) {
		this.userService.subscribe(id).subscribe({
			next: res => {
				console.log(res)
				if (this.users) {
					this.users.update(us => {
						return us?.map((user) => {
							if (user.id == id) {
								user.sub = res.operation == "subscribed" ? true : false
							}
							return user
						})
					})
				}

			},
			error: err => {
				console.log(err)
			}
		})
	}

}
