# Guía de instalación

Esta guía describe los pasos necesarios para configurar, instalar y ejecutar localmente el Sistema de Gestión de Proveedores.

## 1. Requisitos previos

Antes de instalar el proyecto, asegúrate de contar con las siguientes herramientas:

Node.js: versión 22.19.0.

npm: versión 11.21.1.

MySQL o MariaDB: motor de base de datos compatible con la configuración del proyecto.

Git: para clonar el repositorio.

Tecnologías y versiones del frontend

Angular: 21.2.25.

Angular CLI: 21.2.28.

Angular Material: 21.2.14.

Angular CDK: 21.2.14.

Tecnologías y versiones del backend

Node.js: 22.19.0.

Express: framework para el servidor backend.

Prisma ORM: 7.10.1.

Prisma Client: 7.9.1.

Adaptador MariaDB: 7.10.1.

Se recomienda conservar los archivos package.json y package-lock.json de ambas aplicaciones para mantener las dependencias y facilitar una instalación reproducible.

Nota: las versiones indicadas corresponden a las dependencias instaladas y verificadas durante la preparación de esta guía. Los resultados de npm audit obtenidos en el frontend y el backend reportaron cero vulnerabilidades.

## 2. Clonar el repositorio

Clonar el repositorio y acceder a la carpeta del proyecto:

```bash
git clone https://github.com/YoryinaBlancoDev/Sistema_Gestion_Proveedores.git
cd Sistema_Gestion_Proveedores
```

## 3. Configurar la base de datos

Crear una base de datos llamada `sistema_gestion_proveedores` en MySQL o MariaDB.

Verificar que el servidor de base de datos esté iniciado y que el usuario configurado tenga los permisos necesarios sobre la base de datos.

## 4. Configurar el backend

Desde la raíz del proyecto, acceder a la carpeta del servidor:

```bash
cd server
```

Instalar las dependencias:

```bash
npm install
```

### 4.1. Configurar las variables de entorno

Crear el archivo `.env` a partir de la plantilla `.env.example`.

En Windows PowerShell, ejecutar:

```powershell
Copy-Item .env.example .env
```

Editar el archivo `.env` con los datos correspondientes al entorno local:

```env
DATABASE_URL="mysql://USUARIO:CONTRASEÑA@localhost:3306/sistema_gestion_proveedores"
DB_HOST=localhost
DB_PORT=3306
DB_USER=tu_usuario
DB_PASSWORD=tu_contraseña
DB_NAME=sistema_gestion_proveedores
JWT_SECRET=REEMPLAZAR_POR_UN_SECRETO_SEGURO
```

Reemplazar los valores de ejemplo por las credenciales reales de la base de datos. El secreto JWT debe ser único y seguro.

No compartir ni subir el archivo `.env` al repositorio.

### 4.2. Generar el cliente de Prisma

Ejecutar:

```bash
npx prisma generate
```

### 4.3. Aplicar las migraciones

Ejecutar las migraciones incluidas en el proyecto:

```bash
npx prisma migrate deploy
```

Este comando crea o actualiza las tablas de acuerdo con las migraciones disponibles.

### 4.4. Cargar datos de demostración

Si se desea contar con datos de prueba, ejecutar:

```bash
npx prisma db seed
```

El seed carga categorías, usuarios, proveedores, contactos y evaluaciones de demostración.

**Importante:** el seed utiliza operaciones que pueden duplicar contactos y evaluaciones al ejecutarse varias veces. Se recomienda ejecutarlo una sola vez sobre una base de datos preparada para demostración.

Las cuentas de prueba creadas por el seed son:

| Rol | Correo | Contraseña |
|---|---|---|
| Administrador | `admin@sistema.com` | `Admin123` |
| Compras | `compras@sistema.com` | `Compras123` |
| Consulta | `consulta@sistema.com` | `Consulta123` |

Estas credenciales son exclusivamente para desarrollo y demostración. No deben utilizarse en un entorno de producción.

### 4.5. Iniciar el backend

Desde la carpeta `server`, ejecutar:

```bash
npm run dev
```

Por defecto, el backend estará disponible en:

`http://localhost:3000`

Mantener esta terminal abierta mientras se utiliza la aplicación.

## 5. Configurar el frontend

Abrir una **segunda terminal** y acceder a la carpeta del frontend desde la raíz del proyecto:

```bash
cd client/sistema_gestion_proveedores
```

Instalar las dependencias:

```bash
npm install
```

Iniciar Angular:

```bash
npm start
```

Angular mostrará en la terminal la dirección local en la que estará disponible la aplicación, normalmente:

`http://localhost:4200`

Mantener esta terminal abierta mientras se utiliza la aplicación.

## 6. Configuración de la API

Los archivos de entorno del frontend utilizan la siguiente URL para comunicarse con el backend:

`http://localhost:3000`

Si se modifica el puerto del backend, actualizar también la propiedad `apiURL` en los archivos de entorno correspondientes del frontend.

## 7. Solución de problemas

- **Error de conexión a la base de datos:** verificar que MySQL/MariaDB esté iniciado, que la base de datos exista y que las credenciales del archivo `.env` sean correctas.
- **Error al generar Prisma Client:** comprobar que las dependencias del backend estén instaladas y ejecutar `npx prisma generate` desde la carpeta `server`.
- **Error al aplicar las migraciones:** verificar la conexión a la base de datos y la variable `DATABASE_URL`.
- **Error de autenticación:** comprobar las credenciales utilizadas y verificar que el usuario de prueba exista y esté activo.
- **Error de conexión con la API:** confirmar que el backend esté ejecutándose en el puerto configurado y que `apiURL` coincida con la dirección del servidor.
- **Error al instalar dependencias:** comprobar que Node.js y npm sean compatibles con las versiones utilizadas en el proyecto.
- **Datos de demostración duplicados:** evitar ejecutar repetidamente `npx prisma db seed` sobre la misma base de datos, ya que los contactos y las evaluaciones pueden duplicarse.

