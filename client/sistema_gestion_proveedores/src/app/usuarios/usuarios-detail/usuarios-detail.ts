import { Component, OnDestroy, OnInit,signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { DatePipe } from '@angular/common';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { GenericService } from '../../shared/generic';

interface UsuarioDetalle {
  id_usuario: number;
  nombre: string;
  apellido: string;
  correo: string;
  rol: 'ADMINISTRADOR' | 'COMPRAS' | 'CONSULTA';
  activo: boolean;
  fecha_registro: string;
}

@Component({
  selector: 'app-usuarios-detail',
  imports: [MatCardModule,
    MatButtonModule,
    MatIconModule, DatePipe],
  templateUrl: './usuarios-detail.html',
  styleUrl: './usuarios-detail.css',
})
export class UsuariosDetail implements OnInit, OnDestroy{
  usuario= signal<UsuarioDetalle | null>(null);
  
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
      this.router.navigate(['/usuario']);
      return;
    }
  
    this.cargarUsuario(id);
  }
  
    cargarUsuario(id: number): void {
    console.log('ID recibido:', id);
  
    this.gService
      .get<UsuarioDetalle>('usuario', id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          console.log('DETALLE RECIBIDO:', data);
  
          this.usuario.set(data);
  
          console.log('USUARIO ASIGNADO:', this.usuario);
        },
  
        error: (error) => {
          console.error('ERROR AL OBTENER USUARIO:', error);
        }
      });
  }
  
  formatearRol(rol: string): string {
    const roles: Record<string, string> = {
      ADMINISTRADOR: 'Administrador',
      CONSULTA: 'Consulta',
      COMPRAS: 'Compras'
    };
  
    return roles[rol] ?? rol;
  }
  
    regresar(): void {
      this.router.navigate(['/usuarios']);
    }
  
    ngOnDestroy(): void {
      this.destroy$.next();
      this.destroy$.complete();
    }
}
