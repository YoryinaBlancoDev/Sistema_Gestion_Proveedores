import { inject } from '@angular/core';

import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  Router
} from '@angular/router';

import { ToastrService } from 'ngx-toastr';

import {
  AuthenticationService
} from './authentication.service';


export const authGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot
) => {

  const authService =
    inject(AuthenticationService);

  const router =
    inject(Router);

  const toastr =
    inject(ToastrService);


  /*
   * Validar sesión
   */
  if (!authService.sesionValida()) {

    toastr.warning(
      'Debe iniciar sesión para acceder.',
      'Sesión requerida'
    );

    return router.createUrlTree([
      '/login'
    ]);
  }


  /*
   * Obtener usuario autenticado
   */
  const usuario =
    authService.currentUserValue;

  /*
   * Por seguridad, aunque sesionValida()
   * ya comprobó que existe.
   */
  if (!usuario) {

    return router.createUrlTree([
      '/login'
    ]);
  }


  /*
   * Obtener roles permitidos
   * de la configuración de la ruta
   */
  const rolesPermitidos =
    route.data['roles'] as
      string[] | undefined;


  /*
   * Si la ruta no tiene roles,
   * cualquier usuario autenticado puede entrar.
   */
  if (!rolesPermitidos) {
    return true;
  }


  /*
   * Comprobar el rol
   */
  if (
    rolesPermitidos.includes(
      usuario.rol
    )
  ) {
    return true;
  }


  /*
   * Usuario autenticado,
   * pero sin permiso para esa ruta.
   */
  toastr.warning(
    'No tiene permiso para acceder a esta sección.',
    'Acceso denegado'
  );

  return router.createUrlTree([
    '/dashboard'
  ]);
};