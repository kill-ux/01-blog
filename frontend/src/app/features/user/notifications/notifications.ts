import { Component, OnInit, signal } from '@angular/core';
import { UserService } from '../services/user-service';
import { Router } from '@angular/router';
import { MatMenuModule } from "@angular/material/menu";
import { NotificationResponce } from '../../blog/model/model';
import { TimeAgoPipe } from '../../../pipe/time-ago-pipe';
import { environment } from '../../../../environments/environment';
import { MatIcon } from '@angular/material/icon';
import { MatButtonModule } from "@angular/material/button";

@Component({
	selector: 'app-notifications',
	imports: [MatMenuModule, TimeAgoPipe, MatIcon, MatButtonModule],
	templateUrl: './notifications.html',
	styleUrl: './notifications.css'
})
export class Notifications implements OnInit {
	private isLoading = false;
	private cursor = 0;
	notfs = signal<NotificationResponce[]>([])

	apiUrl = environment.API_URL

	constructor(private userService: UserService, private router: Router) {

	}

	ngOnInit(): void {
		console.log("start")
		this.getNotifications()
	}

	getNotifications() {
		if (this.isLoading) return
		this.isLoading = true
		this.userService.getNotifications(this.cursor).subscribe({
			next: notfs => {
				console.log("nots => ", notfs)
				this.notfs.update(ns => [...ns, ...notfs])
			},
			error: err => {
				console.log(err)
			}
		})
	}

	navigateToPost(id: number) {
		this.router.navigate(["blog", id])
	}
}
