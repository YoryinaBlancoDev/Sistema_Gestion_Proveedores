import express from "express";

import dashboardController
  from "../controllers/dashboardController.js";

import verificarToken from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get(
  "/resumen",
  verificarToken,
  dashboardController.resumen
);

export default router;