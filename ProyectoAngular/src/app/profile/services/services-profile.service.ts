import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import {
  UserAvatarEdit,
  UserPasswordEdit,
  UserProfileEdit,
  Users,
} from '../../auth/interfaces/users';
import { Observable, map } from 'rxjs';
import { UserResponse } from '../../interfaces/responses';

@Injectable({
  providedIn: 'root',
})
export class ServicesProfileService {
  #http = inject(HttpClient);

  savePassword(password: UserPasswordEdit): Observable<void> {
    return this.#http.put<void>(`users/me/password`, password);
  }

  saveProfile(name: UserProfileEdit): Observable<void> {
    return this.#http.put<void>(`users/me`, name);
  }

  saveAvatar(avatar: UserAvatarEdit): Observable<void> {
    return this.#http.put<void>(`users/me/avatar`, avatar);
  }

  getProfile(id?: number): Observable<UserResponse> {
    return this.#http.get<UserResponse>(`users/${id}`)
  }

  getMyUser(): Observable<UserResponse> {
    return this.#http.get<UserResponse>(`users/me`)
  }
  
}
