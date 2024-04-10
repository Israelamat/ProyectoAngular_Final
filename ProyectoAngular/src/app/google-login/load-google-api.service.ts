import { Injectable, inject } from '@angular/core';
import { Subject, fromEvent, firstValueFrom } from 'rxjs';
import { CLIENT_ID } from './google-login.config';

@Injectable({
  providedIn: 'root',
})
export class LoadGoogleApiService {
  #loader: Promise<void>;
  #credential$ = new Subject<google.accounts.id.CredentialResponse>();
  #clientId = inject(CLIENT_ID, { optional: true });

  constructor() {
    if (this.#clientId === null) {
     
      throw new Error(
        'LoadGoogleApiService: You must call provideGoogleId'
      );
    }
    this.#loader = this.#loadApi(); 
  }

  get credential$() {
    return this.#credential$;
  }

  async setGoogleBtn(btn: HTMLElement): Promise<void> {
    return this.#loader
      .then(() => {
        return new Promise<void>((resolve) => {
          google.accounts.id.renderButton(
            btn,
            { theme: 'filled_blue', size: 'large', type: 'standard' }
          );
          resolve();
        });
      });
  }
  
  #loadApi(): Promise<void> {
    return new Promise<void>((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      document.body.appendChild(script);
  
      const loadSubscription = fromEvent(script, 'load').subscribe(() => {
        google.accounts.id.initialize({
          client_id: this.#clientId!,
          callback: (response) => {
            this.#credential$.next(response);
          },
        });
        loadSubscription.unsubscribe();
        resolve();
      });
    });
  }
}