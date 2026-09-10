// Obtiene la identidad y los recursos propios del negocio
// desde la configuración central del dominio.
import {
    datosDominio
} from '../dominio/datos-dominio.js';

// Define los datos estáticos utilizados por el encabezado público.
export const datosEncabezado = {
    marca: {
        nombre:
        datosDominio.identidad.nombreAplicacion,

        subtitulo:
            'RECETARIO',

        logo:
        datosDominio.recursos.logos.principal
    },

    /*
        La navegación pública se incorporará únicamente
        cuando existan destinos reales que deban mostrarse.
    */
    navegacion: [],

    // Identifica la vista pública actual.
    activo:
        'inicio'
};