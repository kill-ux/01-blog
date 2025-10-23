import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { AuthService } from '../../features/auth/services/auth-api';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
    const authService = inject(AuthService);
    const router = inject(Router);
    const authToken = authService.getAuthToken();

    if (authToken) {
        req = req.clone({
            setHeaders: {
                Authorization: `Bearer ${authToken}`
            }
        })
    }

    return next(req).pipe(
        catchError(err => {
            if (err instanceof HttpErrorResponse) {
                if (err.status === 423) {
                    authService.logout()
                } else if (err.status === 403) {
                    if (authService.currentUser) {
                        authService.currentUser.role = "ROLE_USER"
                    }
                    router.navigate([""])
                }
            }
            return throwError(() => err)
        })
    );
};





