import { Component, inject, input, OnChanges, OnInit, output, signal, SimpleChanges } from '@angular/core';
import { UserService } from '../services/user-service';
import { User } from '../../auth/models/model';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/services/auth-api';
import { environment } from '../../../../environments/environment';

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
	setSubscribers = output<number>()
	cursor = 0

	apiUrl = environment.API_URL

	private isLoading = false;

	constructor(private userService: UserService, private router: Router) {

	}

	ngOnInit(): void {
		if (this.cursor == 0) {
			this.getUsers()
		}
	}



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
				console.log(users)
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

	subscribe(id: number) {
		this.userService.subscribe(id).subscribe({
			next: res => {
				console.log(res)
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
					if (this.sub() == "subscribtions" && this.user()?.id == this.authService.currentUser?.id) {
						// this.users.update(us => us.filter(user => user.sub))
						this.setSubscribtions.emit(res.operation == "subscribed" ? 1 : -1)
					}
				}

			},
			error: err => {
				console.log(err)
			}
		})
	}

	loadMoreBlogs() {
		if (!this.isLoading && this.cursor != 0) {
			this.getUsers()
		}
	}

	navigateUser(id: number) {
		this.router.navigate(['profile', id])
	}
}
