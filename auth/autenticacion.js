import {
    iniciarSesion as iniciarSesionApi
} from '../cliente-api/autenticacion-api.js';

import {
    configurarClienteHttp
} from '../cliente-api/cliente-http.js';

import {
    guardarToken,
    limpiarToken,
    obtenerToken
} from './almacenamientoToken.js';

import {
    establecerUsuarioSesion,
    limpiarEstadoSesion
} from './estadoSesion.js';

import {
    clasificarDestino,
    eliminarDestinoGuardado,
    guardarDestinoActual,
    redirigirAcceso,
    redirigirInicioPublico
} from './redireccion.js';

let autenticacionInicializada = false;

// Conecta una sola vez cliente-api con el proveedor JWT de auth/.
export function inicializarAutenticacion() {
    if (autenticacionInicializada) {
        return;
    }

    configurarClienteHttp({
        obtenerToken,
        alNoAutenticado: manejarNoAutenticado
    });

    autenticacionInicializada = true;
}

// Autentica contra el backend y registra únicamente la autoridad devuelta por él.
export async function autenticar({ correo, password }, opciones = {}) {
    inicializarAutenticacion();

    const respuesta =
        await iniciarSesionApi(
            {
                correo,
                password
            },
            {
                signal: opciones.signal
            }
        );

    const token =
        respuesta?.accessToken;

    const expiresIn =
        Number(
            respuesta?.expiresIn
        );

    const usuario =
        respuesta?.usuario ?? null;

    if (typeof token !== 'string' || !token.trim()) {
        throw new Error(
            'El backend no devolvió un token de acceso válido.'
        );
    }

    if (!Number.isFinite(expiresIn) || expiresIn <= 0) {
        throw new Error(
            'El backend no devolvió un tiempo de expiración válido.'
        );
    }

    guardarToken({
        token,
        venceEn: Date.now() + (expiresIn * 1000)
    });

    establecerUsuarioSesion(
        usuario
    );

    return usuario;
}

// Lleva al acceso conservando la ubicación protegida cuando corresponde.
export function solicitarAutenticacion({
    motivo = 'AUTENTICACION_REQUERIDA',
    recordarDestino = true
} = {}) {
    if (recordarDestino) {
        guardarDestinoActual(
            motivo
        );
    }

    redirigirAcceso(
        motivo
    );
}

// El backend actual no expone logout: se elimina solamente la autoridad JWT local.
export function cerrarSesion({
    redirigir = true,
    conservarDestino = false
} = {}) {
    const rutaActual =
        `${window.location.pathname}${window.location.search}${window.location.hash}`;

    const accesoActual =
        clasificarDestino(
            rutaActual
        );

    limpiarToken();
    limpiarEstadoSesion();

    if (!conservarDestino) {
        eliminarDestinoGuardado();
    }

    if (!redirigir) {
        return;
    }

    if (accesoActual === 'PUBLICO') {
        window.location.reload();
        return;
    }

    redirigirInicioPublico();
}

// Un 401 protegido invalida la autoridad local.
// No se redirige aquí: la guarda o la página activa decide la navegación.
function manejarNoAutenticado() {
    limpiarToken();
    limpiarEstadoSesion();
}
