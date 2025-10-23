import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../features/auth/services/auth-api';

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
