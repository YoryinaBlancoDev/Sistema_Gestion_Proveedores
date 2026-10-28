import {
  Component,
  OnDestroy,
  OnInit
} from '@angular/core';

import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import {
  ActivatedRoute,
  Router
} from '@angular/router';

import {
  Subject,
  takeUntil
} from 'rxjs';

import { ToastrService } from 'ngx-toastr';

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

import { GenericService } from '../../shared/generic'
import { AuthenticationService } from '../../shared/authentication.service';

interface Proveedor {
  id_proveedor: number;
  nombre_empresa: string;
}


interface Usuario {
  id_usuario: number;
  nombre: string;
  apellido: string;
}


interface Evaluaciones_proveedor {
  id_evaluacion: number;
  proveedor_id: number;
  usuario_id: number;
  calificacion: number;
  comentario: string | null;
  fecha_evaluacion: string;

  proveedor: {
    id_proveedor: number;
    nombre_empresa: string;
  };

  usuario: {
    id_usuario: number;
    nombre: string;
    apellido: string;
  };
}

interface EvaluacionProveedorRequest {
  proveedor_id: number;
  usuario_id: number;
  calificacion: number;
  comentario: string | null;
}

@Component({
  selector: 'app-evaluaciones-proveedor-form',
  imports: [ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatAutocompleteModule],
  templateUrl: './evaluaciones-proveedor-form.html',
  styleUrl: './evaluaciones-proveedor-form.css',
})
export class EvaluacionesProveedorForm implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  usuariosFiltrados: Usuario[] = [];

  proveedoresFiltrados: Proveedor[] = [];

  evaluacionForm: FormGroup;

  proveedores: Proveedor[] = [];

  usuarios: Usuario[] = [];

  isCreate = true;

  titleForm = 'Crear';

  idEvaluacion?: number;


  constructor(
    private fb: FormBuilder,
    private gService: GenericService,
    private router: Router,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private authService: AuthenticationService
  ) {

    this.evaluacionForm = this.fb.group({

      proveedor_id: [
        null,
        Validators.required
      ],

      proveedor_busqueda: [
    '',
    Validators.required
  ],

      usuario_id: [
        null,
      ],

      usuario_busqueda: [''],

      calificacion: [
        null,
        [
          Validators.required,
          Validators.min(1),
          Validators.max(5)
        ]
      ],

      comentario: [
        '',
        Validators.maxLength(500)
      ]

    });

  }
  get usuarioActual() {
  return this.authService.currentUserValue;
  }

  get esAdministrador(): boolean {
    return this.usuarioActual?.rol === 'ADMINISTRADOR';
  }

  get esCompras(): boolean {
    return this.usuarioActual?.rol === 'COMPRAS';
  }

  ngOnInit(): void {

    this.cargarProveedores();

    if (this.esAdministrador) {
        this.cargarUsuarios();

        this.evaluacionForm
          .get('usuario_id')
          ?.setValidators([
            Validators.required
          ]);

        this.evaluacionForm
          .get('usuario_busqueda')
          ?.setValidators([
            Validators.required
          ]);

        this.evaluacionForm
          .get('usuario_id')
          ?.updateValueAndValidity();

        this.evaluacionForm
          .get('usuario_busqueda')
          ?.updateValueAndValidity();
      }

    const id =
      this.route.snapshot.paramMap.get('id');

    if (id) {

      this.idEvaluacion = Number(id);

      this.isCreate = false;

      this.titleForm = 'Actualizar';

      this.cargarEvaluacion(
        this.idEvaluacion
      );

    }

  }


  cargarProveedores(): void {

    this.gService
      .list<Proveedor>('proveedores')
      .pipe(
        takeUntil(this.destroy$)
      )
      .subscribe({

        next: (data) => {

          this.proveedores = data;
            this.proveedoresFiltrados = data;
        },

        error: (error) => {

          console.error(
            'Error al cargar proveedores:',
            error
          );

        }

      });

  }

  filtrarProveedores(event: Event): void {

  const valor =
    (event.target as HTMLInputElement)
      .value
      .trim();

  // Si vuelve a escribir, se elimina
  // cualquier selección anterior
  this.evaluacionForm.patchValue({
    proveedor_id: null
  });

  const controlBusqueda =
    this.evaluacionForm.get('proveedor_busqueda');

  if (valor.length > 0) {

    controlBusqueda?.setErrors({
      proveedorInvalido: true
    });

  }

  this.proveedoresFiltrados =
    this.proveedores.filter(
      proveedor =>
        proveedor.nombre_empresa
          .toLowerCase()
          .includes(valor.toLowerCase())
    );

}



