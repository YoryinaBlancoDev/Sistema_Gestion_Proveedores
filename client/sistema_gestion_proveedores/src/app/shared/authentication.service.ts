import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  BehaviorSubject,
  Observable,
  map
} from 'rxjs';

import { environment } from '../../environments/environment';


export interface UsuarioAutenticado {
  id_usuario: number;
  nombre: string;
  apellido: string;
  correo: string;
  rol: 'ADMINISTRADOR' | 'COMPRAS' | 'CONSULTA';
  activo: boolean;
  token: string;
}


export interface LoginRequest {
  correo: string;
  password: string;
}


export interface LoginResponse {
  data: UsuarioAutenticado;
}


export interface RegistroUsuarioRequest {
  nombre: string;
  apellido: string;
  correo: string;
  password: string;
}


export interface RegistroUsuarioResponse {
  message: string;

  data?: {
    id_usuario: number;
    nombre: string;
    apellido: string;
    correo: string;
    rol: 'ADMINISTRADOR' | 'COMPRAS' | 'CONSULTA';
    activo: boolean;
  };
}

export interface PerfilUsuario {
  id_usuario: number;
  nombre: string;
  apellido: string;
  correo: string;
  rol: 'ADMINISTRADOR' | 'COMPRAS' | 'CONSULTA';
  activo: boolean;
  fecha_registro: string;
}

export interface ActualizarPerfilRequest {
  nombre: string;
  apellido: string;
  correo: string;
  password?: string;
}

export interface ActualizarPerfilResponse {
  message: string;
  data: PerfilUsuario;
}


@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {

  private ServerUrl = environment.apiURL;

  private currentUserSubject:
    BehaviorSubject<UsuarioAutenticado | null>;

  public currentUser:
    Observable<UsuarioAutenticado | null>;

  private authenticated:
    BehaviorSubject<boolean>;


  constructor(
    private http: HttpClient
  ) {

    const usuarioGuardado =
      this.obtenerUsuarioGuardado();

    this.currentUserSubject =
      new BehaviorSubject<UsuarioAutenticado | null>(
        usuarioGuardado
      );

    this.currentUser =
      this.currentUserSubject.asObservable();

    this.authenticated =
      new BehaviorSubject<boolean>(
        usuarioGuardado !== null
      );

  }


  private obtenerUsuarioGuardado():
    UsuarioAutenticado | null {

  const usuario =
    localStorage.getItem('currentUser');

  if (!usuario) {
    return null;
  }

  try {

    const usuarioParseado =
      JSON.parse(
        usuario
      ) as UsuarioAutenticado;

    if (
      !usuarioParseado.token ||
      this.tokenExpirado(
        usuarioParseado.token
      )
    ) {

      localStorage.removeItem(
        'currentUser'
      );

      return null;
    }

    return usuarioParseado;

  } catch {

    localStorage.removeItem(
      'currentUser'
    );

    return null;
  }

  }

  private tokenExpirado(token: string): boolean {
  try {
    const partes = token.split('.');

    if (partes.length !== 3) {
      return true;
    }

   const payloadBase64 = partes[1]
  .replace(/-/g, '+')
  .replace(/_/g, '/');

const payload = JSON.parse(
  atob(payloadBase64)
);

    if (!payload.exp) {
      return true;
    }

    const fechaExpiracion =
      payload.exp * 1000;

    return Date.now() >= fechaExpiracion;

  } catch {
    return true;
  }
}

public sesionValida():
    boolean {

    const usuario =
      this.currentUserValue;

    if (!usuario) {
      return false;
    }

    if (
      !usuario.token ||
      this.tokenExpirado(
        usuario.token
      )
    ) {

      this.logout();

      return false;
    }

    return true;
  }


  public get currentUserValue():
    UsuarioAutenticado | null {

    return this.currentUserSubject.value;

  }


  public get isAuthenticated():
    Observable<boolean> {

    return this.authenticated
      .asObservable();

  }


  /*
   * Registro público
   */
  registrarUsuario(
    usuario: RegistroUsuarioRequest
  ): Observable<RegistroUsuarioResponse> {

    return this.http.post<RegistroUsuarioResponse>(
      this.ServerUrl + '/usuario/registrar',
      usuario
    );

  }


  /*
   * Login
   */
  loginUser(
    usuario: LoginRequest
  ): Observable<LoginResponse> {

    return this.http
      .post<LoginResponse>(
        this.ServerUrl + '/usuario/login',
        usuario
      )
      .pipe(

        map(response => {

          localStorage.setItem(
            'currentUser',
            JSON.stringify(
              response.data
            )
          );

          this.currentUserSubject.next(
            response.data
          );

          this.authenticated.next(true);

          return response;

        })

      );

  }

  /*
 * Obtener perfil del usuario autenticado
 */
getPerfil(): Observable<PerfilUsuario> {

  return this.http.get<PerfilUsuario>(
    this.ServerUrl + '/usuario/perfil'
  );
}


/*
 * Actualizar perfil del usuario autenticado
 */
actualizarPerfil(
  datos: ActualizarPerfilRequest
): Observable<ActualizarPerfilResponse> {

  return this.http.put<ActualizarPerfilResponse>(
    this.ServerUrl + '/usuario/perfil',
    datos
  );
}


/*
 * Actualizar información del usuario almacenada localmente
 */
actualizarUsuarioLocal(
  cambios: Partial<UsuarioAutenticado>
): void {

  const usuarioActual =
    this.currentUserValue;

  if (!usuarioActual) {
    return;
  }

  const usuarioActualizado:
    UsuarioAutenticado = {

    ...usuarioActual,
    ...cambios

  };

  localStorage.setItem(
    'currentUser',
    JSON.stringify(usuarioActualizado)
  );

  this.currentUserSubject.next(
    usuarioActualizado
  );
}



  /*
   * Logout
   */
  logout(): void {

    localStorage.removeItem(
      'currentUser'
    );

    this.currentUserSubject.next(
      null
    );

    this.authenticated.next(false);

  }

}