import prisma from "../config/prisma.js";

// Obtener listado
const get = async (request, response, next) => {
  try {

    const contactos = await prisma.contactoProveedor.findMany({
      orderBy: {
        nombre: "asc",
      },
      include: {
        proveedor: {
          select: {
            id_proveedor: true,
            nombre_empresa: true,
          },
        },
      },
    });

    response.json(contactos);

  } catch (error) {

    console.error(
      "Error al obtener contactos:",
      error
    );

    next(error);
  }
};


// Obtener por Id
const getById = async (request, response, next) => {
  try {

    const id = Number(request.params.id);

    const contacto =
      await prisma.contactoProveedor.findUnique({
        where: {
          id_contacto: id,
        },
        include: {
          proveedor: {
            select: {
              id_proveedor: true,
              nombre_empresa: true,
            },
          },
        },
      });

    if (!contacto) {
      return response.status(404).json({
        message: "Contacto no encontrado",
      });
    }

    response.json(contacto);

  } catch (error) {

    console.error(
      "Error al obtener contacto:",
      error
    );

    next(error);
  }
};

// Crear contacto
const create = async (request, response, next) => {
  try {
     const usuarioAutenticado = request.user;

    if (usuarioAutenticado.rol === "CONSULTA") {
      return response.status(403).json({
        message: "No tiene permiso para crear contactos."
      });
    }

    const contacto = request.body;

    const nuevoContacto =
      await prisma.contactoProveedor.create({
        data: {
          proveedor_id: contacto.proveedor_id,
          nombre: contacto.nombre,
          apellido:contacto.apellido,
          puesto: contacto.puesto,
          telefono: contacto.telefono,
          correo: contacto.correo,
          es_principal: contacto.es_principal,
        },
      });

    response.status(201).json(nuevoContacto);

  } catch (error) {

    console.error(
      "Error al crear contacto:",
      error
    );

    next(error);
  }
};

// Actualizar contacto
const update = async (request, response, next) => {
  try {
     const usuarioAutenticado = request.user;

    if (usuarioAutenticado.rol === "CONSULTA") {
      return response.status(403).json({
        message: "No tiene permiso para editar contactos."
      });
    }

    const id = Number(request.params.id);
    const contacto = request.body;

    const contactoActualizado =
      await prisma.contactoProveedor.update({
        where: {
          id_contacto: id,
        },
        data: {
          proveedor_id: contacto.proveedor_id,
          nombre: contacto.nombre,
          apellido:contacto.apellido,
          puesto: contacto.puesto,
          telefono: contacto.telefono,
          correo: contacto.correo,
          es_principal: contacto.es_principal,
        },
      });

    response.json(contactoActualizado);

  } catch (error) {

    console.error(
      "Error al actualizar contacto:",
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