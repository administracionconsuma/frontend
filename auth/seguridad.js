import {
    inicializarPagina,
    obtenerAccesoPagina
} from './inicializadorPagina.js';

import {
    iniciarControlSesion
} from './controlSesion.js';

import {
    configuracionAuth
} from './configuracionAuth.js';

import {
    guardarDestinoActual,
    redirigirAcceso
} from './redireccion.js';

// Inicializa seguridad antes de que el módulo funcional de una página protegida pueda ejecutarse.
async function inicializarSeguridad() {
    const acceso =
        obtenerAccesoPagina();

    try {
        const usuario =
            await inicializarPagina({
                comprobarPublica: false
            });

        if (usuario) {
            iniciarControlSesion();
            return;
        }

        if (
            acceso ===
            configuracionAuth.accesos.publico
        ) {
            return;
        }

        // La guarda ya inició una navegación segura.
        // Se bloquea la evaluación posterior hasta que el navegador cambie de página.
        await new Promise(
            () => {}
        );
    } catch (error) {
        if (
            acceso ===
            configuracionAuth.accesos.publico
        ) {
            console.warn(
                'No fue posible inicializar la seguridad opcional de la página pública:',
                error
            );

            return;
        }

        guardarDestinoActual(
            'ERROR_VALIDACION'
        );

        redirigirAcceso(
            'ERROR_VALIDACION'
        );

        // Un error técnico nunca habilita silenciosamente una página administrativa.
        await new Promise(
            () => {}
        );
    }
}

// Este módulo es intencionalmente autoejecutable.
await inicializarSeguridad();
