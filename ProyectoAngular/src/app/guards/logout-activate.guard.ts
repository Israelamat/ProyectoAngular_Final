import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map } from 'rxjs';
import { AuthServiceService } from '../auth/services/auth-service.service';

export const logoutActivateGuard: CanActivateFn = () => {
  const authservice = inject(AuthServiceService);
  const router = inject(Router);

  return authservice.isLogged().pipe(
    map((resp) => {
      if (resp) {
        return router.createUrlTree(['/posts']);
      } else {
        return true;
      }
    })
  );
};