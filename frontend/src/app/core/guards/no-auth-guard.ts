import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../features/auth/services/auth-api';

/**
 * Guards routes that require no authentication.
 * Redirects to home page if user is already logged in.
 * @param route The activated route snapshot.
 * @param state The router state snapshot.
 * @returns True if user is not authenticated, false otherwise.
 */
export const noAuthGuard: CanActivateFn = (route, state) => {
	const authService = inject(AuthService)
	const router = inject(Router);

	if (!authService.isLoggedIn()) {
		return true
	}

	router.navigate(["/"])
	return false;
};
