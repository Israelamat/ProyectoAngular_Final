import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { PostInsert,Post } from '../../interfaces/post';
import { CommentResponse, CommentsResponse, LikeResponse, PostsResponse, SinglePostResponse } from '../../interfaces/responses';
import { Comment, CommentInsert } from '../../interfaces/comment';

@Injectable({
  providedIn: 'root',
})

export class PostsServiceService {
  #http = inject(HttpClient);
  #productsUrl = 'posts';

  getPosts(): Observable<Post[]> {
    return this.#http
      .get<PostsResponse>(this.#productsUrl)
      .pipe(map((resp) => resp.posts));
  }
  // getPost(id: number): Observable<Post>
  getPost(id: number): Observable<Post> {
    return this.#http
      .get<SinglePostResponse>(`${this.#productsUrl}/${id}`)
      .pipe(map((resp) => resp.post));
  }

  // addPost(post: Post): Observable<Post>
  addPost(post: PostInsert): Observable<Post> {
    return this.#http
      .post<SinglePostResponse>(this.#productsUrl, post)
      .pipe(map((resp) => resp.post));
  }
  
  // deletePost(id: number): Observable<void>
  deletePost(id: number): Observable<void> {
    return this.#http.delete<void>(`${this.#productsUrl}/${id}`);
  }

  // addVote(id:number, likes: boolean): Observable<void>
  addVote(id: number, likes: boolean): Observable<number> {
    const likes2 = {
      likes: likes,
    };
    return this.#http.post<LikeResponse>(`${this.#productsUrl}/${id}/likes`, likes2).pipe(map((resp) => resp.totalLikes));
  }

  // deleteVote(id:number)
  deleteVote(id: number): Observable<number> {
    return this.#http.delete<LikeResponse>(`${this.#productsUrl}/${id}/likes`).pipe(map((resp) => resp.totalLikes));
  }

  getComments(idPost: number): Observable<CommentsResponse> {
    return this.#http.get<CommentsResponse>(`${this.#productsUrl}/${idPost}/comments`);
  }

  addComment(idPost: number, comment: CommentInsert): Observable<Comment> {
    return this.#http.post<CommentResponse>(`${this.#productsUrl}/${idPost}/comments`, comment).pipe(map((resp) => resp.comment));    
  }

  updatePost(idPost: number, post: PostInsert): Observable<Post> {
    return this.#http.put<SinglePostResponse>(`${this.#productsUrl}/${idPost}`, post).pipe(map((resp) => resp.post));
  }

  getUserPosts(id:number): Observable<Post[]> {
     return this.#http.get<PostsResponse>(`${this.#productsUrl}/user/${id}`).pipe(map((resp) => resp.posts));
  }
    
}
