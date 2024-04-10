import { Users } from "../auth/interfaces/users";

export interface PostInsert {
  id?: number;
  title?: string;
  description?: string;
  mood: number;
  image?: string;
  date?: string;
  likes: boolean | null;
  lat?: number ;
  lng?: number ;
}

export interface Post {
    id?: number;
    title?: string;
    description?: string;
    date?: string;
    image?: string;
    place?: string;
    lat: number;
    lng: number;
    mood: number;
    totalLikes: number;
    creator?: Users;
    mine: boolean;
    likes: boolean | null;
}


