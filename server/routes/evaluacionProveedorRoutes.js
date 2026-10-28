import express from "express";
const router=express.Router(); 
//Controlador con las acciones de las rutas 
import evaluacionProveedorController from "../controllers/evaluacionProveedorController.js"; 
import verificarToken from "../middlewares/authMiddleware.js";
//Rutas de evaluacion
router.get("/",verificarToken,evaluacionProveedorController.get); 
router.get("/:id",verificarToken,evaluacionProveedorController.getById);
router.post("/",verificarToken, evaluacionProveedorController.create);
router.put("/:id",verificarToken, evaluacionProveedorController.update);  
export default router;