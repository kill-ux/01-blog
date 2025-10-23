import { Injectable } from '@angular/core';
import { Client } from '@stomp/stompjs'
import { BehaviorSubject, Observable } from 'rxjs';
import { Notifications } from '../notifications/notifications';

import SockJS  from 'sockjs-client';

@Injectable({
	providedIn: 'root'
})
export class Websocket {
	private stompClient: Client
	private notificationSubject = new BehaviorSubject<Notifications | null>(null)
	public notifications$: Observable<Notifications | null> = this.notificationSubject.asObservable();

	private connectedSubject = new BehaviorSubject<boolean>(false)
	public connected$: Observable<boolean> = this.connectedSubject.asObservable();

	constructor(){
		this.initializeWebSocketConnection()
	}

	private initializeWebSocketConnection() {
		const socket = SockJS('http://localhost:8080/ws')
	}

}
