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
			error : err => {
				console.log(err);
				
			}
		})
	}
}
