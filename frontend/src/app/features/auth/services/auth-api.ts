import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private tokenKey: string = "token";

    constructor(private http: HttpClient, @Inject(PLATFORM_ID) private platformId: any) { }

    signin(credentials: { nickname: string, password: string }) {
        return this.http.post<{ token: string }>("http://localhost:8080/api/auth/login", credentials)
    }

    signup(credentials: { nickname: string, email: string, password: string }) {
        return this.http.post<{}>("http://localhost:8080/api/auth/signup", credentials)
    }

    setAuthToken(token: string) {
        if (isPlatformBrowser(this.platformId)) {
            localStorage.setItem(this.tokenKey, token)
        }
    }

    getAuthToken(): string | null {
        if (isPlatformBrowser(this.platformId)) {
            return localStorage.getItem(this.tokenKey)
        }
        return null
    }

    removeAuthToken() {
        if (isPlatformBrowser(this.platformId)) {
            localStorage.removeItem(this.tokenKey);
        }
    }
}

