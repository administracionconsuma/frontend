import { configuracionAuth } from './configuracionAuth.js';

// Normaliza un destino y evita redirecciones hacia otros orígenes.
function normalizarDestinoInterno(destino) {
    if (typeof destino !== 'string' || !destino.trim()) {
        return null;
    }

    try {
        const url =
            new URL(
                destino,
                window.location.origin
            );

        if (url.origin !== window.location.origin) {
            return null;
        }

        return `${url.pathname}${url.search}${url.hash}`;
    } catch {
        return null;
    }
}

// Indica si una ruta pertenece a alguno de los prefijos configurados.
function coincideConPrefijo(ruta, prefijos) {
    return prefijos.some(
        (prefijo) =>
            ruta === prefijo ||
            ruta.startsWith(prefijo)
    );
}

// Clasifica una ruta interna según el tipo de acceso permitido.
export function clasificarDestino(destino) {
    const normalizado =
        normalizarDestinoInterno(destino);

    if (!normalizado) {
        return null;
    }

    const pathname =
        new URL(
            normalizado,
            window.location.origin
        ).pathname;

    if (
        coincideConPrefijo(
            pathname,
            configuracionAuth.destino.excluidos
        )
    ) {
        return null;
    }

    if (
        coincideConPrefijo(
            pathname,
            configuracionAuth.destino.administracion
        )
    ) {
        return configuracionAuth.accesos.administrador;
    }

    if (
        coincideConPrefijo(
            pathname,
            configuracionAuth.destino.publicos
        )
    ) {
        return configuracionAuth.accesos.publico;
    }

    return null;
}

// Guarda una sola intención de navegación por ciclo de autenticación.
export function guardarDestino(destino, motivo = 'AUTENTICACION_REQUERIDA') {
    const clave =
        configuracionAuth.claves.destinoDespuesDeLogin;

    if (sessionStorage.getItem(clave)) {
        return obtenerDestinoGuardado();
    }

    const ruta =
        normalizarDestinoInterno(destino);

    if (!ruta || !clasificarDestino(ruta)) {
        return null;
    }

    const registro = {
        ruta,
        motivo,
        guardadoEn: Date.now()
    };

    sessionStorage.setItem(
        clave,
        JSON.stringify(registro)
    );

    return registro;
}

// Conserva la ubicación actual antes de abandonar una página protegida.
export function guardarDestinoActual(motivo = 'AUTENTICACION_REQUERIDA') {
    return guardarDestino(
        `${window.location.pathname}${window.location.search}${window.location.hash}`,
        motivo
    );
}

// Recupera el destino pendiente sin consumirlo.
export function obtenerDestinoGuardado() {
    const clave =
        configuracionAuth.claves.destinoDespuesDeLogin;

    const valor =
        sessionStorage.getItem(clave);

    if (!valor) {
        return null;
    }

    try {
        const registro =
            JSON.parse(valor);

        const antiguedad =
            Date.now() - Number(registro?.guardadoEn || 0);

        if (
            !registro?.ruta ||
            !clasificarDestino(registro.ruta) ||
            antiguedad < 0 ||
            antiguedad > configuracionAuth.destino.vigenciaMs
        ) {
            eliminarDestinoGuardado();
            return null;
        }

        return registro;
    } catch {
        eliminarDestinoGuardado();
        return null;
    }
}

// Elimina la intención pendiente.
export function eliminarDestinoGuardado() {
    sessionStorage.removeItem(
        configuracionAuth.claves.destinoDespuesDeLogin
    );
}

// Consume definitivamente el destino pendiente.
export function consumirDestinoGuardado() {
    const registro =
        obtenerDestinoGuardado();

    eliminarDestinoGuardado();

    return registro?.ruta || null;
}

// Navega usando replace para no volver con Atrás a una página rechazada.
export function redirigirA(ruta) {
    const destino =
        normalizarDestinoInterno(ruta);

    if (!destino) {
        return;
    }

    const actual =
        `${window.location.pathname}${window.location.search}${window.location.hash}`;

    if (actual === destino) {
        return;
    }

    window.location.replace(destino);
}

// Envía al inicio público de Consuma.
export function redirigirInicioPublico() {
    redirigirA(
        configuracionAuth.rutas.publica
    );
}

// Envía al panel administrativo.
export function redirigirAdministracion() {
    redirigirA(
        configuracionAuth.rutas.administracion
    );
}

// Envía a la pantalla de acceso.
export function redirigirAcceso(motivo = 'AUTENTICACION_REQUERIDA') {
    const consulta =
        new URLSearchParams({
            motivo
        });

    redirigirA(
        `${configuracionAuth.rutas.acceso}?${consulta.toString()}`
    );
}
