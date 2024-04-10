import { Component,EventEmitter, Input, OnInit, Output, inject, signal,WritableSignal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Post } from '../../interfaces/post';
import { PostCardComponent } from "../post-card/post-card.component";
import { PostsServiceService } from '../services/posts-service.service';
import { NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Comment, CommentInsert } from '../../interfaces/comment';

@Component({
    selector: 'post-detalle',
    standalone: true,
    templateUrl: './post-detalle.component.html',
    styleUrl: './post-detalle.component.css',
    imports: [CommonModule, PostCardComponent,ReactiveFormsModule]
})
export class PostDetalleComponent implements OnInit {
  #router = inject(Router);
  @Input() id!: number;
  @Output() delete = new EventEmitter<Post>();
  #postsService= inject(PostsServiceService);
  #fb = inject(NonNullableFormBuilder);
  comments:WritableSignal<Comment[]> =signal([]); 
  post!: Post;

  comment = this.#fb.control('');

  formComment = this.#fb.group({
    comment: this.comment,
  });


  ngOnInit(): void {
    this.#postsService.getPost(this.id).subscribe({
      next: (post) => {
        (this.post = post);
      },
      error: (error) => console.error(error),
    });

    this.#postsService.getComments(this.id).subscribe({
      next: (comments) => {
        this.comments.set(comments.comments)
      },
      error: (error) => console.error(error),
    });
  }


  addComment(){
    const comment:CommentInsert={
       text:this.comment.value,
    }

    this.#postsService.addComment(this.id,comment).subscribe({
      next: (comment) => {
        this.comments().push(comment);
        this.comment.reset();
      },
      error: (error) => console.error(error),
    });
  }

  goBack() {
    this.#router.navigate(['/posts']);
  }

  deletePost() {
    this.delete.emit();
  }
}
