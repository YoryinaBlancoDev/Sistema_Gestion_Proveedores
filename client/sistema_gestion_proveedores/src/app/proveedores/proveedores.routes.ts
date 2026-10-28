import { Routes } from '@angular/router';
import { ProveedoresAllComponent } from './proveedores-all/proveedores-all.component';
import { ProveedoresDetail } from './proveedores-detail/proveedores-detail';
import { ProveedoresCreate } from './proveedores-create/proveedores-create';
import { authGuard } from '../shared/auth.guard';

export const proveedores_routes: Routes = [
  {
    path: '',
    component: ProveedoresAllComponent,
    canActivate: [authGuard],
    pathMatch: 'full'
  },
  {
    path: 'detail/:id',
    component: ProveedoresDetail,
    canActivate: [authGuard]
  },
  {
  path: 'create',
  component: ProveedoresCreate,
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
  component: ProveedoresCreate,
  canActivate: [authGuard],
    data: {
      roles: [
        'ADMINISTRADOR',
        'COMPRAS'
      ]
    }
}
];