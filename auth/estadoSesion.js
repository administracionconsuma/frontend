// Mantiene únicamente el estado efímero de identidad durante la vida de la página.
let estado = {
    comprobada: false,
    usuario: null,
    ultimaActividadBackend: null,
    reautenticacionEnCurso: false
};

// Devuelve una copia para impedir modificaciones accidentales desde otros módulos.
export function obtenerEstadoSesion() {
    return {
        comprobada: estado.comprobada,
        usuario: estado.usuario,
        ultimaActividadBackend: estado.ultimaActividadBackend,
        reautenticacionEnCurso: estado.reautenticacionEnCurso
    };
}

// Registra un Usuario confirmado por el backend.
export function establecerUsuarioSesion(usuario) {
    estado = {
        ...estado,
        comprobada: true,
        usuario,
        ultimaActividadBackend: Date.now()
    };

    return obtenerEstadoSesion();
}

// Representa ausencia de autenticación válida.
export function establecerSinSesion() {
    estado = {
        ...estado,
        comprobada: true,
        usuario: null,
        ultimaActividadBackend: null
    };

    return obtenerEstadoSesion();
}

// Registra actividad real observada contra el backend.
export function registrarActividadBackend() {
    if (!estado.usuario) {
        return obtenerEstadoSesion();
    }

    estado = {
        ...estado,
        ultimaActividadBackend: Date.now()
    };

    return obtenerEstadoSesion();
}

// Evita varias recuperaciones simultáneas de autenticación.
export function establecerReautenticacionEnCurso(valor) {
    estado = {
        ...estado,
        reautenticacionEnCurso: Boolean(valor)
    };

    return obtenerEstadoSesion();
}

// Limpia toda identidad local conocida.
export function limpiarEstadoSesion() {
    estado = {
        comprobada: false,
        usuario: null,
        ultimaActividadBackend: null,
        reautenticacionEnCurso: false
    };
}
