import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user-service';
import { User } from '../../auth/models/model';
import { DatePipe } from '@angular/common';

@Component({
	selector: 'app-discover',
	imports: [DatePipe],
	templateUrl: './discover.html',
	styleUrl: './discover.css'
})
export class Discover implements OnInit {
	users: User[] | null = null
	constructor(private userService: UserService) {

	}
	ngOnInit(): void {
		this.userService.getUsers().subscribe({
			next: users => {
				console.log(users)
				this.users = users
			},
			error: err => {
				console.log(err);

			}
		})
	}

	subscribe(id: number) {
		this.userService.subscribe(id).subscribe({
			next: res => {
				this.users?.map((user) => {
					if (user.id == id) {
						user.sub = res.operation == "subscribed" ? true : false
					}
				})
				let user = this.users?.find(u => u.id = id)
				console.log(user?.sub)
				// if (user) {
				// 	user.sub = res.operation == "subscribed" ? true : false
				// }
				console.log(res)
			},
			error: err => {
				console.log(err)
			}
		})
	}
}
