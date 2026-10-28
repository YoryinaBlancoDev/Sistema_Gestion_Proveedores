import { Routes } from '@angular/router';
import { ContactosProveedorAllComponent } from './contactos-proveedor-all/contactos-proveedor-all.component';
import { ContactosProveedorForm } from './contactos-proveedor-form/contactos-proveedor-form';
import { authGuard } from '../shared/auth.guard';

export const contactos_proveedor_routes: Routes = [
  {
    path: '',
    component: ContactosProveedorAllComponent,
    pathMatch: 'full'
  },
  {
  path: 'create',
  component: ContactosProveedorForm,
  canActivate: [authGuard],
  data: {
      roles: [
        'ADMINISTRADOR',
        'COMPRAS'
      ]
    }
},
{
  path: 'update/:id',
  component: ContactosProveedorForm,
  canActivate: [authGuard],
    data: {
      roles: [
        'ADMINISTRADOR',
        'COMPRAS'
      ]
    }
}
];