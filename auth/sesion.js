import {
    obtenerUsuarioActual
} from '../cliente-api/autenticacion-api.js';

import {
    obtenerToken,
    limpiarToken
} from './almacenamientoToken.js';

import {
    establecerUsuarioSesion,
    establecerSinSesion,
    obtenerEstadoSesion,
    limpiarEstadoSesion,
    registrarActividadBackend
} from './estadoSesion.js';

import {
    inicializarAutenticacion
} from './autenticacion.js';

// Consulta al backend quién está autenticado.
// Rol y estado siempre provienen de /usuario-actual.
export async function comprobarSesion({ forzar = false } = {}) {
    inicializarAutenticacion();

    const estadoActual =
        obtenerEstadoSesion();

    if (
        !forzar &&
        estadoActual.comprobada
    ) {
        return estadoActual.usuario;
    }

    if (!obtenerToken()) {
        establecerSinSesion();
        return null;
    }

    try {
        const usuario =
            await obtenerUsuarioActual();

        establecerUsuarioSesion(
            usuario
        );

        return usuario;
    } catch (error) {
        if (error?.status === 401) {
            limpiarToken();
            establecerSinSesion();
            return null;
        }

        throw error;
    }
}

// Devuelve el Usuario actual y consulta al backend si todavía no fue comprobado.
export async function obtenerUsuarioSesion() {
    const estadoActual =
        obtenerEstadoSesion();

    if (!estadoActual.comprobada) {
        return comprobarSesion({
            forzar: true
        });
    }

    return estadoActual.usuario;
}

// Registra actividad real confirmada contra el backend.
export function registrarActividadSesion() {
    return registrarActividadBackend();
}

// Limpia la identidad y autoridad locales.
export function olvidarSesionLocal() {
    limpiarToken();
    limpiarEstadoSesion();
}
