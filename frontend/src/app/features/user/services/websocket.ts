// websocket.service.ts - Following the Spring guide pattern
import { Injectable } from '@angular/core';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { BehaviorSubject, Observable } from 'rxjs';

export interface NotificationMessage {
	type: string;
	message: string;
	data: any;
}

@Injectable({
	providedIn: 'root'
})
export class WebsocketService {
	private stompClient: Client | null = null;
	private connected: boolean = false;

	private notificationSubject = new BehaviorSubject<NotificationMessage | null>(null);
	public notifications$ = this.notificationSubject.asObservable();

	constructor() {
		this.initializeConnection();
	}

	private initializeConnection(): void {
		// Create SockJS connection like in the Spring guide
		const socket = new SockJS('http://localhost:8080/ws');

		this.stompClient = new Client({
			webSocketFactory: () => socket,
			debug: (str) => {
				console.log('STOMP: ' + str);
			},
			reconnectDelay: 5000,
			heartbeatIncoming: 4000,
			heartbeatOutgoing: 4000,
		});

		this.stompClient.onConnect = (frame) => {
			console.log('✅ Connected: ' + frame);
			this.connected = true;
			if (this.stompClient) {
				// Subscribe to topics exactly like in the Spring guide
				this.stompClient.subscribe('/topic/notifications', (message) => {
					console.log('📢 Received from /topic/notifications:', message.body);
					this.handleMessage(message.body);
				});

				this.stompClient.subscribe('/user/queue/notifications', (message) => {
					console.log('👤 Received from /user/queue/notifications:', message.body);
					this.handleMessage(message.body);
				});
			}


		};

		this.stompClient.onStompError = (frame) => {
			console.error('❌ Broker error: ' + frame.headers['message']);
			console.error('Additional details: ' + frame.body);
		};

		this.stompClient.activate();
	}

	private handleMessage(messageBody: string): void {
		try {
			const notification: NotificationMessage = JSON.parse(messageBody);
			console.log('🎯 Parsed notification:', notification);
			this.notificationSubject.next(notification);
		} catch (e) {
			console.error('Error parsing message:', e);
		}
	}

	// Send message to server like in the Spring guide
	public sendNotification(message: NotificationMessage): void {
		if (this.stompClient && this.connected) {
			this.stompClient.publish({
				destination: '/app/notification',
				body: JSON.stringify(message)
			});
			console.log('📤 Sent message to /app/notification:', message);
		}
	}

	public disconnect(): void {
		if (this.stompClient) {
			this.stompClient.deactivate();
		}
	}
}