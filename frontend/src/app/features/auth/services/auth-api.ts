
import { HttpClient } from '@angular/common/http';
import { inject, Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { AuthState, SigninCredentials, SignupCredentials, User } from '../models/model';
import { environment } from '../../../../environments/environment';
import { UserService } from '../../user/services/user-service';
import { MatSnackBar } from '@angular/material/snack-bar';

/**
 * Service for handling user authentication and authorization.
 * Manages user login, logout, token management, and user session.
 */
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

    /**
     * Initializes the authentication service by attempting to load user data from a stored token.
     */
    initialize(): void {
        this.initializeUserFromToken();
    }

    /**
     * Sends sign-in credentials to the API and handles the authentication token.
     * @param credentials User's sign-in credentials (nickname and password).
     * @returns An observable that emits when the sign-in process is complete.
     */
    signin(credentials: SigninCredentials) {
        return this.http.post<{ token: string }>(`${this.apiUrl}/auth/login`, credentials)
            .pipe(
                tap(response => {
                    this.setAuthToken(response.token);
                    this.setUserFromToken(response.token);
                })
            );
    }

    /**
     * Sends sign-up credentials to the API to create a new user account.
     * @param credentials User's sign-up credentials (nickname, email, and password).
     * @returns An observable that emits the authentication state after successful sign-up.
     */
    signup(credentials: SignupCredentials) {
        return this.http.post<AuthState>(`${this.apiUrl}/auth/signup`, credentials);
    }

    /**
     * Stores the authentication token in local storage.
     * @param token The JWT authentication token.
     */
    setAuthToken(token: string) {
        localStorage.setItem(this.tokenKey, token);
    }

    /**
     * Retrieves the authentication token from local storage.
     * @returns The JWT authentication token, or null if not found.
     */
    getAuthToken(): string | null {
        return localStorage.getItem(this.tokenKey);
    }

    /**
     * Removes the authentication token from local storage.
     */
    removeAuthToken() {
        localStorage.removeItem(this.tokenKey);
    }

    /**
     * Logs out the current user, removes their token, clears user data, and navigates to the sign-in page.
     */
    logout(): void {
        this.removeAuthToken();
        this.currentUserSubject.next(null);
        this.router.navigate(['/auth/signin']);
    }

    /**
     * Checks if the user is currently logged in and their token is valid.
     * @returns True if the user is logged in and the token is not expired, false otherwise.
     */
    isLoggedIn(): boolean {
        const token = this.getAuthToken();
        return !!token && !this.isTokenExpired(token);
    }

    /**
     * Gets the current authenticated user.
     * @returns The current user object or null.
     */
    get currentUser(): User | null {
        return this.currentUserSubject.value;
    }

    /**
     * Gets the ID of the current authenticated user.
     * @returns The user's ID or null if not authenticated.
     */
    getUserId(): number | null {
        return this.currentUser?.id || null;
    }

    /**
     * Checks if the current user has administrator privileges.
     * @returns True if the user is an admin, false otherwise.
     */
    isAdmin(): boolean {
        return this.hasRole('ROLE_ADMIN');
    }

    /**
     * Checks if the current user has a specific role.
     * @param role The role to check against (e.g., 'ROLE_ADMIN', 'ROLE_USER').
     * @returns True if the user has the specified role, false otherwise.
     */
    hasRole(role: string) {
        const user = this.currentUser;
        return user?.role == role || false;
    }

    // Private methods
    /**
     * Initializes the current user by decoding the authentication token and fetching user details.
     * If the token is valid and not expired, it fetches the full user profile.
     */
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

    /**
     * Sets the current user information from a JWT token.
     * @param token The JWT authentication token.
     */
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

    /**
     * Extracts the user ID from a JWT token.
     * @param token The JWT authentication token.
     * @returns The user ID or undefined if the token is invalid.
     */
    private getUserIdFromToken(token: string) {
        try {
            const decoded: any = jwtDecode(token);
            return decoded.id
        } catch (error) {
            console.log('Invalid token', error);
            this.removeAuthToken();
        }
    }

    /**
     * Checks if a JWT token has expired.
     * @param token The JWT authentication token.
     * @returns True if the token is expired, false otherwise.
     */
    private isTokenExpired(token: string) {
        try {
            const decoded: any = jwtDecode(token);
            return Date.now() >= decoded.exp * 1000;
        } catch {
            return true;
        }
    }
}
