// Define los textos y etiquetas utilizados para presentar el detalle de una receta.
export const datosVerReceta = {
    etiqueta: 'Receta',

    textoCerrar: 'Cerrar',

    ariaCerrar: 'Cerrar detalle de receta',

    secciones: {
        general: {
            titulo: 'Información general',

            campos: {
                categoria: 'Categoría',

                estado: 'Estado',

                fechaCreacion: 'Creada',

                fechaActualizacion: 'Última actualización'
            }
        },

        insumos: {
            titulo: 'Insumos',

            campos: {
                insumo: 'Insumo',

                cantidad: 'Cantidad',

                unidad: 'Unidad'
            },

            mensajeVacio:
                'Esta receta no tiene insumos cargados.'
        },

        preparacion: {
            titulo: 'Preparación',

            campo:
                'Preparación',

            valorVacio:
                'No hay una preparación cargada.'
        }
    },

    acciones: {
        editar: 'Editar',

        cambiarEstado: 'Cambiar estado'
    }
};
