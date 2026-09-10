import {
    obtenerVencimientoToken,
    obtenerToken
} from './almacenamientoToken.js';

import {
    olvidarSesionLocal
} from './sesion.js';

import {
    obtenerAccesoPagina
} from './inicializadorPagina.js';

import {
    configuracionAuth
} from './configuracionAuth.js';

import {
    solicitarAutenticacion
} from './autenticacion.js';

let temporizadorVencimiento = null;

// No realiza polling: solamente reacciona al vencimiento conocido del JWT.
export function iniciarControlSesion() {
    detenerControlSesion();

    if (!obtenerToken()) {
        return;
    }

    const venceEn =
        obtenerVencimientoToken();

    if (!venceEn) {
        return;
    }

    const demora =
        Math.max(
            0,
            venceEn - Date.now()
        );

    temporizadorVencimiento =
        window.setTimeout(
            manejarVencimiento,
            demora
        );
}

// Cancela el temporizador local de vencimiento.
export function detenerControlSesion() {
    if (temporizadorVencimiento !== null) {
        window.clearTimeout(
            temporizadorVencimiento
        );

        temporizadorVencimiento = null;
    }
}

// Reacciona al vencimiento sin bloquear jamás una página PUBLICO.
function manejarVencimiento() {
    olvidarSesionLocal();

    const acceso =
        obtenerAccesoPagina();

    if (
        acceso ===
        configuracionAuth.accesos.administrador
    ) {
        solicitarAutenticacion({
            motivo: 'SESION_VENCIDA',
            recordarDestino: true
        });
    }
}
