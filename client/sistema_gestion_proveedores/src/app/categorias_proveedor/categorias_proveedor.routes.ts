import { Routes } from '@angular/router';

import { CategoriasProveedorAll } from './categorias-proveedor-all/categorias-proveedor-all';
import { CategoriasProveedorForm } from './categorias-proveedor-form/categorias-proveedor-form';
import { CategoriasProveedorDetail } from './categorias-proveedor-detail/categorias-proveedor-detail';

import { authGuard } from '../shared/auth.guard';


export const categorias_proveedor_routes: Routes = [

  {
    path: '',
    component: CategoriasProveedorAll,
    canActivate: [authGuard],
    data: {
      roles: ['ADMINISTRADOR']
    }
  },

  {
    path: 'create',
    component: CategoriasProveedorForm,
    canActivate: [authGuard],
    data: {
      roles: ['ADMINISTRADOR']
    }
  },

  {
    path: 'update/:id',
    component: CategoriasProveedorForm,
    canActivate: [authGuard],
    data: {
      roles: ['ADMINISTRADOR']
    }
  },

  {
    path: 'detail/:id',
    component: CategoriasProveedorDetail,
    canActivate: [authGuard],
    data: {
      roles: ['ADMINISTRADOR']
    }
  }

];