import { Routes } from '@angular/router';
import { loginActivateGuard } from '../guards/login-activate.guard';


export const profileRoutes: Routes = [
  {
    path: 'me',
    title: 'My profile | Angular posts',
    canActivate: [loginActivateGuard],
    loadComponent: () =>
      import('../profile/profile/post-profile.component').then(
        (m) => m.PostProfileComponent
      ),
  },
  {
    path: ':id',
    title: 'Profile | Angular posts',
    canActivate: [loginActivateGuard],
    loadComponent: () =>
      import('../profile/profile/post-profile.component').then(
        (m) => m.PostProfileComponent
      ),
  },
];
