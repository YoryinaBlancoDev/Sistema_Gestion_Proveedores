import express from "express";
const router=express.Router(); 
//Controlador con las acciones de las rutas 
import proveedorController from"../controllers/proveedorController.js";
import verificarToken from "../middlewares/authMiddleware.js"; 
//Rutas de proveedor
router.get("/",verificarToken,proveedorController.get); 
router.get("/:id",verificarToken,proveedorController.getById);
router.post("/", verificarToken,proveedorController.create);
router.put("/:id", verificarToken,proveedorController.update);
export default router;