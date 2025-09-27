import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class AuthApi {
    private tokenKey: string = "token";

    constructor(private http: HttpClient) { }

    signin(credentials: { nickname: string, password: string }) {
        return this.http.post<{ token: string }>("http://localhost:8080/api/auth/login", credentials)
    }

    setAuthToken(token: string) {
        localStorage.setItem(this.tokenKey, token)
    }

    getAuthToken(): string | null {
        return localStorage.getItem(this.tokenKey)
    }
}
