import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../features/auth/services/auth-api';

export const authGuard: CanActivateFn = (route, state) => {
  console.log("Hello")
  const authService = inject(AuthService)
  const router = inject(Router);

  if (authService.isLoggedIn()) {
    return true
  }


  router.navigate(["/auth/signin"], {
    queryParams: { returnUrl: state.url }
  })

  return false;
};
