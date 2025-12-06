import { Component, inject, input, OnDestroy, OnInit, signal } from '@angular/core';
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

/**
 * Component for displaying and managing user notifications.
 * Connects to a WebSocket for real-time notification updates.
 */
@Component({
	selector: 'app-notifications',
	imports: [MatMenuModule, TimeAgoPipe, MatButtonModule, MatBadgeModule],
	templateUrl: './notifications.html',
	styleUrl: './notifications.css'
})
export class Notifications implements OnInit, OnDestroy {
	private isLoading = false;
	private open = false;
	cursor = 0;
	notfs = signal<NotificationResponce | null>(null)
	mobile = input<boolean>()
	private notificationSubscription: Subscription | null = null;
	connectionStatus = signal<string>('disconnected');

	apiUrl = environment.API_URL
    authService = inject(AuthService)
    userService = inject(UserService)
    router = inject(Router)
    websocketService = inject(WebSocketApi)

	/**
	 * Initializes the component. Fetches initial notifications and sets up WebSocket listening.
	 */
	ngOnInit(): void {
		this.getNotifications()
		this.authService.currentUser$.pipe(first(user => !!user)).subscribe((user) => {
			if (user) {
				this.setupWebSocket();
			}
		})
	}

	/**
	 * Sets up the WebSocket connection and subscribes to real-time notification updates.
	 */
	private setupWebSocket(): void {
		console.log('🔧 Setting up WebSocket listener...');
		this.websocketService.connect()

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

	/**
	 * Cleans up the WebSocket subscription when the component is destroyed.
	 */
	ngOnDestroy(): void {
		if (this.notificationSubscription) {
			this.notificationSubscription.unsubscribe();
			this.websocketService.disconnect()
		}
	}

	/**
	 * Fetches notifications from the server with pagination.
	 */
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

	/**
	 * Loads more notifications if available and not currently loading.
	 */
	loadMoreNotifications() {
		if (this.cursor != 0) {
			this.getNotifications()
		}
	}

	/**
	 * Navigates to a blog post and marks the corresponding notification as read.
	 * @param id The ID of the blog post.
	 * @param idNot The ID of the notification.
	 */
	navigateToPost(id: number, idNot: number) {
		this.markRead(idNot)
		this.router.navigate(["blog", id])
	}

	/**
	 * Marks a single notification as read on the server and updates the local state.
	 * @param id The ID of the notification to mark as read.
	 */
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

	/**
	 * Marks all notifications as read on the server and updates the local state.
	 */
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

	/**
	 * Returns the text to display in the notification badge.
	 * Shows '+99' if the count exceeds 99.
	 * @returns The badge text.
	 */
	getBadgeText(): string {
		let count = this.notfs()?.count;
		if (!count) return '';
		return count < 100 ? count.toString() : '+99';
	}
}
