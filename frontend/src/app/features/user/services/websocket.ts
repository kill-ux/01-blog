import { inject, Injectable } from '@angular/core';
// import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import { Notification } from '../../blog/model/model'; // Assuming NotificationResponce is here
import { AuthService } from '../../auth/services/auth-api';
import { Subject } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class WebSocketApi {
	private authService = inject(AuthService);
	stompClient: Client;
	private notificationSubject = new Subject<Notification>();
	public notification$ = this.notificationSubject.asObservable();

	constructor() {

		const token = localStorage.getItem('token');
		const brokerURL = `http://localhost:8080/ws`;


		this.stompClient = new Client({
			brokerURL,
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
				this.stompClient.subscribe(`/user/queue/new-blog`, (message) => {
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