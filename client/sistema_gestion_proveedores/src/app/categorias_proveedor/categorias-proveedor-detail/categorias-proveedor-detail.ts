import {
  Component,
  OnDestroy,
  OnInit,
  signal
} from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { GenericService } from '../../shared/generic';


interface CategoriaProveedor {
  id_categoria: number;
  nombre: string;
  descripcion: string | null;
}


@Component({
  selector: 'app-categorias-proveedor-detail',

  imports: [
    MatCardModule,
    MatButtonModule,
    MatIconModule
  ],

  templateUrl: './categorias-proveedor-detail.html',
  styleUrl: './categorias-proveedor-detail.css'
})
export class CategoriasProveedorDetail
  implements OnInit, OnDestroy {

  private destroy$ = new Subject<void>();

  categoria =
    signal<CategoriaProveedor | null>(null);


  constructor(
    private gService: GenericService,
    private route: ActivatedRoute,
    private router: Router
  ) {}


  ngOnInit(): void {

    const id =
      this.route.snapshot.paramMap.get('id');

    if (!id) {
      this.router.navigate(['/categorias']);
      return;
    }

    this.cargarCategoria(Number(id));
  }


  cargarCategoria(id: number): void {

    

    this.gService
      .get<CategoriaProveedor>(
        'categoriaProveedor',
        id
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe({

        next: (categoria) => {
          this.categoria.set(categoria);
        },

        error: (error) => {

          console.error(
            'Error al obtener categoría:',
            error
          );

          if (error.status === 404) {
            this.router.navigate(['/categorias']);
          }

        }

      });

  }





  regresar(): void {
    this.router.navigate(['/categorias']);
  }


  ngOnDestroy(): void {

    this.destroy$.next();
    this.destroy$.complete();

  }

}