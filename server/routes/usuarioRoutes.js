import express from "express";
const router=express.Router(); 
//Controlador con las acciones de las rutas 
import usuarioController from "../controllers/usuarioController.js"; 
import verificarToken from "../middlewares/authMiddleware.js"; 

// =========================
// RUTAS PÚBLICAS
// =========================

router.post(
  "/registrar",
  usuarioController.register
);

router.post(
  "/login",
  usuarioController.login
);


// =========================
// PERFIL DEL USUARIO ACTUAL
// =========================

router.get(
  "/perfil",
  verificarToken,
  usuarioController.getPerfil
);

router.put(
  "/perfil",
  verificarToken,
  usuarioController.updatePerfil
);


// =========================
// ADMINISTRACIÓN DE USUARIOS
// =========================

router.get(
  "/",
  verificarToken,
  usuarioController.get
);

router.post(
  "/",
  verificarToken,
  usuarioController.create
);

router.get(
  "/:id",
  verificarToken,
  usuarioController.getById
);

router.put(
  "/:id",
  verificarToken,
  usuarioController.update
);


export default router;