import { Component } from '@angular/core';

import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import { Router } from '@angular/router';

import { ToastrService } from 'ngx-toastr';

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { AuthenticationService } from '../../shared/authentication.service';




interface LoginRequest {
  correo: string;
  password: string;
}

interface RegistroRequest {
  nombre: string;
  apellido: string;
  correo: string;
  password: string;
  rol: 'COMPRAS' | 'CONSULTA';
}


@Component({
  selector: 'app-usuarios-login',

  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatIconModule
  ],

  templateUrl: './usuarios-login.html',
  styleUrl: './usuarios-login.css'
})
export class UsuariosLogin {

  modoRegistro = false;

  ocultarPassword = true;


  loginForm: FormGroup;

  registroForm: FormGroup;


  constructor(
    private fb: FormBuilder,
    private authService: AuthenticationService,
    private router: Router,
    private toastr: ToastrService
  ) {

    this.loginForm = this.fb.group({

      correo: [
        '',
        [
          Validators.required,
          Validators.email
        ]
      ],

      password: [
        '',
        [
          Validators.required,
          Validators.minLength(8)
        ]
      ]

    });


    this.registroForm = this.fb.group({

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
          Validators.email,
          Validators.maxLength(150)
        ]
      ],

      password: [
        '',
        [
          Validators.required,
          Validators.minLength(8)
        ]
      ],

      rol: [
        '',
        Validators.required
      ]

    });

  }


  cambiarModo(): void {
    this.modoRegistro =
      !this.modoRegistro;
  }


  iniciarSesion(): void {

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const datos: LoginRequest = {

      correo:
        this.loginForm.value.correo,

      password:
        this.loginForm.value.password

    };


    this.authService
      .loginUser(datos)
      .subscribe({

        next: () => {

          this.toastr.success(
            'Inicio de sesión correcto.',
            'Bienvenido'
          );

          this.router.navigate([
    '/dashboard'
  ]);

        },

        error: (error) => {

          this.toastr.error(
            error.error?.message ||
            'No se pudo iniciar sesión.',
            'Error'
          );

        }

      });

  }


  registrar(): void {
console.log(
    'REGISTRAR EJECUTADO'
  );
  console.log(
    'Formulario válido:',
    this.registroForm.valid
  );

  console.log(
    'Valores:',
    this.registroForm.value
  );

  console.log(
    'Errores formulario:',
    this.registroForm.errors
  );

  console.log(
    'Controles:',
    this.registroForm.controls
  );
    if (this.registroForm.invalid) {
       console.log(
      'FORMULARIO INVÁLIDO'
    );
      this.registroForm.markAllAsTouched();
      return;
    }

    const datos: RegistroRequest = {

      nombre:
        this.registroForm.value.nombre,

      apellido:
        this.registroForm.value.apellido,

      correo:
        this.registroForm.value.correo,

      password:
        this.registroForm.value.password,

      rol:
        this.registroForm.value.rol

    };
console.log(
    'DATOS QUE SE ENVIARÁN:',
    datos
  );

    this.authService
      .registrarUsuario(datos)
      .subscribe({

        next: (response) => {
console.log(
          'REGISTRO EXITOSO:',
          response
        );
          this.toastr.success(
            'Usuario registrado correctamente.',
            'Registro exitoso'
          );

          this.modoRegistro = false;

          this.loginForm.patchValue({
            correo: datos.correo,
            password: ''
          });

          this.registroForm.reset();

        },

        error: (error) => {

          if (error.status === 409) {

            this.toastr.warning(
              error.error?.message,
              'Correo duplicado'
            );

            return;

          }

          this.toastr.error(
            error.error?.message ||
            'No se pudo registrar el usuario.',
            'Error'
          );

        }

      });

  }


  errorLogin(
    control: string,
    error: string
  ): boolean {

    return this.loginForm
      .get(control)
      ?.hasError(error) ?? false;

  }


  errorRegistro(
    control: string,
    error: string
  ): boolean {

    return this.registroForm
      .get(control)
      ?.hasError(error) ?? false;

  }

}