
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { AuthState, SigninCredentials, SignupCredentials, User } from '../models/model';
import { environment } from '../../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private tokenKey: string = "token";
    public apiUrl;

    public currentUserSubject = new BehaviorSubject<User | null>(null);
    public currentUser$ = this.currentUserSubject.asObservable();

    constructor(
        private http: HttpClient,
        @Inject(PLATFORM_ID) private platformId: any,
        private router: Router
    ) {
        this.initializeUserFromToken();

        // this.apiUrl = environment.apiUrl
        console.log("environment => ", environment.API_URL);

        this.apiUrl = 'http://localhost:8080/api'
    }

    signin(credentials: SigninCredentials): Observable<{ token: string }> {
        return this.http.post<{ token: string }>(`${this.apiUrl}/auth/login`, credentials)
            .pipe(
                tap(response => {
                    this.setAuthToken(response.token);
                    this.setUserFromToken(response.token);
                    console.log(this.currentUserSubject)
                })
            );
    }

    signup(credentials: SignupCredentials): Observable<AuthState> {
        return this.http.post<AuthState>(`${this.apiUrl}/auth/signup`, credentials);
    }

    setAuthToken(token: string) {
        localStorage.setItem(this.tokenKey, token);
    }

    getAuthToken(): string | null {
        return localStorage.getItem(this.tokenKey);
    }

    removeAuthToken() {
        localStorage.removeItem(this.tokenKey);
    }

    logout(): void {
        this.removeAuthToken();
        this.currentUserSubject.next(null);
        this.router.navigate(['/auth/signin']);
    }

    isLoggedIn(): boolean {
        const token = this.getAuthToken();
        return !!token && !this.isTokenExpired(token);
    }

    get currentUser(): User | null {
        return this.currentUserSubject.value;
    }

    getUserId(): number | null {
        return this.currentUser?.id || null;
    }

    isAdmin(): boolean {
        return this.hasRole('ROLE_ADMIN');
    }

    hasRole(role: string): boolean {
        const user = this.currentUser;
        return user?.role == role || false;
    }

    // Private methods
    private initializeUserFromToken(): void {
        const token = this.getAuthToken();
        if (token && !this.isTokenExpired(token)) {
            this.setUserFromToken(token);
        }
    }

    private setUserFromToken(token: string): void {
        try {
            const decoded: any = jwtDecode(token);
            const user: User = {
                id: decoded.id || decoded.sub,
                email: decoded.email,
                nickname: decoded.sub,
                avatar: decoded.avatar,
                role: decoded.role || 'ROLE_USER',
                bannedUntil: null,
                birthDate: null,
                createdAt: null,
                updatedAt: null,
                sub: false,
                subscribers: 0,
                subscribtions: 0
            };
            this.currentUserSubject.next(user);
        } catch (error) {
            console.error('Invalid token', error);
            this.removeAuthToken();
        }
    }

    private isTokenExpired(token: string): boolean {
        try {
            const decoded: any = jwtDecode(token);
            return Date.now() >= decoded.exp * 1000;
        } catch {
            return true;
        }
    }
}