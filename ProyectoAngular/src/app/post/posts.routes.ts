import { Routes } from '@angular/router';
import { leavePageGuard } from '../guards/leave-page.guard';
import { numericIdGuard } from '../guards/numeric-id.guard';
import { postResolver } from './resolvers/post.resolver';
import { loginActivateGuard } from '../guards/login-activate.guard';

export const postRoutes: Routes = [
  {
    path: '',
    title: 'Posts | Angular posts',
    canActivate: [loginActivateGuard],
    loadComponent: () =>
      import('./posts-page/posts-page.component').then(
        (m) => m.PostsPageComponent
      ),
  },
  {
    path: 'add',
    title: 'New posts | Angular products',
    canActivate: [loginActivateGuard],
    canDeactivate: [leavePageGuard],
    loadComponent: () =>
      import('./post-form/post-form.component').then(
        (m) => m.PostFormComponent
      ),
  },
  {
    path: 'profile',
    title: 'Profile | Angular posts',
    canActivate: [loginActivateGuard,loginActivateGuard],

    loadComponent: () =>
      import('../profile/profile/post-profile.component').then(
        (m) => m.PostProfileComponent
      ),
  },
  {
    path: ':id',
    canActivate: [numericIdGuard,loginActivateGuard],
    resolve: {
      post: postResolver,
    },
    loadComponent: () =>
      import('./post-detalle/post-detalle.component').then(
        (m) => m.PostDetalleComponent
      ),
  },
  {
    path: ':id/edit',
    canActivate: [numericIdGuard,loginActivateGuard],
    resolve: {
      post: postResolver,
    },
    loadComponent: () =>
      import('./post-form/post-form.component').then(
        (m) => m.PostFormComponent
      ),
  }
];