# Sistema de Gestión de Proveedores

Aplicación web para la gestión, administración y evaluación de proveedores, desarrollada como proyecto de software.

## Descripción

El Sistema de Gestión de Proveedores permite centralizar la información de los proveedores, administrar sus contactos, registrar evaluaciones y consultar indicadores generales mediante un dashboard.

El sistema cuenta con control de acceso basado en roles, de manera que cada usuario dispone de funcionalidades según sus permisos.

## Funcionalidades principales

- **Dashboard:** consulta de indicadores generales y estadísticas del sistema.
- **Gestión de proveedores:** registro, consulta, edición y seguimiento del estado de los proveedores.
- **Gestión de categorías:** organización de proveedores por categorías.
- **Gestión de contactos:** administración de los contactos asociados a cada proveedor.
- **Evaluación de proveedores:** registro y consulta de calificaciones y comentarios.
- **Gestión de usuarios:** administración de cuentas y permisos.
- **Mi perfil:** actualización de información personal y contraseña.
- **Autenticación:** inicio de sesión, registro de usuarios y control de acceso.

## Roles de usuario

- **Administrador:** acceso a las funciones administrativas y gestión de usuarios.
- **Compras:** gestión de proveedores, contactos y evaluaciones según sus permisos.
- **Consulta:** acceso de solo lectura a las secciones autorizadas.

## Tecnologías utilizadas

### Frontend
- Angular
- TypeScript
- Angular Material
- HTML y CSS

### Backend
- Node.js
- Express
- TypeScript y JavaScript, según los módulos implementados
- Prisma ORM

### Base de datos
- MySQL/MariaDB

## Estructura del proyecto

- `client/`: aplicación frontend.
- `server/`: API backend y configuración de Prisma.

## Instalación y ejecución

Los requisitos, las variables de entorno, la configuración de la base de datos y los comandos para ejecutar el frontend y el backend se documentarán en la guía de instalación.

## Documentación

Consulta la carpeta `docs/` para encontrar el manual de usuario, la guía de instalación y las capturas de pantalla del sistema.

## Seguridad

Las credenciales y variables de entorno no deben publicarse en el repositorio. Utiliza un archivo `.env.example` con valores de ejemplo para documentar la configuración necesaria.

## Estado del proyecto

Proyecto desarrollado con fines de aprendizaje y portafolio profesional.
