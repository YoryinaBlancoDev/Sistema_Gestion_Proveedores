import {
  HttpErrorResponse,
  HttpInterceptorFn
} from '@angular/common/http';

import { inject } from '@angular/core';
import { Router } from '@angular/router';

import {
  catchError,
  throwError
} from 'rxjs';

import {
  AuthenticationService
} from './authentication.service';

import { ToastrService } from 'ngx-toastr';


export const authInterceptor: HttpInterceptorFn = (
  request,
  next
) => {

  const router =
    inject(Router);

  const authService =
    inject(AuthenticationService);

  const toastr =
  inject(ToastrService);


  /*
   * Endpoints públicos
   */
  const esLogin =
    request.url.includes(
      '/usuario/login'
    );

  const esRegistro =
    request.url.includes(
      '/usuario/registrar'
    );

  const esEndpointPublico =
    esLogin || esRegistro;


  /*
   * Obtener usuario almacenado
   */
  const currentUser =
    localStorage.getItem(
      'currentUser'
    );

  let requestConToken =
    request;


  /*
   * Agregar JWT solamente
   * cuando exista una sesión
   */
  if (
    currentUser &&
    !esEndpointPublico
  ) {

    try {

      const usuario =
        JSON.parse(
          currentUser
        );

      const token =
        usuario.token;


      if (token) {

        requestConToken =
          request.clone({
            setHeaders: {
              Authorization:
                `Bearer ${token}`
            }
          });

      }

    } catch {

      authService.logout();

    }

  }


  return next(
    requestConToken
  ).pipe(

    catchError(
  (error: HttpErrorResponse) => {

    if (
      error.status === 401 &&
      !esEndpointPublico
    ) {

      const habiaSesion =
        !!currentUser;

      authService.logout();

      if (habiaSesion) {

        toastr.warning(
          'Su sesión ha expirado. Inicie sesión nuevamente.',
          'Sesión expirada'
        );

      } else {

        toastr.warning(
          'Debe iniciar sesión para acceder.',
          'Sesión requerida'
        );

      }

      router.navigate([
        '/login'
      ]);
    }

    return throwError(
      () => error
    );
  }
)
  );
};