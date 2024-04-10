import { ApplicationConfig } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { baseUrlInterceptor } from './interceptors/base-url.interceptor';
import { authInterceptor } from './auth/interceptors/base-url.interceptor';
import { provideBingmapsKey } from './bingmaps/bingmaps.config';
import { provideGoogleId } from './google-login/google-login.config';
import { provideFacebookId } from './facebook-login/facebook-login.config';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(
      routes,
      withComponentInputBinding(),      
    ),
    provideHttpClient(withInterceptors([baseUrlInterceptor,authInterceptor])),
    //My googleID dont works 922636971202...
     provideBingmapsKey('AktyCrJO2dGAQxrb0_jy65cq18tWeRp66MAMNWwLrCoPIm9_HD9moXNXknchzwhJ'),
     provideGoogleId('746820501392-oalflicqch2kuc12s8rclb5rf7b1fist.apps.googleusercontent.com'),
     provideFacebookId('551918016324547','v15.0')
  ],
};