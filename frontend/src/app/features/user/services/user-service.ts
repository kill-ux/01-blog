import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthState, User } from '../../auth/models/model';
import { BlogResponce, Notification, NotificationResponce } from '../../blog/model/model';
import { environment } from '../../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class UserService {

    constructor(private http: HttpClient) { }
    private apiUrl = environment.API_URL

    getUsers(cursor: number) {
        return this.http.get<User[]>(`${this.apiUrl}/users?cursor=${cursor}`)
    }

    getSubscribers(userId: number, cursor: number) {
        return this.http.get<User[]>(`${this.apiUrl}/users/${userId}/subscribers?cursor=${cursor}`)
    }

    getSubscribtions(userId: number, cursor: number) {
        return this.http.get<User[]>(`${this.apiUrl}/users/${userId}/subscribtions?cursor=${cursor}`)
    }

    getUserById(userId: any) {
        console.log("decoded => ", userId)
        return this.http.get<AuthState>(`${this.apiUrl}/users/profile?userId=${userId}`)
    }

    subscribe(id: number) {
        return this.http.post<{ operation: string }>(`${this.apiUrl}/users/subscribe`, { subscriberToId: id })
    }

    getBlogsByUserId(userId: any) {
        return this.http.get<BlogResponce[]>(`${this.apiUrl}/users/${userId}/blogs`)
    }

    updateProfile(file: File) {
        const formData = new FormData();
        formData.append('file', file)
        return this.http.patch<{ url: string }>(`${this.apiUrl}/users/updateprofile`, formData)
    }

    getNotifications(cursor: number) {
        return this.http.get<NotificationResponce>(`${this.apiUrl}/users/notification?cursor=${cursor}`)
    }

    markRead(id: number) {
        return this.http.patch<Notification>(`${this.apiUrl}/users/notification/${id}/review`, {})
    }

    markAll() {
        return this.http.patch<Notification>(`${this.apiUrl}/users/notification/markall`, {})
    }


}
