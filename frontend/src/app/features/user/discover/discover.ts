import { Component, inject, input, OnChanges, OnInit, output, signal, SimpleChanges } from '@angular/core';
import { UserService } from '../services/user-service';
import { User } from '../../auth/models/model';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/services/auth-api';
import { environment } from '../../../../environments/environment';
import { MatSnackBar } from '@angular/material/snack-bar';

/**
 * Component for discovering and interacting with other users.
 * Allows viewing lists of users, subscribers, and subscriptions, and managing subscriptions.
 */
@Component({
	selector: 'app-discover',
	imports: [DatePipe],
	templateUrl: './discover.html',
	styleUrl: './discover.css'
})
export class Discover implements OnInit {
	users = signal<User[]>([])
	user = input<User | null>();
	authService = inject(AuthService);
	sub = input();
	setSubscribtions = output<number>()
	// setSubscribers = output<number>()
	cursor = 0
	snackBar = inject(MatSnackBar)
    userService = inject(UserService)
    router = inject(Router)

	apiUrl = environment.API_URL

	private isLoading = false;

	/**
	 * Initializes the component and loads initial user data.
	 */
	ngOnInit(): void {
		if (this.cursor == 0) {
			this.getUsers()
		}
	}


	/**
	 * Fetches a list of users, subscribers, or subscriptions based on component inputs.
	 * Supports pagination.
	 */
	getUsers() {
		if (this.isLoading) return;
		this.isLoading = true;
		let currentUser = this.user();
		let obs
		if (currentUser) {
			if (this.sub() == "subscribers") {
				obs = this.userService.getSubscribers(currentUser.id, this.cursor)
			} else {
				obs = this.userService.getSubscribtions(currentUser.id, this.cursor)
			}
		} else {
			obs = this.userService.getUsers(this.cursor)
		}

		obs.subscribe({
			next: users => {
				if (users.length > 0) {
					this.cursor = users[users.length - 1].id
					this.users.update(us => [...us, ...users])
				} else {
					this.cursor = 0
				}
				this.isLoading = false
			},
			error: err => {
				console.log(err);
				this.isLoading = false
			}
		})
	}

	/**
	 * Subscribes to or unsubscribes from a user.
	 * Updates the local state and emits a change for subscriptions.
	 * @param id The ID of the user to subscribe to/unsubscribe from.
	 */
	subscribe(id: number) {
		this.userService.subscribe(id).subscribe({
			next: res => {
				if (this.users) {
					this.users.update(us => {
						return us?.map((user) => {
							if (user.id == id) {
								user.sub = res.operation == "subscribed" ? true : false
								user.subscribers += res.operation == "subscribed" ? 1 : -1
							}
							return user
						})
					})
                    // this.sub() == "subscribtions" &&
					if ( this.user()?.id == this.authService.currentUser?.id) {
                        console.log("emitting subscribtions change")
						// this.users.update(us => us.filter(user => user.sub))
						this.setSubscribtions.emit(res.operation == "subscribed" ? 1 : -1)
					}
					this.snackBar.open(`Operation succeced: ${res.operation}`, "Close", {
						duration: 2000,
					});
				}

			},
			error: err => {
				console.log(err)
			}
		})
	}

	/**
	 * Loads more users if not currently loading and more users are available.
	 */
	loadMoreBlogs() {
		if (!this.isLoading && this.cursor != 0) {
			this.getUsers()
		}
	}

	/**
	 * Navigates to the profile page of a specific user.
	 * @param id The ID of the user to navigate to.
	 */
	navigateUser(id: number) {
		this.router.navigate(['profile', id])
	}
}
