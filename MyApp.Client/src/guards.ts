import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from './services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  if (authService.signedIn()) {
    return true;
  }
  
  // Store the attempted URL for redirecting after login
  const redirect = state.url;
  
  // Navigate to the login page with extras
  router.navigate(['/signin'], { 
    queryParams: { redirect }
  });
  
  return false;
};
