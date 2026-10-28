//Ejecutar seed npx prisma db seed

import "dotenv/config";
import { PrismaClient } from "../../generated/prisma/client.js";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import bcrypt from "bcrypt";
const passwordAdmin = await bcrypt.hash("Admin123", 10);
const passwordCompras = await bcrypt.hash("Compras123", 10);
const passwordConsulta = await bcrypt.hash("Consulta123", 10);




const adapter = new PrismaMariaDb({
  host: process.env.DB_HOST!,
  port: Number(process.env.DB_PORT!),
  user: process.env.DB_USER!,
  password: process.env.DB_PASSWORD!,
  database: process.env.DB_NAME!,
});

const prisma = new PrismaClient({
  adapter,
});

async function main() {
  console.log("🌱 Iniciando seed...");

  // ==========================================
  // 1. CATEGORÍAS DE PROVEEDORES
  // ==========================================

  const categorias  = await Promise.all([
    prisma.categoriaProveedor.upsert({
      where: {
        nombre: "Tecnología",
      },
      update: {},
      create: {
        nombre: "Tecnología",
        descripcion: "Proveedores de equipos y servicios tecnológicos",
      },
    }),

    prisma.categoriaProveedor.upsert({
      where: {
        nombre: "Oficina",
      },
      update: {},
      create: {
        nombre: "Oficina",
        descripcion: "Proveedores de suministros y mobiliario de oficina",
      },
    }),

    prisma.categoriaProveedor.upsert({
      where: {
        nombre: "Limpieza",
      },
      update: {},
      create: {
        nombre: "Limpieza",
        descripcion: "Proveedores de productos y servicios de limpieza",
      },
    }),

    prisma.categoriaProveedor.upsert({
      where: {
        nombre: "Servicios profesionales",
      },
      update: {},
      create: {
        nombre: "Servicios profesionales",
        descripcion: "Proveedores de servicios profesionales y consultoría",
      },
    }),
  ]);

  console.log(`✓ ${categorias.length} categorías creadas`);

  // ==========================================
  // 2. USUARIOS
  // ==========================================

  const usuarios = await Promise.all([
    prisma.usuario.upsert({
      where: {
        correo: "admin@sistema.com",
      },
      update: {},
      create: {
        nombre: "Administrador",
        apellido: "Sistema",
        correo: "admin@sistema.com",
        password: passwordAdmin,
        rol: "ADMINISTRADOR",
        activo: true,
      },
    }),

    prisma.usuario.upsert({
      where: {
        correo: "compras@sistema.com",
      },
      update: {},
      create: {
        nombre: "María",
        apellido: "González",
        correo: "compras@sistema.com",
        password: passwordCompras,
        rol: "COMPRAS",
        activo: true,
      },
    }),

    prisma.usuario.upsert({
      where: {
        correo: "consulta@sistema.com",
      },
      update: {},
      create: {
        nombre: "Carlos",
        apellido: "Rodríguez",
        correo: "consulta@sistema.com",
        password: passwordConsulta,
        rol: "CONSULTA",
        activo: true,
      },
    }),
  ]);

  console.log(`✓ ${usuarios.length} usuarios creados`);

  // ==========================================
  // 3. PROVEEDORES
  // ==========================================

  

  const tecnologia = categorias.find(
  (categoria) => categoria.nombre === "Tecnología"
);

if (!tecnologia) {
  throw new Error("No se encontró la categoría Tecnología");
}

  const oficina = categorias.find(
  (categoria) => categoria.nombre === "Oficina"
);

if (!oficina) {
  throw new Error("No se encontró la categoría Oficina");
}

const limpieza = categorias.find(
  (categoria) => categoria.nombre === "Limpieza"
);

if (!limpieza) {
  throw new Error("No se encontró la categoría Limpieza");
}

const servicios = categorias.find(
  (categoria) =>
    categoria.nombre === "Servicios profesionales"
);

if (!servicios) {
  throw new Error(
    "No se encontró la categoría Servicios profesionales"
  );
}

 

  const proveedores= await Promise.all([
    prisma.proveedor.upsert({
      where: {
        cedula_juridica: "3101123452",
      },
      update: {},
      create: {
        categoria_id: tecnologia.id_categoria,
        nombre_empresa: "Tech Solutions CR",
        cedula_juridica: "3101123452",
        telefono: "2222-1111",
        correo: "contacto@techsolutions.cr",
        direccion: "San José, Costa Rica",
        estado: "ACTIVO",
      },
    }),

    prisma.proveedor.upsert({
      where: {
        cedula_juridica: "3101123457",
      },
      update: {},
      create: {
        categoria_id: oficina.id_categoria,
        nombre_empresa: "OfiCenter Costa Rica",
        cedula_juridica: "3101123457",
        telefono: "2222-2222",
        correo: "ventas@oficenter.cr",
        direccion: "Heredia, Costa Rica",
        estado: "ACTIVO",
      },
    }),

    prisma.proveedor.upsert({
      where: {
        cedula_juridica: "3101123456",
      },
      update: {},
      create: {
        categoria_id: limpieza.id_categoria,
        nombre_empresa: "Limpieza Total",
        cedula_juridica: "3101123456",
        telefono: "2222-3333",
        correo: "info@limpiezatotal.cr",
        direccion: "Alajuela, Costa Rica",
        estado: "EN_EVALUACION",
      },
    }),

    prisma.proveedor.upsert({
      where: {
        cedula_juridica: "3101126389",
      },
      update: {},
      create: {
        categoria_id: servicios.id_categoria,
        nombre_empresa: "Consultores Asociados CR",
        cedula_juridica: "3101126389",
        telefono: "2222-4444",
        correo: "contacto@consultores.cr",
        direccion: "San José, Costa Rica",
        estado: "ACTIVO",
      },
    }),
  ]);

  console.log(`✓ ${proveedores.length} proveedores creados`);

  // ==========================================
  // 4. CONTACTOS DE PROVEEDORES
  // ==========================================

  const tech = proveedores.find(
    (proveedor) => proveedor.nombre_empresa === "Tech Solutions CR"
  )!;

  const ofi = proveedores.find(
    (proveedor) => proveedor.nombre_empresa === "OfiCenter Costa Rica"
  )!;

  const limpiezaProv = proveedores.find(
    (proveedor) => proveedor.nombre_empresa === "Limpieza Total"
  )!;

  const consultores = proveedores.find((proveedor) => proveedor.nombre_empresa === "Consultores Asociados CR")!;

  await prisma.contactoProveedor.createMany({
    data: [
      {
        proveedor_id: tech.id_proveedor,
        nombre: "Ana",
        apellido: "Pérez",
        puesto: "Gerente de Ventas",
        telefono: "8888-1111",
        correo: "ana.perez@techsolutions.cr",
        es_principal: true,
      },
      {
        proveedor_id: ofi.id_proveedor,
        nombre: "Luis",
        apellido: "Mora",
        puesto: "Ejecutivo Comercial",
        telefono: "8888-2222",
        correo: "luis.mora@oficenter.cr",
        es_principal: true,
      },
      {
        proveedor_id: limpiezaProv.id_proveedor,
        nombre: "Sofía",
        apellido: "Vargas",
        puesto: "Coordinadora",
        telefono: "8888-3333",
        correo: "sofia.vargas@limpiezatotal.cr",
        es_principal: true,
      },
      {
        proveedor_id: consultores.id_proveedor,
        nombre: "Jorge",
        apellido: "Castro",
        puesto: "Director Comercial",
        telefono: "8888-4444",
        correo: "jorge.castro@consultores.cr",
        es_principal: true,
      },
    ],
  });

  console.log("✓ Contactos creados");

  // ==========================================
  // 5. EVALUACIONES
  // ==========================================

  const admin = usuarios.find(
    (usuario) => usuario.correo === "admin@sistema.com"
  )!;

  const compras = usuarios.find(
    (usuario) => usuario.correo === "compras@sistema.com"
  )!;

  await prisma.evaluacionProveedor.createMany({
    data: [
      {
        proveedor_id: tech.id_proveedor,
        usuario_id: admin.id_usuario,
        calificacion: 4.8,
        comentario: "Excelente servicio y cumplimiento en los tiempos de entrega.",
      },
      {
        proveedor_id: tech.id_proveedor,
        usuario_id: compras.id_usuario,
        calificacion: 4.5,
        comentario: "Buena atención y productos de calidad.",
      },
      {
        proveedor_id: ofi.id_proveedor,
        usuario_id: compras.id_usuario,
        calificacion: 4.2,
        comentario: "Buenos precios y variedad de productos.",
      },
      {
        proveedor_id: limpiezaProv.id_proveedor,
        usuario_id: admin.id_usuario,
        calificacion: 3.8,
        comentario: "Proveedor en proceso de evaluación.",
      },
      {
        proveedor_id: consultores.id_proveedor,
        usuario_id: compras.id_usuario,
        calificacion: 4.7,
        comentario: "Servicio profesional y buena comunicación.",
      },
    ],
  });

  console.log("✓ Evaluaciones creadas");

  console.log("🌱 Seed completado correctamente.");
}

main()
  .catch((error) => {
    console.error("❌ Error ejecutando seed:");
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });