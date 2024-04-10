import { ResolveFn, Router } from '@angular/router';
import { Post } from '../../interfaces/post';
import { inject } from '@angular/core';
import { catchError, EMPTY } from 'rxjs';
import { PostsServiceService } from '../services/posts-service.service';

export const postResolver: ResolveFn<Post> = (route) => {
  return inject(PostsServiceService)
    .getPost(+route.params['id'])
    .pipe(
      catchError(() => {
        inject(Router).navigate(['/posts']);
        return EMPTY;
      })
    );
};
