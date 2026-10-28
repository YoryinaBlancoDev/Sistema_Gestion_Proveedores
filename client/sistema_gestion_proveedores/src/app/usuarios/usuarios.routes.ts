import { Routes } from '@angular/router';
import { UsuariosAllComponent } from './usuarios-all/usuarios-all.component';
import { UsuariosDetail } from './usuarios-detail/usuarios-detail';
import { UsuariosCreate } from './usuarios-create/usuarios-create';
import { authGuard } from '../shared/auth.guard';
import { UsuarioPerfil } from './usuario-perfil/usuario-perfil';

export const usuarios_routes: Routes = [
  {
    path: '',
    component: UsuariosAllComponent,
    canActivate: [authGuard],
    data: {
      roles: ['ADMINISTRADOR']
    },
    pathMatch: 'full'
  },
  {
    path: 'detail/:id',
    component: UsuariosDetail,
    canActivate: [authGuard],
    data: {
      roles: ['ADMINISTRADOR']
    }
  },
  {
  path: 'create',
  component: UsuariosCreate,
  canActivate: [authGuard],
    data: {
      roles: ['ADMINISTRADOR']
    }
},
{
  path: 'update/:id',
  component: UsuariosCreate,
  canActivate: [authGuard],
    data: {
      roles: ['ADMINISTRADOR']
    }
},
{
    path: 'perfil',
    component: UsuarioPerfil,
    canActivate: [authGuard]
  }
];