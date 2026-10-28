import prisma from "../config/prisma.js";

const resumen = async (request, response, next) => {
  try {

    const [
      totalProveedores,
      proveedoresActivos,
      proveedoresEnEvaluacion,
      proveedoresSuspendidos,
      totalEvaluaciones,
      totalContactos,
      evaluaciones,
      proveedores
    ] = await Promise.all([

      prisma.proveedor.count(),

      prisma.proveedor.count({
        where: {
          estado: "ACTIVO"
        }
      }),

      prisma.proveedor.count({
        where: {
          estado: "EN_EVALUACION"
        }
      }),

      prisma.proveedor.count({
        where: {
          estado: "SUSPENDIDO"
        }
      }),

      prisma.evaluacionProveedor.count(),

      prisma.contactoProveedor.count(),

      prisma.evaluacionProveedor.findMany({
        select: {
          proveedor_id: true,
          calificacion: true
        }
      }),

      prisma.proveedor.findMany({
        select: {
          id_proveedor: true,
          nombre_empresa: true,
          categoria_id: true,

          contactos: {
            select: {
              es_principal: true
            }
          },

          evaluaciones: {
            select: {
              calificacion: true
            }
          },

          categoria: {
            select: {
              id_categoria: true,
              nombre: true
            }
          }
        }
      })

    ]);


    // ==========================
    // PROMEDIO GENERAL
    // ==========================

    let promedioGeneral = 0;

    if (evaluaciones.length > 0) {

      const suma = evaluaciones.reduce(
        (acumulado, evaluacion) =>
          acumulado + Number(evaluacion.calificacion),
        0
      );

      promedioGeneral =
        suma / evaluaciones.length;
    }


    // ==========================
    // PROMEDIO POR PROVEEDOR
    // ==========================

    const proveedoresConPromedio =
      proveedores.map((proveedor) => {

        const calificaciones =
          proveedor.evaluaciones.map(
            evaluacion =>
              Number(evaluacion.calificacion)
          );

        let promedio = 0;

        if (calificaciones.length > 0) {

          const suma =
            calificaciones.reduce(
              (acumulado, calificacion) =>
                acumulado + calificacion,
              0
            );

          promedio =
            suma / calificaciones.length;
        }

        return {
          id_proveedor:
            proveedor.id_proveedor,

          nombre_empresa:
            proveedor.nombre_empresa,

          promedio,

          cantidadEvaluaciones:
            calificaciones.length
        };

      });


    // ==========================
    // PROVEEDORES CON PROMEDIO >= 4
    // ==========================

    const proveedoresPromedioAlto =
      proveedoresConPromedio.filter(
        proveedor =>
          proveedor.cantidadEvaluaciones > 0 &&
          proveedor.promedio >= 4
      ).length;


    // ==========================
    // PROVEEDORES SIN EVALUACIÓN
    // ==========================

    const proveedoresSinEvaluacion =
      proveedoresConPromedio.filter(
        proveedor =>
          proveedor.cantidadEvaluaciones === 0
      ).length;


    // ==========================
    // SIN CONTACTO PRINCIPAL
    // ==========================

    const proveedoresSinContactoPrincipal =
      proveedores.filter(
        proveedor =>
          !proveedor.contactos.some(
            contacto =>
              contacto.es_principal
          )
      ).length;


    // ==========================
    // TOP 5 PROVEEDORES
    // ==========================

    const topProveedores =
      proveedoresConPromedio
        .filter(
          proveedor =>
            proveedor.cantidadEvaluaciones > 0
        )
        .sort(
          (a, b) =>
            b.promedio - a.promedio
        )
        .slice(0, 5)
        .map(proveedor => ({
          ...proveedor,
          promedio:
            Number(
              proveedor.promedio.toFixed(1)
            )
        }));


    // ==========================
    // DISTRIBUCIÓN POR CATEGORÍA
    // ==========================

    const categoriasMap = {};

    proveedores.forEach((proveedor) => {

      if (!proveedor.categoria) {
        return;
      }

      const id =
        proveedor.categoria.id_categoria;

      if (!categoriasMap[id]) {

        categoriasMap[id] = {
          id_categoria: id,
          nombre:
            proveedor.categoria.nombre,
          cantidad: 0
        };

      }

      categoriasMap[id].cantidad++;

    });

    const categorias =
      Object.values(categoriasMap)
        .sort(
          (a, b) =>
            b.cantidad - a.cantidad
        );


    // ==========================
    // RESPUESTA
    // ==========================

    response.json({

      proveedores: {
        total:
          totalProveedores,

        activos:
          proveedoresActivos,

        enEvaluacion:
          proveedoresEnEvaluacion,

        suspendidos:
          proveedoresSuspendidos
      },

      evaluaciones: {
        total:
          totalEvaluaciones,

        promedioGeneral:
          Number(
            promedioGeneral.toFixed(1)
          ),

        proveedoresPromedioAlto,

        proveedoresSinEvaluacion
      },

      contactos: {
        total:
          totalContactos,

        proveedoresSinContactoPrincipal
      },

      topProveedores,

      categorias

    });

  } catch (error) {

    console.error(
      "Error al obtener resumen del dashboard:",
      error
    );

    next(error);

  }
};

export default {
  resumen
};