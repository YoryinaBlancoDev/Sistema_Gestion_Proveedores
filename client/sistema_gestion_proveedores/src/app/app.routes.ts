import { Routes } from '@angular/router';
import { UsuariosLogin } from './usuarios/usuarios-login/usuarios-login';
import { DashboardComponent } from './dashboard/dashboard';
import { NotFound } from './core/not-found/not-found';
import { UsuarioPerfil } from './usuarios/usuario-perfil/usuario-perfil';
import { authGuard } from './shared/auth.guard';



export const routes: Routes = [
    {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    component: UsuariosLogin,
     data: { hideHeader: true }
  },
  // Proveedores
  {
    path: 'proveedores',
    loadChildren: () =>
      import('./proveedores/proveedores.routes')
        .then(m => m.proveedores_routes)
  },
  // Usuarios
  {
    path: 'usuarios',
    loadChildren: () =>
      import('./usuarios/usuarios.routes')
        .then(m => m.usuarios_routes)
  },
  // Contactos del proveedor
  {
    path: 'contactos',
    loadChildren: () =>
      import('./contactos_proveedor/contactos_proveedor.routes')
        .then(m => m.contactos_proveedor_routes)
  },
  // Evaluaciones del proveedor
  {
    path: 'evaluaciones',
    loadChildren: () =>
      import('./evaluaciones_proveedor/evaluaciones_proveedor.routes')
        .then(m => m.evaluaciones_proveedor_routes)
  },
  {
  path: 'categorias',
  loadChildren: () =>
    import('./categorias_proveedor/categorias_proveedor.routes')
      .then(m => m.categorias_proveedor_routes),
  canActivate: [authGuard],
  data: {
    roles: ['ADMINISTRADOR']
  }
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
     canActivate: [authGuard]
  },
  // Mi perfil
  {
    path: 'perfil',
    component: UsuarioPerfil,
    canActivate: [authGuard]
  },

  // Página no encontrada
  {
    path: '**',
    component: NotFound,
    data: { hideHeader: true }
  }
];
