import { Component, OnDestroy, OnInit,signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { DatePipe } from '@angular/common';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { GenericService } from '../../shared/generic';

interface ProveedorDetalle {
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
  selector: 'app-proveedores-detail',
  imports: [ MatCardModule,
    MatButtonModule,
    MatIconModule, DatePipe],
  templateUrl: './proveedores-detail.html',
  styleUrl: './proveedores-detail.css',
})
export class ProveedoresDetail implements OnInit, OnDestroy {
  proveedor= signal<ProveedorDetalle | null>(null);

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
    this.router.navigate(['/proveedores']);
    return;
  }

  this.cargarProveedor(id);
}

  cargarProveedor(id: number): void {
  console.log('ID recibido:', id);

  this.gService
    .get<ProveedorDetalle>('proveedores', id)
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (data) => {
        console.log('DETALLE RECIBIDO:', data);

        this.proveedor.set(data);

        console.log('PROVEEDOR ASIGNADO:', this.proveedor);
      },

      error: (error) => {
        console.error('ERROR AL OBTENER PROVEEDOR:', error);
      }
    });
}

formatearEstado(estado: string): string {
  const estados: Record<string, string> = {
    ACTIVO: 'Activo',
    EN_EVALUACION: 'En evaluación',
    SUSPENDIDO: 'Suspendido'
  };

  return estados[estado] ?? estado;
}

  regresar(): void {
    this.router.navigate(['/proveedores']);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
