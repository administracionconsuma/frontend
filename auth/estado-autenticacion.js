// Mantiene en memoria el estado autenticado vigente del frontend.

const estado = {
    token: null,
    venceEn: null,
    usuario: null,
    comprobada: false
};

const suscriptores = new Set();

export function obtenerEstadoAutenticacion() {
    return Object.freeze({
        token: estado.token,
        venceEn: estado.venceEn,
        usuario: estado.usuario,
        comprobada: estado.comprobada,
        autenticado: estaAutenticado()
    });
}

export function obtenerTokenAcceso() {
    return estaAutenticado() ? estado.token : null;
}

export function obtenerUsuarioAutenticado() {
    return estaAutenticado() ? estado.usuario : null;
}

export function estaAutenticado() {
    return Boolean(
        estado.token
        && estado.venceEn
        && estado.venceEn > Date.now()
    );
}

export function establecerSesion({ token, venceEn, usuario = null }) {
    estado.token = token;
    estado.venceEn = venceEn;
    estado.usuario = usuario;
    estado.comprobada = true;

    notificarCambio();
}

export function establecerUsuarioAutenticado(usuario) {
    estado.usuario = usuario ?? null;
    estado.comprobada = true;

    notificarCambio();
}

export function marcarAutenticacionComprobada() {
    estado.comprobada = true;
    notificarCambio();
}

export function limpiarEstadoAutenticacion() {
    estado.token = null;
    estado.venceEn = null;
    estado.usuario = null;
    estado.comprobada = true;

    notificarCambio();
}

export function suscribirAutenticacion(suscriptor) {
    if (typeof suscriptor !== 'function') {
        throw new TypeError('El suscriptor debe ser una función.');
    }

    suscriptores.add(suscriptor);

    return () => {
        suscriptores.delete(suscriptor);
    };
}

function notificarCambio() {
    const estadoActual = obtenerEstadoAutenticacion();

    suscriptores.forEach((suscriptor) => {
        suscriptor(estadoActual);
    });
}
