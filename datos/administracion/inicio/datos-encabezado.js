// Obtiene la identidad y los recursos propios del negocio
// desde la configuración central del dominio.
import {
    datosDominio
} from '../../dominio/datos-dominio.js';

// Define los datos estáticos utilizados por el encabezado del Inicio.
export const datosEncabezado = {
    marca: {
        nombre:
        datosDominio.identidad.nombreAplicacion,

        subtitulo:
            'INICIO',

        logo:
        datosDominio.recursos.logos.principal
    },

    /*
        La navegación se incorporará únicamente
        cuando existan las páginas reales correspondientes.
    */
    navegacion: [],

    // Identifica la vista actual.
    activo:
        'inicio'
};