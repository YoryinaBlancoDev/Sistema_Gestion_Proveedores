import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder,FormGroup,ReactiveFormsModule,Validators, AbstractControl,ValidationErrors,ValidatorFn } from '@angular/forms';
import { ActivatedRoute,Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { GenericService } from '../../shared/generic';
import { AuthenticationService } from '../../shared/authentication.service';

interface Usuario {
  id_usuario: number;
  nombre: string;
  apellido: string;
  correo: string;
  rol: 'ADMINISTRADOR' | 'COMPRAS' | 'CONSULTA';
  activo: boolean;
  fecha_registro: string;
}

@Component({
  selector: 'app-usuarios-create',
  imports: [ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIcon],
  templateUrl: './usuarios-create.html',
  styleUrl: './usuarios-create.css',
})
export class UsuariosCreate implements OnInit,OnDestroy {
  private destroy$ = new Subject<void>();
    mostrarPassword = false;
    usuarioForm: FormGroup;
  
  
    isCreate = true;
    titleForm = 'Crear';
  
    idUsuario?: number;
  
    
  
    constructor(
      private fb: FormBuilder,
      private gService: GenericService,
      private router: Router,
      private route: ActivatedRoute,
      private toastr: ToastrService,
      private authService:AuthenticationService
    ) {
      this.usuarioForm = this.fb.group({
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
      //Pattern para el formato de correo electrónico
      Validators.pattern(
        /^[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+(?:\.[A-Za-z0-9-]+)*\.[A-Za-z]{2,6}$/
      )
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
          'ADMINISTRADOR',
          Validators.required
        ],
        activo: [
          true,
          Validators.required
        ]
      });
    }
  
    ngOnInit(): void {
      
  
      const id = this.route.snapshot.paramMap.get('id');
  
      if (id) {
        this.idUsuario = Number(id);
        this.isCreate = false;
        this.titleForm = 'Actualizar';

         /// En actualizar la contraseña es opcional,
    // pero si se escribe debe tener mínimo 8 caracteres.
    this.usuarioForm
      .get('password')
      ?.setValidators([
        Validators.minLength(8)
      ]);

    this.usuarioForm
      .get('password')
      ?.updateValueAndValidity();
  
        this.cargarUsuario(this.idUsuario);
      }
    }
  
    esMiPropiaCuenta(): boolean {
  const usuarioActual = this.authService.currentUserValue;

  if (!usuarioActual || !this.idUsuario) {
    return false;
  }

  return usuarioActual.id_usuario === this.idUsuario;
}
  
    cargarUsuario(id: number): void {
  this.gService
    .get<Usuario>('usuario', id)
    .pipe(takeUntil(this.destroy$))
    .subscribe({

      next: (usuario) => {

        this.usuarioForm.patchValue({
          nombre: usuario.nombre,
          apellido: usuario.apellido,
          correo: usuario.correo,
          rol: usuario.rol,
          activo: usuario.activo
        });

        /*
         * Si el administrador está editando
         * su propia cuenta, no puede modificar
         * rol ni estado.
         */
        if (this.esMiPropiaCuenta()) {

          this.usuarioForm
            .get('rol')
            ?.disable();

          this.usuarioForm
            .get('activo')
            ?.disable();

        } else {

          this.usuarioForm
            .get('rol')
            ?.enable();

          this.usuarioForm
            .get('activo')
            ?.enable();

        }

      },

      error: (error) => {

        console.error(
          'Error al obtener usuario:',
          error
        );

      }

    });
}
  
    guardar(): void {
      

      if (this.usuarioForm.invalid) {
        this.usuarioForm.markAllAsTouched();
        return;
      }
  
      if (this.isCreate) {
        this.crearUsuario();
      } else {
        this.actualizarUsuario();
      }
    }
  
    crearUsuario(): void {
      
    this.gService
      .create<Usuario>(
        'usuario',
        this.usuarioForm.value
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.toastr.success(
            'El usuario se registró correctamente.',
            'Usuario creado'
          );
  
          this.router.navigate(['/usuarios']);
        },
  
        error: (error) => {
         
  
          if (error.status === 409) {
            this.toastr.warning(
              error.error.message,
              'Correo duplicado'
            );
  
            return;
          }
           console.error(
            'Error al crear usuario:',
            error
          );
  
          this.toastr.error(
            'No se pudo registrar el usuario.',
            'Error'
          );
        }
      });
  }
  
    actualizarUsuario(): void {
      if (!this.idUsuario) {
        return;
      }
//Se usa getRawValue() para que siga enviando al backend los valores del rol y el activo aunque esten desahabilidatos
       const datos = this.usuarioForm.getRawValue();
  
      this.gService
        .update<Usuario>(
          'usuario',
          this.idUsuario,
          datos
        )
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
             this.toastr.success(
            'El usuario se actualizó correctamente.',
            'Usuario actualizado'
          );
            this.router.navigate(['/usuarios']);
          },
  
          error: (error) => {
            
            if (error.status === 409) {
            this.toastr.warning(
              error.error.message,
              'Correo duplicado'
            );
  
              return;
            }
            console.error(
              'Error al actualizar usuario:',
              error
            );
            this.toastr.error(
            'No se pudo actualizar el usuario.',
            'Error'
          );
          }
        });
    }
  
    cancelar(): void {
      this.router.navigate(['/usuarios']);
    }
  
    errorHandling(
      control: string,
      error: string
    ): boolean {
      return this.usuarioForm
        .get(control)
        ?.hasError(error) ?? false;
    }
  
  
    ngOnDestroy(): void {
      this.destroy$.next();
      this.destroy$.complete();
    }
}
