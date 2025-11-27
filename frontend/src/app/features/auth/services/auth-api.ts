
import { HttpClient } from '@angular/common/http';
import { inject, Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { AuthState, SigninCredentials, SignupCredentials, User } from '../models/model';
import { environment } from '../../../../environments/environment';
import { UserService } from '../../user/services/user-service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private tokenKey: string = "token";
    public apiUrl = environment.API_URL;

    public currentUserSubject = new BehaviorSubject<User | null>(null);
    public currentUser$ = this.currentUserSubject.asObservable();
    public snackBar = inject(MatSnackBar);
    private http = inject(HttpClient)
    private router = inject(Router)
    private userService = inject(UserService)

    initialize(): void {
        this.initializeUserFromToken();
    }

    signin(credentials: SigninCredentials) {
        return this.http.post<{ token: string }>(`${this.apiUrl}/auth/login`, credentials)
            .pipe(
                tap(response => {
                    this.setAuthToken(response.token);
                    this.setUserFromToken(response.token);
                })
            );
    }

    signup(credentials: SignupCredentials) {
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

    hasRole(role: string) {
        const user = this.currentUser;
        return user?.role == role || false;
    }

    // Private methods
    private initializeUserFromToken() {
        const token = this.getAuthToken();
        if (token && !this.isTokenExpired(token)) {
            const id = this.getUserIdFromToken(token)
            this.userService.getUserById(id).subscribe({
                next: data => {
                    this.currentUserSubject.next(data.user)
                },
                error: err => {
                    this.snackBar.open('Failed itialize user.', "Close", {
                        duration: 2000,
                    });
                }
            })

        }
    }

    private setUserFromToken(token: string) {
        try {
            const decoded: any = jwtDecode(token);
            const user: User = {
                id: decoded.id || decoded.sub,
                email: decoded.email,
                nickname: decoded.sub,
                avatar: decoded.avatar,
                role: decoded.role || 'ROLE_USER',
                bannedUntil: false,
                birthDate: null,
                createdAt: null,
                updatedAt: null,
                sub: false,
                subscribers: 0,
                subscribtions: 0
            };
            this.currentUserSubject.next(user);
        } catch (error) {
            console.log('Invalid token', error);
            this.removeAuthToken();
        }
    }

    private getUserIdFromToken(token: string) {
        try {
            const decoded: any = jwtDecode(token);
            return decoded.id
        } catch (error) {
            console.log('Invalid token', error);
            this.removeAuthToken();
        }
    }

    private isTokenExpired(token: string) {
        try {
            const decoded: any = jwtDecode(token);
            return Date.now() >= decoded.exp * 1000;
        } catch {
            return true;
        }
    }
}
