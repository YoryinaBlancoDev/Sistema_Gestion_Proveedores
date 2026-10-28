import jwt from "jsonwebtoken";

const verificarToken = (request, response, next) => {

  const authorization = request.headers.authorization;

  if (!authorization) {
    return response.status(401).json({
      message: "Token de autenticación requerido."
    });
  }

  const partes = authorization.split(" ");

  if (
    partes.length !== 2 ||
    partes[0] !== "Bearer"
  ) {
    return response.status(401).json({
      message: "Formato de token inválido."
    });
  }

  const token = partes[1];

  try {

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    request.user = decoded;

    next();

  } catch (error) {

    return response.status(401).json({
      message: "Token inválido o expirado."
    });

  }
};

export default verificarToken;