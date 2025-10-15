import { Component, inject, Inject, Injector, OnInit, signal } from '@angular/core';
import { UserService } from '../services/user-service';
import { AuthState, User } from '../../auth/models/model';
import { AuthService } from '../../auth/services/auth-api';
import { ActivatedRoute } from '@angular/router';
import { Blogs } from "../../blog/pages/blogs/blogs";
import { DatePipe } from '@angular/common';
import { Discover } from "../discover/discover";
import { environment } from '../../../../environments/environment';

@Component({
	selector: 'app-profile',
	imports: [Blogs, DatePipe, Discover],
	templateUrl: './profile.html',
	styleUrl: './profile.css'
})
export class Profile implements OnInit {
	userProfile = signal<User | null>(null);
	subscribers = signal<User[]>([]);
	subscribtions = signal<User[]>([]);
	userService = inject(UserService);
	isLoading = false
	currentComponent = signal("blogs")

	apiUrl = environment.API_URL;

	constructor(private router: ActivatedRoute) { }

	public authService = inject(AuthService)

	ngOnInit() {
		this.router.params.subscribe(params => {
			const id = params["id"]
			this.currentComponent.set("blogs")
			this.loadProfile(id);
		})
	}

	loadProfile(id: number) {
		this.userService.getUserById(id).subscribe({
			next: (profile) => {
				this.userProfile.set(profile.user);
				console.log('User profile loaded', this.userProfile());
			},
			error: (error) => {
				console.error('Failed to load profile', error);
			}
		});
	}

	subscribe(id: any) {
		if (this.isLoading) return
		this.isLoading = true
		console.log(id)
		this.userService.subscribe(id).subscribe({
			next: res => {
				console.log(res)
				this.userProfile.update(user => {
					if (user && user.id == id) {
						user.sub = res.operation == "subscribed" ? true : false
						user.subscribers += user.sub ? 1 : -1
					}
					return user
				})
				console.log(this.userProfile())
				this.isLoading = false


			},
			error: err => {
				console.log(err)
				this.isLoading = false
			}
		})
	}

	getSubscribers() {
		if (this.currentComponent() != "subscribers") {
			this.currentComponent.set("subscribers")
		}
	}

	getSubscribtions() {
		if (this.currentComponent() != "subscribtions") {
			this.currentComponent.set("subscribtions")
		}
	}

	setSubscribtions(num: number) {
		let currentUser = this.userProfile();
		if (currentUser)
			currentUser.subscribtions += num
	}

	setSubscribers(num: number) {
		let currentUser = this.userProfile();
		if (currentUser)
			currentUser.subscribers += num
	}

	seeBlogs() {
		this.currentComponent.set("blogs")
	}

	uploadImage(event: Event) {
		const input = event.target as HTMLInputElement;
		if (input.files && input.files.length > 0) {
			const selectedFile = input.files[0]
			console.log(selectedFile)
			if (selectedFile.type.startsWith('image/')) {
				this.userService.updateProfile(selectedFile).subscribe({
					next: res => {
						console.log(res)
						if (this.authService.currentUser) {
							this.authService.currentUser.avatar = res.url
							this.userProfile.update(user => {
								if(user) {
									user.avatar = res.url
								}
								return user
							})
						}
					},
					error: err => {
						console.log(err)
					}
				})
			}
		}
	}
}
