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
import { MatDialog } from '@angular/material/dialog';
import { ContactosProveedorDiag } from '../contactos-proveedor-diag/contactos-proveedor-diag';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { GenericService } from '../../shared/generic';
import { AuthenticationService } from '../../shared/authentication.service';

interface Contactos_proveedor {
  id_contacto: number;
  proveedor_id: number;
  nombre: string;
  apellido: string;
  puesto: string|null;
  telefono: string | null;
  correo: string | null;
  es_principal: boolean;

   proveedor: {
    id_proveedor: number;
    nombre_empresa: string;
  };
}

@Component({
  selector: 'app-contactos-proveedor-all',
  templateUrl: './contactos-proveedor-all.component.html',
  styleUrl: './contactos-proveedor-all.component.css',
  imports: [ MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatFormFieldModule,
    MatInputModule,
    RouterLink],
})
export class ContactosProveedorAllComponent implements AfterViewInit, OnDestroy  {
  private destroy$ = new Subject<void>();
  
    @ViewChild(MatPaginator)
    paginator!: MatPaginator;
  
    @ViewChild(MatSort)
    sort!: MatSort;
  
    dataSource = new MatTableDataSource<Contactos_proveedor>([]);
  
    displayedColumns: string[] = [
      'nombre',
      'apellido',
      'proveedor',
      'acciones'
    ];
  
    constructor(
      private router: Router,
      private gService: GenericService,
      private dialog:MatDialog,
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

      //ordenar tabla
      this.dataSource.sortingDataAccessor = (
        item: Contactos_proveedor,
        property: string
      ): string | number => {

        switch (property) {

          case 'nombre':
            return item.nombre
              ?.toLowerCase() ?? '';

          case 'apellido':
            return item.apellido
              ?.toLowerCase() ?? '';

          case 'proveedor':
            return item.proveedor
              ?.nombre_empresa
              ?.toLowerCase() ?? '';

          default:
            return (item as any)[property] ?? '';
        }
      };

      this.dataSource.filterPredicate = (
        data: Contactos_proveedor,
        filter: string
      ): boolean => {

        const texto = `
          ${data.nombre ?? ''}
          ${data.apellido ?? ''}
          ${data.puesto ?? ''}
          ${data.telefono ?? ''}
          ${data.correo ?? ''}
          ${data.proveedor?.nombre_empresa ?? ''}
          ${data.es_principal ? 'principal' : ''}
        `.toLowerCase();

        return texto.includes(filter);

      };
  
      this.listaContactos();
    }
  
    listaContactos(): void {
      this.gService
        .list<Contactos_proveedor>('contactoProveedor')
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (data) => {
            console.log('CONTACTOS RECIBIDOS:', data);
  
            this.dataSource.data = data;
          },
  
          error: (error) => {
            console.error(
              'Error al cargar contactos:',
              error
            );
          }
        });
    }
  
    detalle(contacto: Contactos_proveedor): void {
    this.dialog.open(ContactosProveedorDiag, {
    width: '600px',
    data: contacto
  });
}
  
    actualizarContacto(id: number): void {
      this.router.navigate([
        '/contactos/update',
        id
      ]);
    }
  
    crearContacto(): void {
      this.router.navigate([
        '/contactos/create'
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
