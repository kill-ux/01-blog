import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { AuthService } from '../../features/auth/services/auth-api';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
    const authService = inject(AuthService);
    const router = inject(Router);
    const authToken = authService.getAuthToken();
    const snackBar = inject(MatSnackBar);

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
                } else if (err.status == 429) {
                    snackBar.open('Too many requests. Please try again later.', "Close", {
                        duration: 2000,
                    });
                }
            }
            return throwError(() => err)
        })
    );
};





