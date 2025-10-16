import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user-service';
import { Router } from '@angular/router';

@Component({
	selector: 'app-notifications',
	imports: [],
	templateUrl: './notifications.html',
	styleUrl: './notifications.css'
})
export class Notifications implements OnInit {
	private isLoading = false;

	constructor(private userService: UserService, private router: Router) {

	}

	ngOnInit(): void {
		if (this.cursor == 0) {
			this.userService.getNotifications()
		}
	}

	getNotifications() {
		
	}
}
