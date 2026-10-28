import express from "express";
const router=express.Router(); 
//Controlador con las acciones de las rutas 
import categoriaProveedorController from "../controllers/categoriaProveedorController.js"; 
import verificarToken from "../middlewares/authMiddleware.js"; 
//Rutas de categorias
router.get("/",verificarToken,categoriaProveedorController.get); 
router.get("/:id",verificarToken,categoriaProveedorController.getById); 
router.post("/",verificarToken, categoriaProveedorController.create);
router.put("/:id",verificarToken, categoriaProveedorController.update);
export default router;