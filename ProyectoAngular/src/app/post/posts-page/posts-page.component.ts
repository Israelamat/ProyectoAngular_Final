import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Post } from '../../interfaces/post';
import { FormsModule } from '@angular/forms';
import { PostFormComponent } from '../post-form/post-form.component';
import { PostCardComponent } from '../post-card/post-card.component';
import { PostFilterPipe } from '../pipes/post-filter.pipe';
import { PostsServiceService } from '../services/posts-service.service';
import { Users } from '../../auth/interfaces/users';
import { ActivatedRoute } from '@angular/router';
import { ServicesProfileService } from '../../profile/services/services-profile.service';

@Component({
  selector: 'posts-page',
  standalone: true,
  templateUrl: './posts-page.component.html',
  styleUrl: './posts-page.component.css',
  imports: [
    CommonModule,
    FormsModule,
    PostFormComponent,
    PostCardComponent,
    PostFilterPipe,
  ],
})
export class PostsPageComponent implements OnInit {
  publicaciones: Post[] = [];
  search = '';
  #postsService = inject(PostsServiceService);
  #profileService = inject(ServicesProfileService);
  user!: Users | null;
  id!: number;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      if (params['creator']) {
        this.id = params['creator'];

        this.#profileService.getProfile(this.id).subscribe({
          next: (user) => {
            this.user = user.user;
          },
          error: (error) => console.error(error),
        });

        this.#postsService.getUserPosts(this.id).subscribe({
          next: (publicaciones) => {
            this.publicaciones = publicaciones;
          },
          error: (error) => console.error(error),
        });

      } else {
        this.user=null;

        this.#postsService.getPosts().subscribe({
          next: (publicaciones) => {
            this.publicaciones = publicaciones;
          },
          error: (error) => console.error(error),
        });
      }
    });
  }

  deletePost(post: Post) {
    this.publicaciones = this.publicaciones.filter((p) => p !== post);
  }
}
