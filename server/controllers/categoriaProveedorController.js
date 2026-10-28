import prisma from "../config/prisma.js";

// Obtener listado
const get = async (request, response, next) => {
  try {

    if (request.user.rol !== "ADMINISTRADOR"&& request.user.rol !== "COMPRAS") {
      return response.status(403).json({
        message:
          "No tiene permiso para consultar las categorías."
      });
    }

    const categorias =
      await prisma.categoriaProveedor.findMany({
        orderBy: {
          nombre: "asc"
        }
      });

    response.json(categorias);

  } catch (error) {

    console.error(
      "Error al obtener categorías:",
      error
    );

    next(error);
  }
};


// Obtener por Id
const getById = async (request, response, next) => {
  try {

    if (request.user.rol !== "ADMINISTRADOR") {
      return response.status(403).json({
        message:
          "No tiene permiso para consultar esta categoría."
      });
    }

    const id =
      Number(request.params.id);

    const categoria =
      await prisma.categoriaProveedor.findUnique({
        where: {
          id_categoria: id
        }
      });

    if (!categoria) {
      return response.status(404).json({
        message:
          "Categoría no encontrada."
      });
    }

    response.json(categoria);

  } catch (error) {

    console.error(
      "Error al obtener categoría:",
      error
    );

    next(error);
  }
};


// Crear categoría
const create = async (request, response, next) => {
  try {

    if (request.user.rol !== "ADMINISTRADOR") {
      return response.status(403).json({
        message:
          "No tiene permiso para crear categorías."
      });
    }

    const categoria =
      request.body;

    if (
      !categoria.nombre ||
      !categoria.nombre.trim()
    ) {
      return response.status(400).json({
        message:
          "El nombre de la categoría es requerido."
      });
    }

    const nuevaCategoria =
      await prisma.categoriaProveedor.create({
        data: {
          nombre:
            categoria.nombre.trim(),

          descripcion:
            categoria.descripcion?.trim() || null
        }
      });

    response
      .status(201)
      .json(nuevaCategoria);

  } catch (error) {

    if (error.code === "P2002") {
      return response.status(409).json({
        message:
          "Ya existe una categoría con ese nombre."
      });
    }

    console.error(
      "Error al crear categoría:",
      error
    );

    next(error);
  }
};


// Actualizar categoría
const update = async (request, response, next) => {
  try {

    if (request.user.rol !== "ADMINISTRADOR") {
      return response.status(403).json({
        message:
          "No tiene permiso para editar categorías."
      });
    }

    const id =
      Number(request.params.id);

    const categoria =
      request.body;

    if (
      !categoria.nombre ||
      !categoria.nombre.trim()
    ) {
      return response.status(400).json({
        message:
          "El nombre de la categoría es requerido."
      });
    }

    const categoriaExistente =
      await prisma.categoriaProveedor.findUnique({
        where: {
          id_categoria: id
        }
      });

    if (!categoriaExistente) {
      return response.status(404).json({
        message:
          "Categoría no encontrada."
      });
    }

    const categoriaActualizada =
      await prisma.categoriaProveedor.update({
        where: {
          id_categoria: id
        },

        data: {
          nombre:
            categoria.nombre.trim(),

          descripcion:
            categoria.descripcion?.trim() || null
        }
      });

    response.json(
      categoriaActualizada
    );

  } catch (error) {

    if (error.code === "P2002") {
      return response.status(409).json({
        message:
          "Ya existe una categoría con ese nombre."
      });
    }

    console.error(
      "Error al actualizar categoría:",
      error
    );

    next(error);
  }
};


export default {
  get,
  getById,
  create,
  update
};