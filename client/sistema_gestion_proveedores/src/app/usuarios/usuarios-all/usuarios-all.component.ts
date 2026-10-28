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
  selector: 'app-usuarios-all',
  templateUrl: './usuarios-all.component.html',
  styleUrl: './usuarios-all.component.css',
  imports: [MatTableModule,
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
export class UsuariosAllComponent implements AfterViewInit, OnDestroy {
  private destroy$ = new Subject<void>();
  
    @ViewChild(MatPaginator)
    paginator!: MatPaginator;
  
    @ViewChild(MatSort)
    sort!: MatSort;
  
    dataSource = new MatTableDataSource<Usuario>([]);
  
    displayedColumns: string[] = [
      'nombre',
      'apellido',
      'acciones'
    ];
  
    constructor(
      private router: Router,
      private gService: GenericService
    ) {}
  
    ngAfterViewInit(): void {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;

      this.dataSource.filterPredicate = (
      data: Usuario,
      filter: string
    ): boolean => {

      const texto = `
        ${data.nombre ?? ''}
        ${data.apellido ?? ''}
        ${data.correo ?? ''}
        ${data.rol ?? ''}
        ${data.activo ? 'activo' : 'inactivo'}
      `.toLowerCase();

      return texto.includes(filter);
    };
  
      this.listaUsuarios();
    }
  
    listaUsuarios(): void {
      this.gService
        .list<Usuario>('usuario')
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (data) => {
            console.log('USUARIOS RECIBIDOS:', data);
  
            this.dataSource.data = data;
          },
  
          error: (error) => {
            console.error(
              'Error al cargar usuarios:',
              error
            );
          }
        });
    }
  
    detalle(id: number): void {
      this.router.navigate([
        '/usuarios/detail',
        id
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
