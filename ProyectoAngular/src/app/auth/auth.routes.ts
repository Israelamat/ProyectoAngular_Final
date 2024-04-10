import { Routes } from '@angular/router';
import { logoutActivateGuard } from '../guards/logout-activate.guard';


export const loginRoutes: Routes = [
  {
    path: 'login',
    title: 'Login | Angular posts Login',
    canActivate: [logoutActivateGuard],
    loadComponent: () =>
      import('./post-login/post-login.component').then((m) => m.PostLoginComponent),
  },
  {
    path: 'register',
    title: 'Register ',
    canActivate: [logoutActivateGuard],
    loadComponent: () =>
      import('./post-register/post-register.component').then((m) => m.PostRegisterComponent),
  },
];
