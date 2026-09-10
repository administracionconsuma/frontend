import {
    comprobarSesion
} from './sesion.js';

import {
    esUsuarioActivo,
    puedeEntrarAdministracion
} from './autorizacion.js';

import {
    cerrarSesion,
    solicitarAutenticacion
} from './autenticacion.js';

import {
    redirigirAcceso
} from './redireccion.js';

// Una página pública nunca se bloquea.
// La comprobación de sesión es opcional.
export async function inicializarPaginaPublica({ comprobar = false } = {}) {
    if (!comprobar) {
        return null;
    }

    return comprobarSesion();
}

// Protege cualquier página exclusiva de ADMINISTRADOR antes de montar su contenido funcional.
export async function protegerAdministracion() {
    const usuario =
        await comprobarSesion({
            forzar: true
        });

    if (!usuario) {
        solicitarAutenticacion({
            motivo: 'AUTENTICACION_REQUERIDA',
            recordarDestino: true
        });

        return null;
    }

    if (!esUsuarioActivo(usuario)) {
        cerrarSesion({
            redirigir: false,
            conservarDestino: false
        });

        redirigirAcceso(
            'CUENTA_INACTIVA'
        );

        return null;
    }

    if (puedeEntrarAdministracion(usuario)) {
        return usuario;
    }

    redirigirAcceso(
        'ROL_NO_AUTORIZADO'
    );

    return null;
}

// Exige autenticación para una acción protegida.
export async function exigirAutenticacion() {
    const usuario =
        await comprobarSesion({
            forzar: true
        });

    if (!usuario) {
        solicitarAutenticacion({
            motivo: 'AUTENTICACION_REQUERIDA',
            recordarDestino: true
        });

        return null;
    }

    if (!esUsuarioActivo(usuario)) {
        cerrarSesion({
            redirigir: false,
            conservarDestino: false
        });

        redirigirAcceso(
            'CUENTA_INACTIVA'
        );

        return null;
    }

    return usuario;
}
