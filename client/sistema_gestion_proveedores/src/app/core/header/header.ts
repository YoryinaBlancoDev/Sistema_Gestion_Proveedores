import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

import {
  AuthenticationService
} from '../../shared/authentication.service';

@Component({
  selector: 'app-header',
  imports: [MatButtonModule,
    MatIconModule,
    MatTooltipModule],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  constructor(
    private authService: AuthenticationService,
    private router: Router
  ) {}

  get usuarioActual() {
    return this.authService.currentUserValue;
  }

  get esAdministrador(): boolean {
    return (
      this.usuarioActual?.rol === 'ADMINISTRADOR'
    );
  }

  formatearRol(rol: string): string {
  switch (rol) {
    case 'ADMINISTRADOR':
      return 'Administrador';

    case 'COMPRAS':
      return 'Compras';

    case 'CONSULTA':
      return 'Consulta';

    default:
      return rol;
  }
}

  irA(ruta: string): void {
    this.router.navigate([ruta]);
  }

  cerrarSesion(): void {
    this.authService.logout();

    this.router.navigate([
      '/login'
    ]);
  }
}
