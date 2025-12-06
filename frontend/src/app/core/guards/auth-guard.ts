import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../features/auth/services/auth-api';

/**
 * Guards routes that require authentication.
 * Redirects to signin page if user is not logged in.
 * @param route The activated route snapshot.
 * @param state The router state snapshot.
 * @returns True if user is authenticated, false otherwise.
 */
export const authGuard: CanActivateFn = (route, state) => {
	const authService = inject(AuthService)
	const router = inject(Router);
	console.log(authService.isLoggedIn())
	if (authService.isLoggedIn()) {
		return true
	}

	authService.removeAuthToken()
	router.navigate(["/auth/signin"])

	return false;
};
