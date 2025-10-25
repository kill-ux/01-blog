import { inject, Injectable } from '@angular/core';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import { Notification } from '../../blog/model/model'; // Assuming NotificationResponce is here
import { AuthService } from '../../auth/services/auth-api';
import { Subject } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class WebSocketApi {
	private authService = inject(AuthService);
	stompClient: Client | undefined;
	private notificationSubject = new Subject<Notification>();
	public notification$ = this.notificationSubject.asObservable();

	constructor() { }
	
	connect() {
		const currentUser = this.authService.currentUser;
		if (!currentUser) {
			console.error('Cannot connect to WebSocket, user is not logged in.');
			return;
		}

		if (this.stompClient?.active) {
			console.log('WebSocket client is already active.');
			return;
		}

		const token = localStorage.getItem('token');
		const username = currentUser.nickname;
		const brokerURL = `http://localhost:8080/ws?token=${token}`;


		this.stompClient = new Client({
			webSocketFactory: () => {
				return new SockJS(brokerURL);
			},
			connectHeaders: {
				"Authorization": "Bearer " + token
			},
			debug: (str) => {
				console.log(new Date(), str);
			},
			reconnectDelay: 5000,
			heartbeatIncoming: 4000,
			heartbeatOutgoing: 4000,

			onConnect: (frame) => {
				console.log('Connected: ' + frame);
				// Subscribe with the guaranteed username
				this.stompClient?.subscribe(`/user/${username}/queue/chat`, (message) => {
					this.onMessageRecived(message.body);
				});
			},
			onStompError: (frame) => {
				console.error('Broker reported error: ' + frame.headers['message']);
				console.error('Additional details: ' + frame.body);
			},
			onWebSocketError: (error) => {
				console.error('WebSocket Error: ', error);
			}
		});

		this.stompClient.activate();
	}

	disconnect() {
		this.stompClient?.deactivate();
	}

	onMessageRecived(msg: any) {
		console.log("Message received: ", msg);
		const message: Notification = JSON.parse(msg);

		this.notificationSubject.next(message);
	}
}