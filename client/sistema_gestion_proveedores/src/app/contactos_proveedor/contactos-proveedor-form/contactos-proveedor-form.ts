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
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

import { GenericService } from '../../shared/generic';


interface Proveedor {
  id_proveedor: number;
  nombre_empresa: string;
}


interface ContactoProveedor {
  id_contacto: number;
  proveedor_id: number;
  nombre: string;
  apellido: string;
  puesto: string | null;
  telefono: string | null;
  correo: string | null;
  es_principal: boolean;

  proveedor?: {
    id_proveedor: number;
    nombre_empresa: string;
  };
}


// Datos que se envían al backend
interface ContactoProveedorRequest {
  proveedor_id: number;
  nombre: string;
  apellido: string;
  puesto: string | null;
  telefono: string | null;
  correo: string | null;
  es_principal: boolean;
}


@Component({
  selector: 'app-contactos-proveedor-form',

  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule,
    MatAutocompleteModule
  ],

  templateUrl: './contactos-proveedor-form.html',
  styleUrl: './contactos-proveedor-form.css',
})
export class ContactosProveedorForm
  implements OnInit, OnDestroy {

  private destroy$ = new Subject<void>();

  contactoForm: FormGroup;

  proveedores: Proveedor[] = [];

  proveedoresFiltrados: Proveedor[] = [];

  isCreate = true;

  titleForm = 'Crear';

  idContacto?: number;


  constructor(
    private fb: FormBuilder,
    private gService: GenericService,
    private router: Router,
    private route: ActivatedRoute,
    private toastr: ToastrService
  ) {

    this.contactoForm = this.fb.group({

      // ID real que se envía al backend
      proveedor_id: [
        null,
        Validators.required
      ],

      // Se utiliza únicamente para el autocomplete
      proveedor_busqueda: [
        '',
        Validators.required
      ],

      nombre: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(100)
        ]
      ],

      apellido: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(100)
        ]
      ],

      puesto: [
        '',
        [
          Validators.minLength(3),
          Validators.maxLength(100)
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
          Validators.pattern(
            /^[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+(?:\.[A-Za-z0-9-]+)*\.[A-Za-z]{2,6}$/
          )
        ]
      ],

      es_principal: [
        false
      ]

    });
  }


  ngOnInit(): void {

    // Cargar proveedores para el autocomplete
    this.cargarProveedores();

    // Verificar si estamos creando o actualizando
    const id =
      this.route.snapshot.paramMap.get('id');

    if (id) {

      this.idContacto = Number(id);

      this.isCreate = false;

      this.titleForm = 'Actualizar';

      this.cargarContacto(
        this.idContacto
      );

    }
  }


  // Obtener proveedores
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


  // Filtrar proveedores mientras se escribe
  filtrarProveedores(event: Event): void {

    const valor = (event.target as HTMLInputElement)
    .value
    .trim();

  // Al escribir nuevamente se elimina
  // cualquier proveedor seleccionado anteriormente
  this.contactoForm.patchValue({
    proveedor_id: null
  });

  const controlBusqueda =
    this.contactoForm.get('proveedor_busqueda');

  // Si escribió algo, todavía no ha seleccionado
  // un proveedor válido de la lista
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


  // Guardar el proveedor seleccionado
  seleccionarProveedor(
    proveedor: Proveedor
  ): void {

    this.contactoForm.patchValue({

      proveedor_id:
        proveedor.id_proveedor,

      proveedor_busqueda:
        proveedor.nombre_empresa

    });

    this.contactoForm
    .get('proveedor_busqueda')
    ?.setErrors(null);

  }

 

  // Obtener contacto para actualizar
  cargarContacto(id: number): void {

    this.gService
      .get<ContactoProveedor>(
        'contactoProveedor',
        id
      )
      .pipe(
        takeUntil(this.destroy$)
      )
      .subscribe({

        next: (contacto) => {

          this.contactoForm.patchValue({

            proveedor_id:
              contacto.proveedor_id,

            proveedor_busqueda:
              contacto.proveedor
                ?.nombre_empresa ?? '',

            nombre:
              contacto.nombre,

            apellido:
              contacto.apellido,

            puesto:
              contacto.puesto,

            telefono:
              contacto.telefono,

            correo:
              contacto.correo,

            es_principal:
              contacto.es_principal

          });

        },

        error: (error) => {

          console.error(
            'Error al obtener contacto:',
            error
          );

        }

      });

  }


  guardar(): void {

    if (this.contactoForm.invalid) {

    this.contactoForm.markAllAsTouched();

    if (this.contactoForm.get('proveedor_id')?.invalid) {
      this.toastr.warning(
        'Debe seleccionar un proveedor existente de la lista.',
        'Proveedor no válido'
      );
    }

    return;
  }

  if (this.isCreate) {
    this.crearContacto();
  } else {
    this.actualizarContacto();
  }

  }


  // Crear contacto
  crearContacto(): void {

    const datos: ContactoProveedorRequest = {

      proveedor_id:
        this.contactoForm.value.proveedor_id,

      nombre:
        this.contactoForm.value.nombre,

      apellido:
        this.contactoForm.value.apellido,

      puesto:
        this.contactoForm.value.puesto,

      telefono:
        this.contactoForm.value.telefono,

      correo:
        this.contactoForm.value.correo,

      es_principal:
        this.contactoForm.value.es_principal

    };


    this.gService
      .create<ContactoProveedorRequest>(
        'contactoProveedor',
        datos
      )
      .pipe(
        takeUntil(this.destroy$)
      )
      .subscribe({

        next: () => {

          this.toastr.success(
            'El contacto se registró correctamente.',
            'Contacto creado'
          );

          this.router.navigate([
            '/contactos'
          ]);

        },

        error: (error) => {

          console.error(
            'Error al crear contacto:',
            error
          );

          this.toastr.error(
            'No se pudo registrar el contacto.',
            'Error'
          );

        }

      });

  }


  // Actualizar contacto
  actualizarContacto(): void {

    if (!this.idContacto) {
      return;
    }


    const datos: ContactoProveedorRequest = {

      proveedor_id:
        this.contactoForm.value.proveedor_id,

      nombre:
        this.contactoForm.value.nombre,

      apellido:
        this.contactoForm.value.apellido,

      puesto:
        this.contactoForm.value.puesto,

      telefono:
        this.contactoForm.value.telefono,

      correo:
        this.contactoForm.value.correo,

      es_principal:
        this.contactoForm.value.es_principal

    };


    this.gService
      .update<ContactoProveedorRequest>(
        'contactoProveedor',
        this.idContacto,
        datos
      )
      .pipe(
        takeUntil(this.destroy$)
      )
      .subscribe({

        next: () => {

          this.toastr.success(
            'El contacto se actualizó correctamente.',
            'Contacto actualizado'
          );

          this.router.navigate([
            '/contactos'
          ]);

        },

        error: (error) => {

          console.error(
            'Error al actualizar contacto:',
            error
          );

          this.toastr.error(
            'No se pudo actualizar el contacto.',
            'Error'
          );

        }

      });

  }


  cancelar(): void {

    this.router.navigate([
      '/contactos'
    ]);

  }


  errorHandling(
    control: string,
    error: string
  ): boolean {

    return this.contactoForm
      .get(control)
      ?.hasError(error) ?? false;

  }

   formatearTelefono(event: Event): void {
  const input = event.target as HTMLInputElement;

  // Eliminar todo lo que no sea un número
  let numeros = input.value.replace(/\D/g, '');

  // Máximo 8 números
  numeros = numeros.substring(0, 8);

  // Agregar el guion después de los primeros 4 números
  let telefono = numeros;

  if (numeros.length > 4) {
    telefono =
      numeros.substring(0, 4) +
      '-' +
      numeros.substring(4);
  }

  // Actualizar el formulario
  this.contactoForm
    .get('telefono')
    ?.setValue(telefono, { emitEvent: false });
}


  ngOnDestroy(): void {

    this.destroy$.next();

    this.destroy$.complete();

  }

}