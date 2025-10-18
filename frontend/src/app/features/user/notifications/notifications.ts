import { Component, OnInit, signal } from '@angular/core';
import { UserService } from '../services/user-service';
import { Router } from '@angular/router';
import { MatMenuModule } from "@angular/material/menu";
import { NotificationResponce } from '../../blog/model/model';
import { TimeAgoPipe } from '../../../pipe/time-ago-pipe';
import { environment } from '../../../../environments/environment';
import { MatIcon } from '@angular/material/icon';
import { MatButtonModule } from "@angular/material/button";
import { MatBadgeModule } from '@angular/material/badge'

@Component({
	selector: 'app-notifications',
	imports: [MatMenuModule, TimeAgoPipe, MatButtonModule, MatBadgeModule],
	templateUrl: './notifications.html',
	styleUrl: './notifications.css'
})
export class Notifications implements OnInit {
	private isLoading = false;
	private cursor = 0;
	notfs = signal<NotificationResponce | null>(null)

	apiUrl = environment.API_URL

	constructor(private userService: UserService, private router: Router) {

	}

	ngOnInit(): void {
		this.getNotifications()
	}

	getNotifications() {
		if (this.isLoading) return
		this.isLoading = true
		this.userService.getNotifications(this.cursor).subscribe({
			next: notfs => {
				this.notfs.update(ns => {
					if (ns) {
						ns.notfs = [...ns.notfs, ...notfs.notfs]
					} else {
						ns = notfs
					}
					return ns
				})
				console.log("nots => ", this.notfs())
			},
			error: err => {
				console.log(err)
			}
		})
	}

	navigateToPost(id: number) {
		this.router.navigate(["blog", id])
	}

	markRead(id: number) {
		console.log(id)
		this.userService.markRead(id).subscribe({
			next: response => {
				this.notfs.update(notfs => {
					if (notfs) {
						notfs.notfs.map(not => {
							if (not.id == id) {
								not.read = true
							}
							return not
						})
					}
					return notfs
				})

			},
			error: err => {
				console.log(err)
			}
		})
	}
}
