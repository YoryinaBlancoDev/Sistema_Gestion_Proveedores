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

import { GenericService } from '../../shared/generic';

interface CategoriaProveedor {
  id_categoria: number;
  nombre: string;
  descripcion: string | null;
}

interface Proveedor {
  id_proveedor: number;
  categoria_id: number;
  nombre_empresa: string;
  cedula_juridica: string | null;
  telefono: string | null;
  correo: string | null;
  direccion: string | null;
  estado: 'ACTIVO' | 'EN_EVALUACION' | 'SUSPENDIDO';
}

/* =========================================================
   VALIDACIÓN DE CÉDULA JURÍDICA
   ========================================================= */

const clasesPorTipo: Record<string, string[]> = {
  //'tipos':[clases]
  '2': [
    '100',
    '200',
    '300',
    '400'
  ],

  '3': [
    '002',
    '003',
    '004',
    '005',
    '006',
    '007',
    '008',
    '009',
    '010',
    '011',
    '012',
    '013',
    '014',
    '101',
    '102',
    '103',
    '104',
    '105',
    '106',
    '107',
    '108',
    '109',
    '110',
    '111',
    '112'
  ],

  '4': [
    '000'
  ],

  '5': [
    '001'
  ]
};

function cedulaJuridicaValidator(): ValidatorFn {

  return (
    control: AbstractControl
  ): ValidationErrors | null => {

    const value = String(control.value ?? '')
      .trim()
      .toUpperCase();

    // Validators.required se encarga del campo vacío
    if (!value) {
      return null;
    }

    // Debe tener exactamente 10 caracteres
    if (value.length !== 10) {
      return {
        cedulaJuridica: 'length'
      };
    }

    const tipo = value.substring(0, 1);
    const clase = value.substring(1, 4);
    const consecutivo = value.substring(4, 10);

    // Validar tipo
    if (!clasesPorTipo[tipo]) {
      return {
        cedulaJuridica: 'tipo'
      };
    }

    // Validar que la clase corresponda al tipo
    if (!clasesPorTipo[tipo].includes(clase)) {
      return {
        cedulaJuridica: 'clase'
      };
    }

   // El consecutivo debe contener exactamente
  // 6 caracteres alfanuméricos
      if (!/^[A-Z0-9]{6}$/.test(consecutivo)) {
        return {
          cedulaJuridica: 'consecutivo'
        };
      }

    return null;
  };
}



@Component({
  selector: 'app-proveedores-create',
  imports:  [ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    
  ],
  templateUrl: './proveedores-create.html',
  styleUrl: './proveedores-create.css',
})
export class ProveedoresCreate implements OnInit,OnDestroy{
   private destroy$ = new Subject<void>();

  proveedorForm: FormGroup;

  categoriaList: CategoriaProveedor[] = [];

  isCreate = true;
  titleForm = 'Crear';

  idProveedor?: number;

  

  constructor(
    private fb: FormBuilder,
    private gService: GenericService,
    private router: Router,
    private route: ActivatedRoute,
    private toastr: ToastrService
  ) {
    this.proveedorForm = this.fb.group({
      nombre_empresa: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(150)
        ]
      ],

      categoria_id: [
        null,
        Validators.required
      ],

      cedula_juridica: [
      '',
      [
      Validators.required,
      cedulaJuridicaValidator()
      ]
      ],

      telefono: [
      '',
      [
      Validators.required,
      Validators.pattern(/^\d{4}-\d{4}$/)
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

      direccion: [
        '',[
        Validators.required,
        Validators.maxLength(255)
        ]
        
      ],

      estado: [
        'EN_EVALUACION',
        Validators.required
      ]
    });
  }

