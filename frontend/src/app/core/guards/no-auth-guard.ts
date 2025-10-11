import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../features/auth/services/auth-api';

export const noAuthGuard: CanActivateFn = (route, state) => {
	const authService = inject(AuthService)
	const router = inject(Router);

	if (!authService.isLoggedIn()) {
		return true
	}

	router.navigate(["/"])
	return false;
};