seleccionarProveedor(
  proveedor: Proveedor
): void {

  this.evaluacionForm.patchValue({

    proveedor_id:
      proveedor.id_proveedor,

    proveedor_busqueda:
      proveedor.nombre_empresa

  });

  this.evaluacionForm
    .get('proveedor_busqueda')
    ?.setErrors(null);

}


  cargarUsuarios(): void {

    this.gService
      .list<Usuario>('usuario')
      .pipe(
        takeUntil(this.destroy$)
      )
      .subscribe({

        next: (data) => {

          this.usuarios = data;
          this.usuariosFiltrados = data;

        },

        error: (error) => {

          console.error(
            'Error al cargar usuarios:',
            error
          );

        }

      });

  }

  filtrarUsuarios(event: Event): void {

  const valor =
    (event.target as HTMLInputElement)
      .value
      .trim();

  this.evaluacionForm.patchValue({
    usuario_id: null
  });

  const controlBusqueda =
    this.evaluacionForm.get('usuario_busqueda');

  if (valor.length > 0) {
    controlBusqueda?.setErrors({
      usuarioInvalido: true
    });
  }

  this.usuariosFiltrados =
    this.usuarios.filter(usuario => {

      const nombreCompleto =
        `${usuario.nombre} ${usuario.apellido}`
          .toLowerCase();

      return nombreCompleto.includes(
        valor.toLowerCase()
      );

    });

}

seleccionarUsuario(
  usuario: Usuario
): void {

  this.evaluacionForm.patchValue({

    usuario_id:
      usuario.id_usuario,

    usuario_busqueda:
      `${usuario.nombre} ${usuario.apellido}`

  });

  this.evaluacionForm
    .get('usuario_busqueda')
    ?.setErrors(null);

}