  ngOnInit(): void {
    this.listaCategorias();

    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.idProveedor = Number(id);
      this.isCreate = false;
      this.titleForm = 'Actualizar';

      this.cargarProveedor(this.idProveedor);
    }
  }

  listaCategorias(): void {
   console.log('Cargando categorías...');

  this.gService
    .list<CategoriaProveedor>('categoriaProveedor')
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (data) => {
        console.log('CATEGORÍAS RECIBIDAS:', data);
        this.categoriaList = data;
      },
      error: (error) => {
        console.error('ERROR AL CARGAR CATEGORÍAS:', error);
      }
    });
  }

  cargarProveedor(id: number): void {
    this.gService
      .get<Proveedor>('proveedores', id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (proveedor) => {
          this.proveedorForm.patchValue({
            nombre_empresa: proveedor.nombre_empresa,
            categoria_id: proveedor.categoria_id,
            cedula_juridica: proveedor.cedula_juridica,
            telefono: proveedor.telefono,
            correo: proveedor.correo,
            direccion: proveedor.direccion,
            estado: proveedor.estado
          });
        },

        error: (error) => {
          console.error(
            'Error al obtener proveedor:',
            error
          );
        }
      });
  }

  guardar(): void {
    if (this.proveedorForm.invalid) {
      this.proveedorForm.markAllAsTouched();
      return;
    }

    if (this.isCreate) {
      this.crearProveedor();
    } else {
      this.actualizarProveedor();
    }
  }

  crearProveedor(): void {
  this.gService
    .create<Proveedor>(
      'proveedores',
      this.proveedorForm.value
    )
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: () => {
        this.toastr.success(
          'El proveedor se registró correctamente.',
          'Proveedor creado'
        );

        this.router.navigate(['/proveedores']);
      },

      error: (error) => {
        console.error(
          'Error al crear proveedor:',
          error
        );

        if (error.status === 409) {
          this.toastr.warning(
            error.error.message,
            'Cédula duplicada'
          );

          return;
        }

        this.toastr.error(
          'No se pudo registrar el proveedor.',
          'Error'
        );
      }
    });
}

  actualizarProveedor(): void {
    if (!this.idProveedor) {
      return;
    }

    this.gService
      .update<Proveedor>(
        'proveedores',
        this.idProveedor,
        this.proveedorForm.value
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
           this.toastr.success(
          'El proveedor se actualizó correctamente.',
          'Proveedor actualizado'
        );
          this.router.navigate(['/proveedores']);
        },

        error: (error) => {
          console.error(
            'Error al actualizar proveedor:',
            error
          );
          if (error.status === 409) {
          this.toastr.warning(
            error.error.message,
            'Cédula duplicada'
          );

            return;
          }
          this.toastr.error(
          'No se pudo actualizar el proveedor.',
          'Error'
        );
        }
      });
  }

  cancelar(): void {
    this.router.navigate(['/proveedores']);
  }

  errorHandling(
    control: string,
    error: string
  ): boolean {
    return this.proveedorForm
      .get(control)
      ?.hasError(error) ?? false;
  }

  // Manejo de errores específicos de la cédula jurídica
  cedulaError(): string | null {
  return this.proveedorForm
    .get('cedula_juridica')
    ?.getError('cedulaJuridica') ?? null;
  }

  convertirCedulaMayuscula(): void {
  const control = this.proveedorForm.get('cedula_juridica');

  const valor = control?.value;

  if (valor) {
    control.setValue(
      valor.toUpperCase(),
      { emitEvent: false }
    );
  }
}

// Formatea el teléfono como XXXX-XXXX
formatearTelefono(): void {
  const control = this.proveedorForm.get('telefono');

  let valor = control?.value ?? '';

  // Eliminar cualquier carácter que no sea número
  valor = valor.replace(/\D/g, '');

  // Permitir máximo 8 dígitos
  valor = valor.substring(0, 8);

  // Agregar el guion automáticamente
  if (valor.length > 4) {
    valor = `${valor.substring(0, 4)}-${valor.substring(4)}`;
  }

  control?.setValue(valor, {
    emitEvent: false
  });
}

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
