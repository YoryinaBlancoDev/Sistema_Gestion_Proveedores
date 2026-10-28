import {
  AfterViewInit,
  Component,
  OnDestroy,
  ViewChild
} from '@angular/core';

import { Router } from '@angular/router';
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
import { AuthenticationService } from '../../shared/authentication.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { GenericService } from '../../shared/generic';

interface Evaluaciones_proveedor {
  id_evaluacion: number;
  proveedor_id: number;
  usuario_id: number;
  calificacion: number;
  comentario: string| null;
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

@Component({
  selector: 'app-evaluaciones-proveedor-all',
  templateUrl: './evaluaciones-proveedor-all.component.html',
  styleUrl: './evaluaciones-proveedor-all.component.css',
  imports: [ MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatFormFieldModule,
    MatInputModule],
})
export class EvaluacionesProveedorAllComponent implements AfterViewInit,OnDestroy {
  private destroy$ = new Subject<void>();
    
      @ViewChild(MatPaginator)
      paginator!: MatPaginator;
    
      @ViewChild(MatSort)
      sort!: MatSort;
    
      dataSource = new MatTableDataSource<Evaluaciones_proveedor>([]);
    
      displayedColumns: string[] = [
        'proveedor',
        'usuario',
        'calificacion',
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

  this.dataSource.sortingDataAccessor = (
    item: Evaluaciones_proveedor,
    property: string
  ): string | number => {

    switch (property) {

      case 'proveedor':
        return item.proveedor.nombre_empresa.toLowerCase();

      case 'usuario':
        return (
          item.usuario.nombre +
          ' ' +
          item.usuario.apellido
        ).toLowerCase();

      case 'calificacion':
        return Number(item.calificacion);

      default:
        return '';
    }
  };

  this.dataSource.sort = this.sort;

  // =========================
  // FILTRO
  // =========================

  this.dataSource.filterPredicate = (
    data: Evaluaciones_proveedor,
    filter: string
  ): boolean => {

    const texto = `
      ${data.proveedor?.nombre_empresa ?? ''}
      ${data.usuario?.nombre ?? ''}
      ${data.usuario?.apellido ?? ''}
      ${data.calificacion ?? ''}
      ${data.comentario ?? ''}
    `.toLowerCase();

    return texto.includes(filter);

  };

  this.listaEvaluaciones();
}
    
      listaEvaluaciones(): void {
        this.gService
          .list<Evaluaciones_proveedor>('evaluacionProveedor')
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: (data) => {
              console.log('EVALUACIONES RECIBIDAS:', data);
    
              this.dataSource.data = data;
              
            },
    
            error: (error) => {
              console.error(
                'Error al cargar evaluaciones:',
                error
              );
            }
          });
      }
    
      detalle(id: number): void {
    this.router.navigate([
      '/evaluaciones/detail',
      id
    ]);
  }
    
      actualizarEvaluacion(id: number): void {
        this.router.navigate([
          '/evaluaciones/update',
          id
        ]);
      }
    
      crearEvaluacion(): void {
        this.router.navigate([
          '/evaluaciones/create'
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
