import { Routes } from '@angular/router';


export const routes: Routes = [
   {
    path: 'posts',
    loadChildren: () =>
      import('./post/posts.routes').then((m) => m.postRoutes),
  },
  {
    path: 'auth',
    loadChildren: () =>
      import('./auth/auth.routes').then((m) => m.loginRoutes),
  },
  {
    path: 'profile',
    loadChildren: () =>
      import('./profile/profile.routes').then((m) => m.profileRoutes),
  },
  { path: '', redirectTo: '/auth/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/auth/login' },
  
];