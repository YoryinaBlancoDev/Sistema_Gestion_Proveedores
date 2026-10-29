import express from "express";
const router=express.Router(); 
//Controlador con las acciones de las rutas 
import contactoProveedorController from "../controllers/contactoProveedorController.js";
import verificarToken from "../middlewares/authMiddleware.js"; 
//Rutas de contacto
router.get("/", verificarToken, contactoProveedorController.get);
router.get("/:id", verificarToken, contactoProveedorController.getById);
router.post("/", verificarToken, contactoProveedorController.create);
router.put("/:id", verificarToken, contactoProveedorController.update); 
export default router;