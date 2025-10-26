import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../../features/auth/services/auth-api';

export const adminGuard: CanActivateFn = (route, state) => {
	return true;
};
