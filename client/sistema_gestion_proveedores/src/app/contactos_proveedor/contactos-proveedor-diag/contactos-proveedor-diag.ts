import { Component,Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogModule
} from '@angular/material/dialog';

interface ContactoDetalle {
  id_contacto: number;
  proveedor_id: number;
  nombre: string;
  apellido: string;
  puesto: string | null;
  telefono: string | null;
  correo: string | null;
  es_principal: boolean;

  proveedor: {
    id_proveedor: number;
    nombre_empresa: string;
  };
}


@Component({
  selector: 'app-contactos-proveedor-diag',
  imports: [MatDialogModule,MatButtonModule],
  templateUrl: './contactos-proveedor-diag.html',
  styleUrl: './contactos-proveedor-diag.css',
})
export class ContactosProveedorDiag {
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: ContactoDetalle
  ) {}
}
