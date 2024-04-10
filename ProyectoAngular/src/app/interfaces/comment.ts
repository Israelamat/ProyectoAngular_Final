import { Post } from "./post";
import { Users } from '../auth/interfaces/users';

export interface CommentInsert {
    text: string;
}

export interface Comment extends CommentInsert {
    id: number;
    text: string;
    date: string;
    post?: Post;
    user: Users;
}