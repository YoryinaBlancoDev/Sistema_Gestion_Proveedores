import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
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

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { GenericService } from '../../shared/generic';


interface CategoriaProveedor {
  id_categoria: number;
  nombre: string;
  descripcion: string | null;
}


@Component({
  selector: 'app-categorias-proveedor-all',

  imports: [
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule
  ],

  templateUrl: './categorias-proveedor-all.html',
  styleUrl: './categorias-proveedor-all.css'
})


export class CategoriasProveedorAll
  implements OnInit, AfterViewInit, OnDestroy {

  private destroy$ = new Subject<void>();


  dataSource =
    new MatTableDataSource<CategoriaProveedor>([]);


  displayedColumns: string[] = [
    'id_categoria',
    'nombre',
    'acciones'
  ];


  @ViewChild(MatPaginator)
  paginator!: MatPaginator;


  @ViewChild(MatSort)
  sort!: MatSort;


  constructor(
    private gService: GenericService,
    private router: Router
  ) {}


  ngOnInit(): void {
    this.listaCategorias();
  }


  ngAfterViewInit(): void {

    this.dataSource.paginator =
      this.paginator;

    this.dataSource.sort =
      this.sort;

  }


  listaCategorias(): void {

    this.gService
      .list<CategoriaProveedor>(
        'categoriaProveedor'
      )
      .pipe(
        takeUntil(this.destroy$)
      )
      .subscribe({

        next: (categorias) => {

          this.dataSource.data =
            categorias;

        },

        error: (error) => {

          console.error(
            'Error al obtener categorías:',
            error
          );

        }

      });

  }


  crear(): void {

    this.router.navigate([
      '/categorias/create'
    ]);

  }


  detalle(id: number): void {

    this.router.navigate([
      '/categorias/detail',
      id
    ]);

  }


  editar(id: number): void {

    this.router.navigate([
      '/categorias/update',
      id
    ]);

  }


  aplicarFiltro(event: Event): void {

    const valor =
      (event.target as HTMLInputElement)
        .value
        .trim()
        .toLowerCase();

    this.dataSource.filter =
      valor;

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }

  }


  ngOnDestroy(): void {

    this.destroy$.next();
    this.destroy$.complete();

  }

}