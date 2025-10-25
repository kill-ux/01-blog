import { Injectable } from '@angular/core';
import SockJS from 'sockjs-client';
// Import the Client class
import { Client } from '@stomp/stompjs';
import { Notification } from '../../blog/model/model';

@Injectable({
	providedIn: 'root'
})
export class WebSocketApi {
	brokerURL: string = "http://localhost:8099/ws";
	// Type the client properly instead of using 'any'
	stompClient: Client;
	username: String = 'james';

	constructor() {
		// Initialize the client in the constructor
		this.stompClient = new Client({
			// Use a factory function for SockJS
			webSocketFactory: () => {
				return new SockJS(this.brokerURL);
			},
			// Set headers here
			connectHeaders: {
				"Authorization": "Bearer " + localStorage.getItem('token')
			},
			// Set log levels for debugging
			debug: (str) => {
				console.log(new Date(), str);
			},
			// Set reconnection delay
			reconnectDelay: 5000,
			// Heartbeat (optional but recommended)
			heartbeatIncoming: 4000,
			heartbeatOutgoing: 4000,

			// Set callbacks
			onConnect: (frame) => {
				console.log('Connected: ' + frame);
				// Subscribe upon connection
				this.stompClient.subscribe(`/user/${this.username}/queue/chat`, (message) => {
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
	}

	// Call this method from your component to start the connection
	connect() {
		this.stompClient.activate();
	}

	// Call this to disconnect
	disconnect() {
		this.stompClient.deactivate();
	}

	onMessageRecived(msg: any) {
		console.log("Message received: ", msg);
		const message = JSON.parse(msg);
		// ... do something with the message
	}

	send(message: Notification): void {
		// Check if client is active before sending
		if (this.stompClient.active) {
			this.stompClient.publish({
				destination: "/app/chat",
				body: JSON.stringify(message)
			});
		} else {
			console.error("Cannot send message, STOMP client is not active.");
		}
	}
}