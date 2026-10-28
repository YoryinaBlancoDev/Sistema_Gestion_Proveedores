import dotEnv from "dotenv";
import express from "express";
import cors from "cors";
import logger from "morgan";

import { PrismaClient } from "./generated/prisma/client.ts";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

dotEnv.config();

const app = express();

const adapter = new PrismaMariaDb({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

const prism = new PrismaClient({
  adapter,
});

//---Archivos de rutas---
import categoriaProveedorRoutes from "./routes/categoriaProveedorRoutes.js";
import contactoProveedorRoutes from "./routes/contactoProveedorRoutes.js";
import evaluacionProveedorRoutes from "./routes/evaluacionProveedorRoutes.js";
import proveedorRoutes from "./routes/proveedorRoutes.js";
import usuarioRoutes from "./routes/usuarioRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";

const port = process.env.PORT || 3000;

app.use(cors());
app.use(logger("dev"));

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  })
);

//---- Definir rutas ----
app.use("/categoriaProveedor/", categoriaProveedorRoutes);
app.use("/contactoProveedor/", contactoProveedorRoutes);
app.use("/evaluacionProveedor/", evaluacionProveedorRoutes);
app.use("/proveedores/", proveedorRoutes);
app.use("/usuario/", usuarioRoutes);
app.use("/dashboard",dashboardRoutes);

app.listen(port, () => {
  console.log(`http://localhost:${port}`);
  console.log("Presione CTRL-C para detenerlo\n");
});