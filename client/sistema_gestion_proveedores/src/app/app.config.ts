import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideToastr } from 'ngx-toastr';
import { provideHttpClient,withInterceptors } from '@angular/common/http';
import { authInterceptor } from './shared/auth.interceptor';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
     provideHttpClient(withInterceptors([
    authInterceptor
  ])),
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideToastr(),
    
  ]
};
