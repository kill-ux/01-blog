import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthState, User } from '../../auth/models/model';
import { BlogResponce } from '../../blog/model/model';

@Injectable({
    providedIn: 'root'
})
export class UserService {

    constructor(private http: HttpClient) { }

    getUsers(cursor: number) {
        return this.http.get<User[]>(`http://localhost:8080/api/users?cursor=${cursor}`)
    }

    getSubscribers(userId: number, cursor: number) {
        return this.http.get<User[]>(`http://localhost:8080/api/users/${userId}/subscribers?cursor=${cursor}`)
    }

    getSubscribtions(userId: number, cursor: number) {
        return this.http.get<User[]>(`http://localhost:8080/api/users/${userId}/subscribtions?cursor=${cursor}`)
    }

    getUserById(userId: any) {
        return this.http.get<AuthState>("http://localhost:8080/api/users/profile?userId=" + userId)
    }

    subscribe(id: number) {
        return this.http.post<{ operation: string }>("http://localhost:8080/api/users/subscribe", { subscriberToId: id })
    }

    getBlogsByUserId(userId: any) {
        return this.http.get<BlogResponce[]>(`http://localhost:8080/api/users/${userId}/blogs`)
    }
}
