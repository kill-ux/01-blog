import { inject, Injectable } from '@angular/core';
// import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import { Notification } from '../../blog/model/model';
import { Subject } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
	providedIn: 'root'
})
export class WebSocketApi {
	stompClient: Client | null = null;
	private notificationSubject = new Subject<Notification>();
	public notification$ = this.notificationSubject.asObservable();
	API_URL = environment.API_URL
	WS_URL = environment.WS_URL

	public connect() {
		const token = localStorage.getItem('token');
		const brokerURL = this.WS_URL;

		this.stompClient = new Client({
			brokerURL,
			beforeConnect: () => {
				if (token) {
					this.stompClient!.connectHeaders = {
						Authorization: `Bearer ${token}`
					};
				}
			},
			reconnectDelay: 3000,
			heartbeatIncoming: 4000,
			heartbeatOutgoing: 4000,

			onConnect: (frame) => {
				console.log('Connected: ');
				this.stompClient!.subscribe(`/user/queue/new-blog`, (message) => {
					this.onMessageRecived(message.body);
				});
			},
			onStompError: (frame) => {
				console.log('Broker reported error: ' + frame.headers['message']);
				console.log('Additional details: ' + frame.body);
			},
			onWebSocketError: (error) => {
				console.log('WebSocket Error: ', error);
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
