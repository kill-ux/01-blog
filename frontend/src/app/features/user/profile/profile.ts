import { Component, inject, Inject, Injector, OnInit, signal } from '@angular/core';
import { UserService } from '../services/user-service';
import { AuthState, User } from '../../auth/models/model';
import { AuthService } from '../../auth/services/auth-api';
import { ActivatedRoute } from '@angular/router';
import { Blogs } from "../../blog/pages/blogs/blogs";
import { DatePipe } from '@angular/common';
import { Discover } from "../discover/discover";

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
	constructor(private router: ActivatedRoute) { }

	public authService = inject(AuthService)

	ngOnInit() {
		this.router.params.subscribe(params => {
			const id = params["id"]
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
			this.subscribers.set([])
			this.currentComponent.set("subscribers")
			this.loadSubscribers(0)
		}
	}

	getSubscribtions() {
		if (this.currentComponent() != "subscribtions") {
			this.subscribtions.set([])
			this.currentComponent.set("subscribtions")
			this.loadSubscribtions(0)
		}
	}

	loadSubscribers(cursor: number) {
		if (this.isLoading) return
		this.isLoading = true
		let currentUser = this.userProfile();
		if (currentUser) {
			this.userService.getSubscribers(currentUser.id, cursor).subscribe({
				next: res => {
					console.log(res)
					this.subscribers.update(subs => [...subs, ...res])
					this.isLoading = false
				},
				error: err => {
					console.log(err)
					this.isLoading = false
				}
			})
		}
	}

	loadSubscribtions(cursor: number) {
		if (this.isLoading) return
		this.isLoading = true
		let currentUser = this.userProfile();
		if (currentUser) {
			this.userService.getSubscribtions(currentUser.id, cursor).subscribe({
				next: res => {
					console.log(res)
					this.subscribtions.update(subs => [...subs, ...res])
					this.isLoading = false
				},
				error: err => {
					console.log(err)
					this.isLoading = false
				}
			})
		}
	}
}
