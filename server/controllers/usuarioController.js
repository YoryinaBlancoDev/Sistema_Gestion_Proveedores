import prisma from "../config/prisma.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Obtener listado
const get = async (request, response, next) => {
  try {

     if (request.user.rol !== "ADMINISTRADOR") {
      return response.status(403).json({
        message:
          "No tiene permiso para consultar usuarios."
      });
    }

    const usuarios = await prisma.usuario.findMany({
      orderBy: {
        nombre: "asc",
      },
      select: {
        id_usuario: true,
        nombre: true,
        apellido: true,
        correo: true,
        rol: true,
        activo: true,
        fecha_registro: true,
      },
    });

    response.json(usuarios);
  } catch (error) {
    console.error("Error al obtener usuarios:", error);
    next(error);
  }
};

// Obtener por Id
const getById = async (request, response, next) => {
  try {
    if (request.user.rol !== "ADMINISTRADOR") {
  return response.status(403).json({
    message:
      "No tiene permiso para realizar esta acción."
  });
}


    const id = Number(request.params.id);

    const usuario = await prisma.usuario.findUnique({
      where: {
        id_usuario: id,
      },
      select: {
        id_usuario: true,
        nombre: true,
        apellido: true,
        correo: true,
        rol: true,
        activo: true,
        fecha_registro: true,
      },
    });

    if (!usuario) {
      return response.status(404).json({
        message: "Usuario no encontrado",
      });
    }

    response.json(usuario);
  } catch (error) {
    console.error("Error al obtener usuario:", error);
    next(error);
  }
};

// Crear usuario admin
const create = async (request, response, next) => {
  try {
    if (request.user.rol !== "ADMINISTRADOR") {
  return response.status(403).json({
    message:
      "No tiene permiso para realizar esta acción."
  });
}

    const usuario = request.body;
    //Encriptación del password
    const passwordHash = await bcrypt.hash(
      usuario.password,
      10
    );

    const nuevoUsuario = await prisma.usuario.create({
      data: {
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        correo: usuario.correo,
        password:passwordHash,
        rol: usuario.rol,
        activo: usuario.activo,
      },
      select: {
        id_usuario: true,
        nombre: true,
        apellido: true,
        correo: true,
        rol: true,
        activo: true,
        fecha_registro: true,
      },
    });

    response.status(201).json(nuevoUsuario);

  } catch (error) {
    if (error.code === "P2002") {
      return response.status(409).json({
        message: "Ya existe un usuario con ese correo.",
      });
    }
    console.error('Error al crear usuario:', error);
    next(error);
  }
};

// Registro público
const register = async (request, response, next) => {
  try {
    const usuario = request.body;

    const rolesPermitidos = [
      "COMPRAS",
      "CONSULTA"
    ];

    if (!rolesPermitidos.includes(usuario.rol)) {
      return response.status(400).json({
        message: "El rol seleccionado no es válido."
      });
    }

    const passwordHash = await bcrypt.hash(
      usuario.password,
      10
    );

    const nuevoUsuario = await prisma.usuario.create({
      data: {
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        correo: usuario.correo,
        password: passwordHash,

        // Puede elegir COMPRAS o CONSULTA,
        // pero nunca ADMINISTRADOR
        rol: usuario.rol,

        activo: true
      },

      select: {
        id_usuario: true,
        nombre: true,
        apellido: true,
        correo: true,
        rol: true,
        activo: true,
        fecha_registro: true
      }
    });

    response.status(201).json({
      message: "Usuario registrado correctamente.",
      data: nuevoUsuario
    });

  } catch (error) {

    if (error.code === "P2002") {
      return response.status(409).json({
        message: "Ya existe un usuario con ese correo."
      });
    }

    console.error(
      "Error al registrar usuario:",
      error
    );

    next(error);
  }
};

