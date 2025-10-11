import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthState } from '../../auth/models/model';

@Injectable({
    providedIn: 'root'
})
export class UserService {

    constructor(private http: HttpClient) { }
    getUsers() {
        return this.http.get<[]>("http://localhost:8080/api/users")
    }

    getProfile() {
        return this.http.get<AuthState>("http://localhost:8080/api/users/profile")
    }

    getUserById(userId: number) {
        return this.http.get<AuthState>("http://localhost:8080/api/users/profile?userId=" + userId)
    }

    subscribe(id: number) {
        return this.http.post<{ operation: string }>("http://localhost:8080/api/users/subscribe", { subscriberToId: id })
    }
}
