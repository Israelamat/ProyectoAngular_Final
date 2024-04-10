import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthServiceService } from '../auth/services/auth-service.service';
import { map } from 'rxjs';

export const loginActivateGuard: CanActivateFn = () => {
  const authservice = inject(AuthServiceService);
  const router = inject(Router);

  return authservice.isLogged().pipe(
    map((resp) => {
      if (resp) {
        return true;
      } else {
        return router.createUrlTree(['/auth/login']);
      }
    })
  );
};