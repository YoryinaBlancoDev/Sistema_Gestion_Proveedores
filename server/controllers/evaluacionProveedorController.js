import prisma from "../config/prisma.js";

// Obtener listado
const get = async (request, response, next) => {
  try {
    const usuarioAutenticado=request.user;
     const where =
      usuarioAutenticado.rol === "COMPRAS"
        ? {
            usuario_id:
              usuarioAutenticado.id_usuario
          }
        : {};

    const evaluaciones = await prisma.evaluacionProveedor.findMany({
      where,

      orderBy: {
        fecha_evaluacion: "desc",
      },
      include: {
        proveedor: {
          select: {
            id_proveedor: true,
            nombre_empresa: true,
          },
        },

         usuario: {
          select: {
            id_usuario: true,
            nombre: true,
            apellido: true,
          },
        },
      },
    });

    response.json(evaluaciones);

  } catch (error) {

    console.error(
      "Error al obtener evaluaciones:",
      error
    );

    next(error);
  }
};

// Obtener por Id
const getById = async (request, response, next) => {
  try {

    const id = Number(request.params.id);
    const usuarioAutenticado = request.user;

    const evaluacion =
      await prisma.evaluacionProveedor.findUnique({
        where: {
          id_evaluacion: id,
        },
        include: {
          proveedor: {
            select: {
              id_proveedor: true,
              nombre_empresa: true,
            },
          },

          usuario: {
          select: {
            id_usuario: true,
            nombre: true,
            apellido: true,
          },
        },
        },
      });

    if (!evaluacion) {
      return response.status(404).json({
        message: "Evaluación no encontrada",
      });
    }

    if (
      usuarioAutenticado.rol === "COMPRAS" &&
      evaluacion.usuario_id !==
        usuarioAutenticado.id_usuario
    ) {

      return response.status(403).json({
        message:
          "No tienes permiso para consultar esta evaluación."
      });

    }

    response.json(evaluacion);

  } catch (error) {

    console.error(
      "Error al obtener evaluación:",
      error
    );

    next(error);
  }
};

// Crear evaluacion
const create = async (request, response, next) => {
   try {
    const evaluacion = request.body;
    const usuarioAutenticado = request.user;

    // CONSULTA no puede crear evaluaciones
    if (usuarioAutenticado.rol === "CONSULTA") {
      return response.status(403).json({
        message: "No tiene permiso para crear evaluaciones."
      });
    }

     if (
      !evaluacion.proveedor_id ||
      evaluacion.calificacion == null
    ) {
      return response.status(400).json({
        message: "Proveedor y calificación son requeridos.",
      });
    }

    const calificacion = Number(evaluacion.calificacion);

    if (
      Number.isNaN(calificacion) ||
      calificacion < 1 ||
      calificacion > 5
    ) {
      return response.status(400).json({
        message: "La calificación debe estar entre 1.0 y 5.0.",
      });
    }

    let usuarioId;
    // ADMINISTRADOR puede escoger usuario
    if (usuarioAutenticado.rol === "ADMINISTRADOR") {

      if (!evaluacion.usuario_id) {
        return response.status(400).json({
          message: "Debe seleccionar un usuario."
        });
      }

      usuarioId = Number(evaluacion.usuario_id);

    } else {

      // COMPRAS crea bajo su propio perfil
      usuarioId = usuarioAutenticado.id_usuario;
    }

    const proveedorId = Number(evaluacion.proveedor_id);

    // Validar que el usuario no haya evaluado
    // anteriormente al mismo proveedor
    const evaluacionExistente =
      await prisma.evaluacionProveedor.findFirst({
        where: {
          proveedor_id: proveedorId,
          usuario_id: usuarioId
        }
      });

    if (evaluacionExistente) {
      return response.status(409).json({
        message:
          "Este usuario ya evaluó anteriormente a este proveedor."
      });
    }

    const nuevaEvaluacion =
      await prisma.evaluacionProveedor.create({
        data: {
          proveedor_id: Number(evaluacion.proveedor_id),
          usuario_id: usuarioId,
          calificacion: calificacion,
          comentario: evaluacion.comentario || null,
        },
      });

    response.status(201).json(nuevaEvaluacion);

  } catch (error) {

    console.error(
      "Error al crear evaluación:",
      error
    );

    next(error);
  }
};

// Actualizar evaluacion
const update = async (request, response, next) => {
  try {
    const id = Number(request.params.id);
    const usuarioAutenticado = request.user;
    const evaluacion = request.body;

    // CONSULTA no puede editar evaluaciones
    if (usuarioAutenticado.rol === "CONSULTA") {
      return response.status(403).json({
        message: "No tiene permiso para editar evaluaciones."
      });
    }

    const evaluacionActual =
      await prisma.evaluacionProveedor.findUnique({
        where: {
          id_evaluacion: id
        }
      });

    if (!evaluacionActual) {
      return response.status(404).json({
        message: "Evaluación no encontrada."
      });
    }

    // COMPRAS solo puede editar las propias
    if (
      usuarioAutenticado.rol === "COMPRAS" &&
      evaluacionActual.usuario_id !==
        usuarioAutenticado.id_usuario
    ) {
      return response.status(403).json({
        message: "No tiene permiso para editar esta evaluación."
      });
    }


    if (
      !evaluacion.proveedor_id ||
      evaluacion.calificacion == null
    ) {
      return response.status(400).json({
        message: "Proveedor y calificación son requeridos.",
      });
    }

    const calificacion = Number(evaluacion.calificacion);

    if (
      Number.isNaN(calificacion) ||
      calificacion < 1 ||
      calificacion > 5
    ) {
      return response.status(400).json({
        message: "La calificación debe estar entre 1.0 y 5.0.",
      });
    }

     let usuarioId = evaluacionActual.usuario_id;

    // ADMINISTRADOR puede cambiar el usuario
    if (usuarioAutenticado.rol === "ADMINISTRADOR") {

      if (!evaluacion.usuario_id) {
        return response.status(400).json({
          message: "Debe seleccionar un usuario."
        });
      }

      usuarioId = Number(evaluacion.usuario_id);
    }

    const proveedorId =
      Number(evaluacion.proveedor_id);

    // Validar que no exista otra evaluación
    // del mismo usuario para el mismo proveedor
    const evaluacionDuplicada =
      await prisma.evaluacionProveedor.findFirst({

        where: {

          proveedor_id:
            proveedorId,

          usuario_id:
            usuarioId,
// el not es para que no se bloquee su edición 
          NOT: {
            id_evaluacion: id
          }

        }

      });

    if (evaluacionDuplicada) {

      return response.status(409).json({
        message:
          "Este usuario ya tiene una evaluación registrada para este proveedor."
      });

    }

    const evaluacionActualizada =
      await prisma.evaluacionProveedor.update({
        where: {
          id_evaluacion: id,
        },

        data: {
          proveedor_id: Number(evaluacion.proveedor_id),
          usuario_id: usuarioId,
          calificacion: calificacion,
          comentario: evaluacion.comentario || null,
        },
      });

    response.json(evaluacionActualizada);

  } catch (error) {
    console.error(
      "Error al actualizar evaluación:",
      error
    );

    next(error);
  }
};

export default {
  get,
  getById,
  create,
  update,
};