import { Component, OnInit, signal } from '@angular/core';
import { UserService } from '../services/user-service';
import { User } from '../../auth/models/model';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';

@Component({
	selector: 'app-discover',
	imports: [DatePipe],
	templateUrl: './discover.html',
	styleUrl: './discover.css'
})
export class Discover implements OnInit {
	users = signal<User[]>([])
	lastUser = 0
	pageNumber = 0;

	private isLoading = false;

	constructor(private userService: UserService, private router: Router) {

	}
	ngOnInit(): void {
		this.getUsers(this.pageNumber)
	}



	getUsers(pageNumber: number) {
		if (this.isLoading) return;
		this.isLoading = true;
		this.userService.getUsers(pageNumber).subscribe({
			next: users => {
				console.log(users)
				if (users) {
					this.lastUser = users[users.length - 1].id
					this.users.update(us => [...us, ...users])
					// this.users = [...this.users, ...users]
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

	loadMoreBlogs() {
		if (!this.isLoading) {
			this.getUsers(++this.pageNumber)
		}
	}

	navigateUser(id: number) {
		this.router.navigate(['profile', id])
	}
}
