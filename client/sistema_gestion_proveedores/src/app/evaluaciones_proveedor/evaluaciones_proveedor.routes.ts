import { Routes } from '@angular/router';
import { EvaluacionesProveedorAllComponent } from './evaluaciones-proveedor-all/evaluaciones-proveedor-all.component';
import { EvaluacionesProveedorDetail } from './evaluaciones-proveedor-detail/evaluaciones-proveedor-detail';
import { EvaluacionesProveedorForm } from './evaluaciones-proveedor-form/evaluaciones-proveedor-form';
import { authGuard } from '../shared/auth.guard';

export const evaluaciones_proveedor_routes: Routes = [
  {
    path: '',
    component: EvaluacionesProveedorAllComponent,
    pathMatch: 'full'
  },
  {
    path: 'detail/:id',
    component: EvaluacionesProveedorDetail
  },
  {
  path: 'create',
  component: EvaluacionesProveedorForm,
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
  component: EvaluacionesProveedorForm,
  canActivate: [authGuard],
  data: {
    roles: [
      'ADMINISTRADOR',
      'COMPRAS'
    ]
  }
}
];