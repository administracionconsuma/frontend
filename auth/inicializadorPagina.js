import {
    inicializarPaginaPublica,
    protegerAdministracion
} from './guardas.js';

import {
    configuracionAuth
} from './configuracionAuth.js';

import {
    clasificarDestino
} from './redireccion.js';

// Lee el acceso declarado explícitamente por el HTML.
export function obtenerAccesoPagina() {
    const declarado =
        document.documentElement.dataset.acceso ||
        document.body?.dataset.acceso ||
        null;

    if (declarado) {
        const valor =
            declarado.toUpperCase();

        if (
            Object.values(
                configuracionAuth.accesos
            ).includes(valor)
        ) {
            return valor;
        }

        throw new Error(
            `El valor data-acceso="${declarado}" no es válido.`
        );
    }

    // Compatibilidad defensiva para una página todavía no migrada.
    const accesoPorRuta =
        clasificarDestino(
            `${window.location.pathname}${window.location.search}${window.location.hash}`
        );

    if (accesoPorRuta) {
        console.warn(
            'La página no declara data-acceso. Se aplicó temporalmente la clasificación por ruta.'
        );

        return accesoPorRuta;
    }

    throw new Error(
        'La página no declara un acceso reconocido.'
    );
}

// Ejecuta la guarda correspondiente al tipo de página.
export async function inicializarPagina({ comprobarPublica = false } = {}) {
    const acceso =
        obtenerAccesoPagina();

    if (
        acceso ===
        configuracionAuth.accesos.administrador
    ) {
        return protegerAdministracion();
    }

    return inicializarPaginaPublica({
        comprobar: comprobarPublica
    });
}
