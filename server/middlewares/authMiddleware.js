import jwt from "jsonwebtoken";
import prisma from "../config/prisma.js";

const verificarToken = async(request, response, next) => {

  const authorization = request.headers.authorization;

  if (!authorization) {
    return response.status(401).json({
      message: "Token de autenticación requerido."
    });
  }

  const partes = authorization.split(" ");

  if (
    partes.length !== 2 ||
    partes[0] !== "Bearer"||
    !partes[1]
  ) {
    return response.status(401).json({
      message: "Formato de token inválido."
    });
  }

  //const token = partes[1];

  try {

    const decoded = jwt.verify(
      partes[1],
      process.env.JWT_SECRET,
       { algorithms: ["HS256"] }
    );

    //request.user = decoded;
    if (
      typeof decoded === "string" ||
      typeof decoded.id_usuario !== "number"
    ) {
      return response.status(401).json({
        message: "Token inválido.",
      });
    }

    const usuario = await prisma.usuario.findUnique({
      where: {
        id_usuario: decoded.id_usuario,
      },
      select: {
        id_usuario: true,
        rol: true,
        activo: true,
      },
    });

    if (!usuario || !usuario.activo) {
      return response.status(401).json({
        message: "La cuenta no existe o está desactivada.",
      });
    }
    request.user = {
      id_usuario: usuario.id_usuario,
      rol: usuario.rol,
    };

    next();

  } catch (error) {

     if (error.name === "JsonWebTokenError" ||
        error.name === "TokenExpiredError" ||
        error.name === "NotBeforeError") {
      return response.status(401).json({
        message: "Token inválido o expirado.",
      });
  }
   console.error("Error al verificar la autenticación:", error);

    return response.status(500).json({
      message: "Error interno al verificar la autenticación.",
    });
  }

};

export default verificarToken;