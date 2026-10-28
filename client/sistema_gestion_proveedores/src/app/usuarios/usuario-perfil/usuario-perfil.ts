import { Component, OnDestroy,OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import { Router } from '@angular/router';

import {
  Subject,
  takeUntil
} from 'rxjs';

import { ToastrService } from 'ngx-toastr';

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import {
  AuthenticationService,
  ActualizarPerfilRequest,
  PerfilUsuario
} from '../../shared/authentication.service';

@Component({
  selector: 'app-usuario-perfil',
  imports: [ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule],
  templateUrl: './usuario-perfil.html',
  styleUrl: './usuario-perfil.css',
})
export class UsuarioPerfil implements OnInit, OnDestroy{
 perfilForm: FormGroup;
  mostrarPassword = false;
  perfil: PerfilUsuario | null = null;

  private destroy$ = new Subject<void>();


  constructor(
    private fb: FormBuilder,
    private authService: AuthenticationService,
    private toastr: ToastrService,
    private router: Router
  ) {

    this.perfilForm = this.fb.group({

      nombre: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(150)
        ]
      ],

      apellido: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(150)
        ]
      ],

      correo: [
        '',
        [
          Validators.required,
          Validators.maxLength(150),
          Validators.pattern(
            /^[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+(?:\.[A-Za-z0-9-]+)*\.[A-Za-z]{2,6}$/
          )
        ]
      ],

      password: [
        '',
        [
          Validators.minLength(8)
        ]
      ]

    });

  }


  ngOnInit(): void {
    this.cargarPerfil();
  }


  cargarPerfil(): void {

    this.authService
      .getPerfil()
      .pipe(
        takeUntil(this.destroy$)
      )
      .subscribe({

        next: (perfil) => {

          this.perfil = perfil;

          this.perfilForm.patchValue({
            nombre: perfil.nombre,
            apellido: perfil.apellido,
            correo: perfil.correo,
            password: ''
          });

        },

        error: (error) => {

          if (error.status === 401) {

            this.toastr.warning(
              'Su sesión no es válida o ha expirado.',
              'Sesión requerida'
            );

            this.authService.logout();

            this.router.navigate(['/login']);

            return;
          }

          this.toastr.error(
            'No se pudo cargar la información del perfil.',
            'Error'
          );

        }

      });

  }


  guardar(): void {

    if (this.perfilForm.invalid) {

      this.perfilForm.markAllAsTouched();

      return;
    }

    const datos: ActualizarPerfilRequest = {

      nombre:
        this.perfilForm.value.nombre.trim(),

      apellido:
        this.perfilForm.value.apellido.trim(),

      correo:
        this.perfilForm.value.correo.trim(),

      password:
        this.perfilForm.value.password || undefined

    };


    this.authService
      .actualizarPerfil(datos)
      .pipe(
        takeUntil(this.destroy$)
      )
      .subscribe({

        next: (response) => {

          this.perfil = response.data;

          /*
           * Actualizamos también el usuario
           * almacenado en Angular.
           */
          this.authService.actualizarUsuarioLocal({

            nombre:
              response.data.nombre,

            apellido:
              response.data.apellido,

            correo:
              response.data.correo

          });


          /*
           * Limpiamos la contraseña después
           * de actualizar.
           */
          this.perfilForm.patchValue({
            password: ''
          });


          this.toastr.success(
            'Su información se actualizó correctamente.',
            'Perfil actualizado'
          );

        },

        error: (error) => {

          if (error.status === 409) {

            this.toastr.warning(
              'Ya existe un usuario con ese correo.',
              'Correo existente'
            );

            return;
          }


          if (error.status === 401) {

            this.toastr.warning(
              'Su sesión no es válida o ha expirado.',
              'Sesión requerida'
            );

            this.authService.logout();

            this.router.navigate(['/login']);

            return;
          }


          this.toastr.error(
            'No se pudo actualizar el perfil.',
            'Error'
          );

        }

      });

  }


  errorHandling(
    control: string,
    error: string
  ): boolean {

    return (
      this.perfilForm
        .get(control)
        ?.hasError(error) ?? false
    );

  }


  formatearRol(
    rol:
      | 'ADMINISTRADOR'
      | 'COMPRAS'
      | 'CONSULTA'
  ): string {

    switch (rol) {

      case 'ADMINISTRADOR':
        return 'Administrador';

      case 'COMPRAS':
        return 'Compras';

      case 'CONSULTA':
        return 'Consulta';

      default:
        return rol;
    }

  }


  cancelar(): void {
    this.router.navigate(['/dashboard']);
  }


  ngOnDestroy(): void {

    this.destroy$.next();
    this.destroy$.complete();

  }
}
