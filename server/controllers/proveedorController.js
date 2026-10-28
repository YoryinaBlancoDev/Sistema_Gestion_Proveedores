import prisma from "../config/prisma.js";


// Obtener listado
const get = async (request, response, next) => {
  try {
    const proveedores = await prisma.proveedor.findMany({
      orderBy: {
        nombre_empresa: "asc",
      },
      include: {
        categoria: {
          select: {
            id_categoria: true,
            nombre: true,
          },
        },
      },
    });

    response.json(proveedores);
  } catch (error) {
    console.error("Error al obtener proveedores:", error);
    next(error);
  }
};

// Obtener por Id
const getById = async (request, response, next) => {
  try {
    const id = Number(request.params.id);

    const proveedor = await prisma.proveedor.findUnique({
      where: {
        id_proveedor: id,
      },
      include: {
        categoria: {
          select: {
            id_categoria: true,
            nombre: true,
          },
        },
      },
    });

    if (!proveedor) {
      return response.status(404).json({
        message: "Proveedor no encontrado",
      });
    }

    response.json(proveedor);
  } catch (error) {
    next(error);
  }
};

// Crear proveedor
const create = async (request, response, next) => {
  try {
     const usuarioAutenticado = request.user;

    if (usuarioAutenticado.rol === "CONSULTA") {
      return response.status(403).json({
        message: "No tiene permiso para crear proveedores."
      });
    }

    const proveedor = request.body;

    const nuevoProveedor = await prisma.proveedor.create({
      data: {
        nombre_empresa: proveedor.nombre_empresa,
        cedula_juridica: proveedor.cedula_juridica,
        telefono: proveedor.telefono,
        correo: proveedor.correo,
        direccion: proveedor.direccion,
        estado: proveedor.estado,

        categoria: {
          connect: {
            id_categoria: Number(proveedor.categoria_id),
          },
        },
      },
    });

    response.status(201).json(nuevoProveedor);

  } catch (error) {

    if (error.code === 'P2002') {
      return response.status(409).json({
        message: 'Ya existe un proveedor con esa cédula jurídica.'
      });
    }

    console.error('Error al crear proveedor:', error);
    next(error);
  }
};

// Actualizar proveedor
const update = async (request, response, next) => {
  try {
    const usuarioAutenticado = request.user;

    if (usuarioAutenticado.rol === "CONSULTA") {
      return response.status(403).json({
        message: "No tiene permiso para editar proveedores."
      });
    }
    
    const id = Number(request.params.id);
    const proveedor = request.body;

    const proveedorActualizado = await prisma.proveedor.update({
      where: {
        id_proveedor: id,
      },
      data: {
        nombre_empresa: proveedor.nombre_empresa,
        cedula_juridica: proveedor.cedula_juridica,
        telefono: proveedor.telefono,
        correo: proveedor.correo,
        direccion: proveedor.direccion,
        estado: proveedor.estado,

        categoria: {
          connect: {
            id_categoria: Number(proveedor.categoria_id),
          },
        },
      },
    });

    response.json(proveedorActualizado);

  } catch (error) {

    if (error.code === 'P2002') {
      return response.status(409).json({
        message: 'Ya existe un proveedor con esa cédula jurídica.'
      });
    }

    next(error);
  }
};

export default {
  get,
  getById,
  create,
  update,
};