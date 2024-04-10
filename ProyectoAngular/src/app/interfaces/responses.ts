import {Post} from './post';
import { Users } from '../auth/interfaces/users';
import { Comment } from './comment';


export interface PostsResponse {
    posts: Post[];
}

export interface SinglePostResponse{
    post: Post;
}

export interface TokenResponse {
    accessToken: string;
}

export interface UserResponse {
    user: Users;
}

export interface UsersResponse {
    users: Users[];
}

export interface AvatarResponse {
    avatar: string;
}

export interface LikeResponse {
    totalLikes: number;
}

export interface CommentsResponse {
    comments: Comment[];
}

export interface CommentResponse {
    comment: Comment;
}