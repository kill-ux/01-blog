import { Component, input, OnInit, signal } from '@angular/core';
import { UserService } from '../services/user-service';
import { Router } from '@angular/router';
import { MatMenuModule } from "@angular/material/menu";
import { Notification, NotificationResponce } from '../../blog/model/model';
import { TimeAgoPipe } from '../../../pipe/time-ago-pipe';
import { environment } from '../../../../environments/environment';
import { MatButtonModule } from "@angular/material/button";
import { MatBadgeModule } from '@angular/material/badge'
import { first, Subscription } from 'rxjs';
import { WebSocketApi } from '../services/websocket';
import { AuthService } from '../../auth/services/auth-api';

@Component({
	selector: 'app-notifications',
	imports: [MatMenuModule, TimeAgoPipe, MatButtonModule, MatBadgeModule],
	templateUrl: './notifications.html',
	styleUrl: './notifications.css'
})
export class Notifications implements OnInit {
	private isLoading = false;
	private open = false;
	cursor = 0;
	notfs = signal<NotificationResponce | null>(null)
	mobile = input<boolean>()
	private notificationSubscription: Subscription | null = null;
	connectionStatus = signal<string>('disconnected');

	apiUrl = environment.API_URL


	constructor(private authService: AuthService, private userService: UserService, private router: Router, private websocketService: WebSocketApi) {

	}

	ngOnInit(): void {
		this.getNotifications()
		this.authService.currentUser$.pipe(first(user => !!user)).subscribe((user) => {
			if (user) {
				this.setupWebSocket();
			}
		})
	}

	private setupWebSocket(): void {
		console.log('🔧 Setting up WebSocket listener...');

		this.notificationSubscription = this.websocketService.notification$.subscribe(
			(newMessage: Notification) => {
				console.log('🎁 New notification received in component!', newMessage);

				this.notfs.update(currentNotfs => {
					const newNotfList = [newMessage, ...(currentNotfs?.notfs || [])];

					if (currentNotfs) {
						currentNotfs.notfs = newNotfList;
						currentNotfs.count += 1;
						return currentNotfs;
					} else {
						return {
							notfs: newNotfList,
							count: 1
						};
					}
				});
			}
		);
	}


	ngOnDestroy(): void {
		if (this.notificationSubscription) {
			this.notificationSubscription.unsubscribe();
		}
	}

	getNotifications() {
		if (this.isLoading) return
		this.isLoading = true
		this.userService.getNotifications(this.cursor).subscribe({
			next: notfs => {
				this.notfs.update(ns => {
					if (notfs.notfs.length > 0) {
						if (ns) {
							ns.notfs = [...ns.notfs, ...notfs.notfs]
						} else {
							ns = notfs
						}
						this.cursor = notfs.notfs[notfs.notfs.length - 1].id
					} else {
						this.cursor = 0
					}

					return ns
				})
				this.isLoading = false
			},
			error: err => {
				console.log(err)
				this.isLoading = false
			}
		})
	}

	loadMoreNotifications() {
		if (this.cursor != 0) {
			this.getNotifications()
		}
	}

	navigateToPost(id: number, idNot: number) {
		this.markRead(idNot)
		this.router.navigate(["blog", id])
	}

	markRead(id: number) {
		const ntfs = this.notfs()
		if (!ntfs || ntfs.count < 1) return
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
						notfs.count -= 1
					}
					return notfs
				})

			},
			error: err => {
				console.log(err)
			}
		})
	}

	markAll() {
		this.userService.markAll().subscribe({
			next: res => {
				this.notfs.update(notfs => {
					if (notfs) {
						notfs.notfs.map(not => not.read = true)
						notfs.count = 0
					}
					return notfs
				})
			}
		})
	}

	getBadgeText(): string {
		let count = this.notfs()?.count;
		if (!count) return '';
		return count < 100 ? count.toString() : '+99';
	}
}
