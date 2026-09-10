// Obtiene la identidad y los recursos propios del negocio
// desde la configuración central del dominio.
import {
    datosDominio
} from '../../dominio/datos-dominio.js';

// Define los datos estáticos utilizados por el encabezado de Recetas.
export const datosEncabezado = {
    marca: {
        nombre:
        datosDominio.identidad.nombreAplicacion,

        subtitulo:
            'RECETAS',

        logo:
        datosDominio.recursos.logos.principal
    },

    // Define únicamente destinos administrativos que ya existen.
    navegacion: [
        {
            etiqueta:
                'Inicio',

            href:
                './inicio.html',

            actual:
                false
        },

        {
            etiqueta:
                'Recetas',

            href:
                './recetas.html',

            actual:
                true
        }
    ],

    // Identifica la vista actual.
    activo:
        'recetas'
};