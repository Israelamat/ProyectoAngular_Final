import { HttpClient } from '@angular/common/http';
import { Injectable, WritableSignal, inject, signal } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { UserLogin, Users } from '../interfaces/users';
import { SsrCookieService } from 'ngx-cookie-service-ssr';
import { catchError, map, of } from 'rxjs';
import { TokenResponse } from '../interfaces/responses';


@Injectable({
  providedIn: 'root'
})
export class AuthServiceService {

  #logged: WritableSignal<boolean>=signal(false);
  #http = inject(HttpClient);
  cookieService=inject(SsrCookieService);

  get logged(): WritableSignal<boolean> {
    return this.#logged;
  }

  login(data: UserLogin): Observable<void> {
    return this.#http.post<TokenResponse>('auth/login', data).pipe(map(r => {
      this.cookieService.set('token', r.accessToken);
      this.#logged.set(true);
    }))
  }

  loginGoogle(data: String): Observable<void> {
    const data2 = {token: data};
    return this.#http.post<TokenResponse>('auth/google', data2).pipe(map(r => {
      this.cookieService.set('token', r.accessToken);
      this.#logged.set(true);
    }))
  }

  loginFacebook(data: String): Observable<void> {
    const data3 = {token: data};
    return this.#http.post<TokenResponse>('auth/facebook', data3).pipe(map(r => {
      this.cookieService.set('token', r.accessToken);
      this.#logged.set(true);
    }))
  }

  register(user: Users): Observable<void> {
    return this.#http.post<void>('auth/register', user);
  }
  
  logout(): void{
    this.cookieService.delete('token'); 
    this.#logged.set(false);
  }

  isLogged(): Observable<boolean> {
    if (!this.logged() && !this.cookieService.check('token')) {
      return of(false);
    }
    else if (this.#logged()) {
      return of(true);
    }
    else if (!this.#logged() && this.cookieService.check('token')) {
      return this.#http.get('auth/validate').pipe(
        map(() => {
          this.#logged.set(true);
          return true;
        }),
        catchError(() => {
          this.cookieService.delete('token');
          return of(false);
        })
      );
    }
    return of(false);    
  }  
}