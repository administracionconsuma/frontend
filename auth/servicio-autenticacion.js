import {
    iniciarSesion as iniciarSesionApi,
    obtenerUsuarioActual as obtenerUsuarioActualApi
} from '../cliente-api/autenticacion-api.js';

import { configurarClienteHttp } from '../cliente-api/cliente-http.js';

import {
    limpiarSesionPersistida,
    guardarSesionPersistida,
    obtenerSesionPersistida
} from './almacenamiento-sesion.js';

import {
    establecerSesion,
    establecerUsuarioAutenticado,
    limpiarEstadoAutenticacion,
    marcarAutenticacionComprobada,
    obtenerTokenAcceso,
    obtenerUsuarioAutenticado
} from './estado-autenticacion.js';

let infraestructuraConfigurada = false;
let restauracionEnCurso = null;

// Configura una sola vez el cliente HTTP para que tome el JWT desde auth/.
export function inicializarAutenticacion() {
    if (infraestructuraConfigurada) {
        return;
    }

    configurarClienteHttp({
        obtenerToken: obtenerTokenAcceso,
        alNoAutenticado: manejarNoAutenticado
    });

    infraestructuraConfigurada = true;
}

// Autentica contra el backend y conserva la sesión durante la pestaña actual.
export async function autenticar({ correo, password }, opciones = {}) {
    inicializarAutenticacion();

    const respuesta = await iniciarSesionApi(
        { correo, password },
        { signal: opciones.signal }
    );

    const token = respuesta?.accessToken;
    const expiresIn = Number(respuesta?.expiresIn);
    const usuario = respuesta?.usuario ?? null;

    if (typeof token !== 'string' || !token.trim()) {
        throw new Error('El backend no devolvió un token de acceso válido.');
    }

    if (!Number.isFinite(expiresIn) || expiresIn <= 0) {
        throw new Error('El backend no devolvió un tiempo de expiración válido.');
    }

    const venceEn = Date.now() + (expiresIn * 1000);

    guardarSesionPersistida({
        token,
        venceEn
    });

    establecerSesion({
        token,
        venceEn,
        usuario
    });

    return usuario;
}

// Recupera una sesión de esta pestaña y la revalida con usuario-actual.
export async function restaurarAutenticacion(opciones = {}) {
    inicializarAutenticacion();

    if (restauracionEnCurso) {
        return restauracionEnCurso;
    }

    restauracionEnCurso = restaurarSesionInterna(opciones.signal);

    try {
        return await restauracionEnCurso;
    } finally {
        restauracionEnCurso = null;
    }
}

// Consulta nuevamente la identidad vigente en el backend.
export async function refrescarUsuarioAutenticado(opciones = {}) {
    inicializarAutenticacion();

    if (!obtenerTokenAcceso()) {
        return null;
    }

    const usuario = await obtenerUsuarioActualApi({
        signal: opciones.signal
    });

    establecerUsuarioAutenticado(usuario);

    return usuario;
}

// Cierra la sesión únicamente en frontend porque el contrato actual no expone logout.
export function cerrarSesion() {
    limpiarSesionPersistida();
    limpiarEstadoAutenticacion();
}

// Devuelve el usuario vigente en memoria sin realizar una llamada HTTP.
export function usuarioActual() {
    return obtenerUsuarioAutenticado();
}

async function restaurarSesionInterna(signal) {
    const sesionPersistida = obtenerSesionPersistida();

    if (!sesionPersistida) {
        limpiarEstadoAutenticacion();
        return null;
    }

    establecerSesion({
        token: sesionPersistida.token,
        venceEn: sesionPersistida.venceEn,
        usuario: null
    });

    try {
        return await refrescarUsuarioAutenticado({ signal });
    } catch (error) {
        if (error?.status === 401) {
            cerrarSesion();
            return null;
        }

        throw error;
    }
}

function manejarNoAutenticado() {
    cerrarSesion();
    marcarAutenticacionComprobada();
}
