import {
  Component,
  OnDestroy,
  OnInit,
  signal
} from '@angular/core';

import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { ToastrService } from 'ngx-toastr';

import { GenericService } from '../../shared/generic';


interface CategoriaProveedor {
  id_categoria: number;
  nombre: string;
  descripcion: string | null;
}

interface CategoriaProveedorRequest {
  nombre: string;
  descripcion: string | null;
}


@Component({
  selector: 'app-categorias-proveedor-form',

  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
  ],

  templateUrl: './categorias-proveedor-form.html',
  styleUrl: './categorias-proveedor-form.css'
})
export class CategoriasProveedorForm
  implements OnInit, OnDestroy {

  private destroy$ = new Subject<void>();

  categoriaForm!: FormGroup;

  isCreate = true;
  idCategoria: number | null = null;

  cargando = signal(false);
  guardando = signal(false);


  constructor(
    private fb: FormBuilder,
    private gService: GenericService,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService
  ) {}


  ngOnInit(): void {

    this.crearFormulario();

    const id =
      this.route.snapshot.paramMap.get('id');

    if (id) {

      this.idCategoria = Number(id);
      this.isCreate = false;

      this.cargarCategoria();

    }

  }


  crearFormulario(): void {

    this.categoriaForm = this.fb.group({

      nombre: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(100)
        ]
      ],

      descripcion: [
        '',
        [
          Validators.maxLength(255)
        ]
      ]

    });

  }


  cargarCategoria(): void {

    if (!this.idCategoria) {
      return;
    }

    this.cargando.set(true);

    this.gService
      .get<CategoriaProveedor>(
        'categoriaProveedor',
        this.idCategoria
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe({

        next: (categoria) => {

          this.categoriaForm.patchValue({
            nombre: categoria.nombre,
            descripcion: categoria.descripcion ?? ''
          });

          this.cargando.set(false);

        },

        error: (error) => {

          this.cargando.set(false);

          console.error(
            'Error al cargar categoría:',
            error
          );

          if (error.status === 404) {

            this.toastr.error(
              'La categoría no existe.',
              'Categoría no encontrada'
            );

            this.router.navigate(['/categorias']);

            return;
          }

          if (error.status === 403) {

            this.toastr.warning(
              'No tiene permiso para acceder a esta categoría.',
              'Acceso denegado'
            );

            this.router.navigate(['/dashboard']);

            return;
          }

          this.toastr.error(
            'No fue posible cargar la categoría.',
            'Error'
          );

        }

      });

  }


  guardar(): void {

    if (this.categoriaForm.invalid) {

      this.categoriaForm.markAllAsTouched();

      this.toastr.warning(
        'Revise los campos del formulario.',
        'Formulario inválido'
      );

      return;
    }

    if (this.guardando()) {
      return;
    }

    if (this.isCreate) {
      this.crearCategoria();
    } else {
      this.actualizarCategoria();
    }

  }


  crearCategoria(): void {

    const datos = this.obtenerDatos();

   this.guardando.set(true);

    this.gService
      .create<CategoriaProveedorRequest>(
        'categoriaProveedor',
        datos
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe({

        next: () => {

         this.guardando.set(false);

          this.toastr.success(
            'La categoría fue creada correctamente.',
            'Categoría creada'
          );

          this.router.navigate(['/categorias']);

        },

        error: (error) => {

          this.guardando.set(false);
          this.manejarError(error);

        }

      });

  }


  actualizarCategoria(): void {

    if (!this.idCategoria) {
      return;
    }

    const datos = this.obtenerDatos();

    this.guardando.set(true);

    this.gService
      .update<CategoriaProveedorRequest>(
        'categoriaProveedor',
        this.idCategoria,
        datos
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe({

        next: () => {

          this.guardando.set(false);

          this.toastr.success(
            'La categoría fue actualizada correctamente.',
            'Categoría actualizada'
          );

          this.router.navigate([
            '/categorias/detail',
            this.idCategoria
          ]);

        },

        error: (error) => {

          this.guardando.set(false);
          this.manejarError(error);

        }

      });

  }


  obtenerDatos(): CategoriaProveedorRequest {

    const valores =
      this.categoriaForm.getRawValue();

    return {

      nombre:
        valores.nombre.trim(),

      descripcion:
        valores.descripcion?.trim() || null

    };

  }


  manejarError(error: any): void {

    console.error(
      'Error al guardar categoría:',
      error
    );

    if (error.status === 409) {

      this.toastr.warning(
        error.error?.message ??
        'Ya existe una categoría con ese nombre.',
        'Categoría duplicada'
      );

      return;
    }

    if (error.status === 400) {

      this.toastr.warning(
        error.error?.message ??
        'Los datos ingresados no son válidos.',
        'Datos inválidos'
      );

      return;
    }

    if (error.status === 403) {

      this.toastr.warning(
        'No tiene permiso para realizar esta acción.',
        'Acceso denegado'
      );

      return;
    }

    this.toastr.error(
      'Ocurrió un error al guardar la categoría.',
      'Error'
    );

  }


  cancelar(): void {
    this.router.navigate(['/categorias']);
  }


  ngOnDestroy(): void {

    this.destroy$.next();
    this.destroy$.complete();

  }

}