mostrarUsuario(
  usuario: Usuario | string | null
): string {

  if (!usuario) {
    return '';
  }

  if (typeof usuario === 'string') {
    return usuario;
  }

  return `${usuario.nombre} ${usuario.apellido}`;
}


  cargarEvaluacion(id: number): void {

  this.gService
    .get<Evaluaciones_proveedor>(
      'evaluacionProveedor',
      id
    )
    .pipe(
      takeUntil(this.destroy$)
    )
    .subscribe({

      next: (evaluacion) => {

        this.evaluacionForm.patchValue({

          proveedor_id:
            evaluacion.proveedor_id,

          proveedor_busqueda:
            evaluacion.proveedor.nombre_empresa,

          calificacion:
            Number(evaluacion.calificacion),

          comentario:
            evaluacion.comentario

        });

        if (this.esAdministrador) {

          this.evaluacionForm.patchValue({

            usuario_id:
              evaluacion.usuario_id,

            usuario_busqueda:
              `${evaluacion.usuario.nombre} ${evaluacion.usuario.apellido}`
          });
        }
      },

      error: (error) => {

        console.error(
    'Error al obtener evaluación:',
    error
  );

  if (error.status === 403) {

    this.toastr.warning(
      'No tiene permiso para editar esta evaluación.',
      'Acceso denegado'
    );

    this.router.navigate([
      '/evaluaciones'
    ]);

    return;
  }

  if (error.status === 404) {

    this.toastr.error(
      'La evaluación solicitada no existe.',
      'Evaluación no encontrada'
    );

    this.router.navigate([
      '/evaluaciones'
    ]);

    return;
  }

  if (error.status === 401) {

    this.toastr.warning(
      'Su sesión no es válida o ha expirado.',
      'Sesión requerida'
    );

    this.router.navigate([
      '/login'
    ]);

    return;
  }

  this.toastr.error(
    'No se pudo cargar la evaluación.',
    'Error'
  );

  this.router.navigate([
    '/evaluaciones'
  ]);
      }

    });

}


  guardar(): void {

    if (this.evaluacionForm.invalid) {

      this.evaluacionForm
        .markAllAsTouched();

      return;

    }

    if (this.isCreate) {

      this.crearEvaluacion();

    } else {

      this.actualizarEvaluacion();

    }

  }


  crearEvaluacion(): void {

    const datos: EvaluacionProveedorRequest = {

      proveedor_id:
        this.evaluacionForm.value.proveedor_id,

      usuario_id:
        this.esAdministrador
        ? Number(
            this.evaluacionForm.value.usuario_id
          )
        : this.usuarioActual!.id_usuario,

      calificacion:
        Number(
          this.evaluacionForm.value.calificacion
        ),

      comentario:
        this.evaluacionForm.value.comentario || null

    };


    this.gService
      .create<EvaluacionProveedorRequest>(
        'evaluacionProveedor',
        datos
      )
      .pipe(
        takeUntil(this.destroy$)
      )
      .subscribe({

        next: () => {

          this.toastr.success(
            'La evaluación se registró correctamente.',
            'Evaluación creada'
          );

          this.router.navigate([
            '/evaluaciones'
          ]);

        },

        error: (error) => {
          if (error.status === 409) {
            this.toastr.warning(
              error.error.message,
              'Evaluación duplicada'
            );

            return;
          }

          console.error(
            'Error al crear evaluación:',
            error
          );

          this.toastr.error(
            error.error?.message
              || 'No se pudo registrar la evaluación.',
            'Error'
          );

        }

      });

  }


  actualizarEvaluacion(): void {

    if (!this.idEvaluacion) {
      return;
    }


    const datos: EvaluacionProveedorRequest = {

      proveedor_id:
        this.evaluacionForm.value.proveedor_id,

       usuario_id:
      this.esAdministrador
        ? Number(
            this.evaluacionForm.value.usuario_id
          )
        : this.usuarioActual!.id_usuario,

      calificacion:
        Number(
          this.evaluacionForm.value.calificacion
        ),

      comentario:
        this.evaluacionForm.value.comentario || null

    };


    this.gService
      .update<EvaluacionProveedorRequest>(
        'evaluacionProveedor',
        this.idEvaluacion,
        datos
      )
      .pipe(
        takeUntil(this.destroy$)
      )
      .subscribe({

        next: () => {

          this.toastr.success(
            'La evaluación se actualizó correctamente.',
            'Evaluación actualizada'
          );

          this.router.navigate([
            '/evaluaciones'
          ]);

        },

        error: (error) => {

          if (error.status === 409) {
            this.toastr.warning(
              error.error.message,
              'Evaluación duplicada'
            );

            return;
          }

          console.error(
            'Error al actualizar evaluación:',
            error
          );

          this.toastr.error(
            error.error?.message
              || 'No se pudo actualizar la evaluación.',
            'Error'
          );

        }

      });

  }

  mostrarProveedor(
  proveedor: Proveedor | string | null
): string {

  if (!proveedor) {
    return '';
  }

  if (typeof proveedor === 'string') {
    return proveedor;
  }

  return proveedor.nombre_empresa;
}


  cancelar(): void {

    this.router.navigate([
      '/evaluaciones'
    ]);

  }


  errorHandling(
    control: string,
    error: string
  ): boolean {

    return this.evaluacionForm
      .get(control)
      ?.hasError(error) ?? false;

  }


  ngOnDestroy(): void {

    this.destroy$.next();

    this.destroy$.complete();

  }

}
