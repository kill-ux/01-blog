import { HttpInterceptorFn } from '@angular/common/http';
import { AuthService } from '../../features/auth/services/auth-api';
import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformServer } from '@angular/common';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
    const platformId = inject(PLATFORM_ID);

    if (isPlatformServer(platformId)) {
        return next(req);
    }

    const authService = inject(AuthService);
    const authToken = authService.getAuthToken();
    
    if (authToken) {
        req = req.clone({
            setHeaders: {
                Authorization: `Bearer ${authToken}`
            }
        })
    }
    return next(req);
};
