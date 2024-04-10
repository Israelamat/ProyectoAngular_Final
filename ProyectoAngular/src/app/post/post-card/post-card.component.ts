import { Component, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Post } from '../../interfaces/post';
import { PostsServiceService } from '../services/posts-service.service';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'post-card',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './post-card.component.html',
  styleUrl: './post-card.component.css',
})
export class PostCardComponent implements OnInit{
  @Input() publicacionCard!: Post;
  @Output() delete = new EventEmitter<Post>();
  #postsService = inject(PostsServiceService);
  #router = inject(Router);
  totalLikes!: number;;

  ngOnInit(): void {
    this.totalLikes = this.publicacionCard.totalLikes;
  }

  thumbsRating(post: Post, like: boolean) {
    const oppositeLike = !like;
  
    if (post.likes === oppositeLike) {
      this.#postsService.deleteVote(post.id!).subscribe({
        next: (resp) => {
          post.likes = null;
          this.totalLikes = resp;
        },
        error: (error) => console.error(error),
      });
    } else {
      this.#postsService.addVote(post.id!, like).subscribe({
        next: (resp) => {
          post.likes = like;
          this.totalLikes = resp;
        },
        error: (error) => console.error(error),
      });
    }
  }

  deletePost() {
    this.#postsService.deletePost(this.publicacionCard.id!).subscribe({
      next: () => {
        this.delete.emit();
        this.#router.navigate(['/posts']);
      },
      error: (error) => console.error(error),
    });
  }

}
