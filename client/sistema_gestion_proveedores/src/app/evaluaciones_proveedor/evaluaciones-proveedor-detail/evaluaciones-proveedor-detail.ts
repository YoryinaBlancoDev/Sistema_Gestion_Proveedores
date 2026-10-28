import { Component, OnDestroy, OnInit,signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { DatePipe } from '@angular/common';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

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
  selector: 'app-evaluaciones-proveedor-detail',
  imports: [MatCardModule,
    MatButtonModule,
    MatIconModule, DatePipe],
  templateUrl: './evaluaciones-proveedor-detail.html',
  styleUrl: './evaluaciones-proveedor-detail.css',
})
export class EvaluacionesProveedorDetail implements OnInit,OnDestroy{
  evaluacion= signal<Evaluaciones_proveedor | null>(null);
  
    private destroy$ = new Subject<void>();
  
    constructor(
      private route: ActivatedRoute,
      private router: Router,
      private gService: GenericService
    ) {}
  
    ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
  
    console.log('ID de la URL:', id);
  
    if (!id) {
      this.router.navigate(['/evaluaciones']);
      return;
    }
  
    this.cargarEvaluacion(id);
  }
  
    cargarEvaluacion(id: number): void {
    console.log('ID recibido:', id);
  
    this.gService
      .get<Evaluaciones_proveedor>('evaluacionProveedor', id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          console.log('DETALLE RECIBIDO:', data);
  
          this.evaluacion.set(data);
  
          console.log('EVALUACION ASIGNADO:', this.evaluacion);
        },
  
        error: (error) => {
          console.error('ERROR AL OBTENER EVALUACION:', error);
        }
      });
  }
  
  
  
    regresar(): void {
      this.router.navigate(['/evaluaciones']);
    }
  
    ngOnDestroy(): void {
      this.destroy$.next();
      this.destroy$.complete();
    }
}
