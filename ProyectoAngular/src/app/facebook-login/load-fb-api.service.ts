import { Injectable, inject } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';
import { FB_CONFIG } from './facebook-login.config';

@Injectable({
  providedIn: 'root',
})
export class LoadFbApiService {
  #loader: Promise<void>;

  #fbConfig = inject(FB_CONFIG, { optional: true });

  constructor() {
    if (!this.#fbConfig) {
      throw new Error(
        'FacebookLogService: You must call provideFacebookId in app.config'
      );
    }
    this.#loader = this.#loadApi(); 
  }

  async login(scopes: string): Promise<fb.StatusResponse> {
    return this.#loader.then(() => {
      return this.isLogged().then((response) => response).catch(() => {
        return new Promise((resolve, reject) => {
          FB.login(
            (respLogin: fb.StatusResponse) => {
              if (respLogin.status === 'connected') {
                resolve(respLogin);
              } else {
                reject(respLogin);
              }
            },
            { scope: scopes }
          );
        });
      });
    });
  }
  
  async isLogged(): Promise<fb.StatusResponse> {
    return this.#loader.then(() => {
      return new Promise((resolve, reject) => {
        FB.getLoginStatus((response) => {
          if (response.status === 'connected') {
            resolve(response);
          } else {
            reject(response);
          }
        });
      });
    });
  }
  
  async logout(): Promise<void> {
    return this.#loader.then(() => {
      return new Promise((resolve) => {
        FB.logout(() => resolve());
      });
    });
  }
  

  #loadApi(): Promise<void> {
    const script = document.createElement('script');
    script.id = 'facebook-jssdk';
    script.src = 'https://connect.facebook.net/es_ES/sdk.js';
    script.defer = true;
    document.body.appendChild(script);

    return new Promise((resolve) => {
      window['fbAsyncInit'] = () => {
        FB.init({
          appId: this.#fbConfig!.app_id,
          xfbml: true,
          autoLogAppEvents: true,
          version: this.#fbConfig!.version,
        });
        resolve();
      };
    });
  }
}