// Login
const login = async (
  request,
  response,
  next
) => {

  try {

    const {
      correo,
      password
    } = request.body;


    const usuario =
      await prisma.usuario.findUnique({

        where: {
          correo: correo,
        },

      });


    if (!usuario) {

      return response
        .status(401)
        .json({
          message:
            "Correo o contraseña incorrectos.",
        });

    }


    const passwordValido =
      await bcrypt.compare(
        password,
        usuario.password
      );


    if (!passwordValido) {

      return response
        .status(401)
        .json({
          message:
            "Correo o contraseña incorrectos.",
        });

    }


    if (!usuario.activo) {

      return response
        .status(403)
        .json({
          message:
            "El usuario se encuentra desactivado.",
        });

    }


    const token =
      jwt.sign(
        {
          id_usuario:
            usuario.id_usuario,

          rol:
            usuario.rol,
        },

        process.env.JWT_SECRET,

        {
          expiresIn: "8h",
        }
      );


    response.json({

      message:
        "Inicio de sesión correcto.",

      data: {

        id_usuario:
          usuario.id_usuario,

        nombre:
          usuario.nombre,

        apellido:
          usuario.apellido,

        correo:
          usuario.correo,

        rol:
          usuario.rol,

        activo:
          usuario.activo,

        token:
          token,

      },

    });

  } catch (error) {

    console.error(
      "Error al iniciar sesión:",
      error
    );

    next(error);

  }

};


// Actualizar usuario admin
const update = async (request, response, next) => {
  try {

    if (request.user.rol !== "ADMINISTRADOR") {
      return response.status(403).json({
        message:
          "No tiene permiso para realizar esta acción."
      });
    }

    const id = Number(request.params.id);
    const usuario = request.body;

    const usuarioActual = await prisma.usuario.findUnique({
      where: {
        id_usuario: id
      }
    });

    if (!usuarioActual) {
      return response.status(404).json({
        message: "Usuario no encontrado."
      });
    }

    /*
     * Si el administrador está editando
     * su propia cuenta, no puede cambiar
     * su rol ni desactivarse.
     */
    if (request.user.id_usuario === id) {

      if (
        usuario.rol !== usuarioActual.rol ||
        usuario.activo !== usuarioActual.activo
      ) {
        return response.status(403).json({
          message:
            "No puede modificar su propio rol ni el estado de su cuenta."
        });
      }

    }

    const data = {
      nombre: usuario.nombre,
      apellido: usuario.apellido,
      correo: usuario.correo,
      rol: usuario.rol,
      activo: usuario.activo,

      ...(usuario.password && {
        password: await bcrypt.hash(
          usuario.password,
          10
        ),
      }),
    };

    const usuarioActualizado =
      await prisma.usuario.update({

        where: {
          id_usuario: id,
        },

        data,

        select: {
          id_usuario: true,
          nombre: true,
          apellido: true,
          correo: true,
          rol: true,
          activo: true,
          fecha_registro: true,
        },

      });

    response.json(usuarioActualizado);

  } catch (error) {

    if (error.code === "P2002") {
      return response.status(409).json({
        message:
          "Ya existe un usuario con ese correo.",
      });
    }

    console.error(
      "Error al actualizar usuario:",
      error
    );

    next(error);

  }
};
//Métodos para la auto edición de perfiles
const getPerfil = async (request, response, next) => {
  try {

    const id = request.user.id_usuario;

    const usuario = await prisma.usuario.findUnique({
      where: {
        id_usuario: id
      },
      select: {
        id_usuario: true,
        nombre: true,
        apellido: true,
        correo: true,
        rol: true,
        activo: true,
        fecha_registro: true
      }
    });

    if (!usuario) {
      return response.status(404).json({
        message: "Usuario no encontrado."
      });
    }

    response.json(usuario);

  } catch (error) {

    console.error(
      "Error al obtener perfil:",
      error
    );

    next(error);
  }
};

const updatePerfil = async (request, response, next) => {
  try {

    const id = request.user.id_usuario;

    const {
      nombre,
      apellido,
      correo,
      password
    } = request.body;

    const data = {
      nombre,
      apellido,
      correo,
      ...(password && {
        password: await bcrypt.hash(password, 10)
      })
    };

    const usuarioActualizado =
      await prisma.usuario.update({
        where: {
          id_usuario: id
        },
        data,
        select: {
          id_usuario: true,
          nombre: true,
          apellido: true,
          correo: true,
          rol: true,
          activo: true,
          fecha_registro: true
        }
      });

    response.json({
      message: "Perfil actualizado correctamente.",
      data: usuarioActualizado
    });

  } catch (error) {

    if (error.code === "P2002") {
      return response.status(409).json({
        message:
          "Ya existe un usuario con ese correo."
      });
    }

    console.error(
      "Error al actualizar perfil:",
      error
    );

    next(error);
  }
};
export default {
  get,
  getById,
  create,
  register,
  login,
  update,
  getPerfil,
  updatePerfil
};