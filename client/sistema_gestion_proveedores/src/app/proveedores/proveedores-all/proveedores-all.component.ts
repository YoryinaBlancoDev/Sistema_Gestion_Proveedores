import {
  AfterViewInit,
  Component,
  OnDestroy,
  ViewChild
} from '@angular/core';

import { Router, RouterLink } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

import {
  MatTableDataSource,
  MatTableModule
} from '@angular/material/table';

import {
  MatPaginator,
  MatPaginatorModule
} from '@angular/material/paginator';

import {
  MatSort,
  MatSortModule
} from '@angular/material/sort';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { GenericService } from '../../shared/generic';
import { AuthenticationService } from '../../shared/authentication.service';

interface Proveedor {
  id_proveedor: number;
  categoria_id: number;
  nombre_empresa: string;
  cedula_juridica: string | null;
  telefono: string | null;
  correo: string | null;
  direccion: string | null;
  estado: 'ACTIVO' | 'EN_EVALUACION' | 'SUSPENDIDO';
  fecha_registro: string;

  categoria: {
    id_categoria: number;
    nombre: string;
  };
}

@Component({
  selector: 'app-proveedores-all',

  imports: [
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatFormFieldModule,
    MatInputModule,
    RouterLink
  ],

  templateUrl: './proveedores-all.component.html',
  styleUrl: './proveedores-all.component.css'
})
export class ProveedoresAllComponent
  implements AfterViewInit, OnDestroy {

  private destroy$ = new Subject<void>();

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

  @ViewChild(MatSort)
  sort!: MatSort;

  dataSource = new MatTableDataSource<Proveedor>([]);

  displayedColumns: string[] = [
    'nombre_empresa',
    'categoria',
    'acciones'
  ];

  constructor(
    private router: Router,
    private gService: GenericService,
    private authService: AuthenticationService
  ) {}

    get usuarioActual() {
      return this.authService.currentUserValue;
    }

    get puedeModificar(): boolean {
      return (
        this.usuarioActual?.rol === 'ADMINISTRADOR' ||
        this.usuarioActual?.rol === 'COMPRAS'
      );
    }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    
    //Ordenar tabla
    this.dataSource.sortingDataAccessor = (
    item: Proveedor,
    property: string
  ): string | number => {

    switch (property) {

      case 'nombre_empresa':
        return item.nombre_empresa
          ?.toLowerCase() ?? '';

      case 'categoria':
        return item.categoria
          ?.nombre
          ?.toLowerCase() ?? '';

      default:
        return '';
    }
  };

    // =========================
  // FILTRO
  // =========================

  this.dataSource.filterPredicate = (
    data: Proveedor,
    filter: string
  ): boolean => {

    const texto = `
      ${data.nombre_empresa ?? ''}
      ${data.cedula_juridica ?? ''}
      ${data.telefono ?? ''}
      ${data.correo ?? ''}
      ${data.direccion ?? ''}
      ${data.estado ?? ''}
      ${data.categoria?.nombre ?? ''}
    `.toLowerCase();

    return texto.includes(filter);

  };

    this.listaProveedores();
  }

  listaProveedores(): void {
    this.gService
      .list<Proveedor>('proveedores')
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          console.log('PROVEEDORES RECIBIDOS:', data);

          this.dataSource.data = data;
        },

        error: (error) => {
          console.error(
            'Error al cargar proveedores:',
            error
          );
        }
      });
  }

  detalle(id: number): void {
    this.router.navigate([
      '/proveedores/detail',
      id
    ]);
  }

  actualizarProveedor(id: number): void {
    this.router.navigate([
      '/proveedores/update',
      id
    ]);
  }

  crearProveedor(): void {
    this.router.navigate([
      '/proveedores/create'
    ]);
  }

  aplicarFiltro(event: Event): void {

  const valor =
    (event.target as HTMLInputElement).value;

  this.dataSource.filter =
    valor.trim().toLowerCase();

  if (this.dataSource.paginator) {
    this.dataSource.paginator.firstPage();
  }

}

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}