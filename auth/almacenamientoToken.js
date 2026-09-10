import { configuracionAuth } from './configuracionAuth.js';

// Guarda el JWT únicamente durante la vida de la pestaña actual.
export function guardarToken({ token, venceEn }) {
    if (typeof token !== 'string' || !token.trim()) {
        throw new TypeError('El token de acceso es obligatorio.');
    }

    if (!Number.isFinite(venceEn) || venceEn <= Date.now()) {
        throw new TypeError('El vencimiento del token debe ser una fecha futura válida.');
    }

    sessionStorage.setItem(
        configuracionAuth.claves.token,
        token
    );

    sessionStorage.setItem(
        configuracionAuth.claves.venceEn,
        String(venceEn)
    );
}

// Devuelve el JWT solamente mientras siga vigente.
export function obtenerToken() {
    const token =
        sessionStorage.getItem(
            configuracionAuth.claves.token
        );

    const venceEn =
        Number(
            sessionStorage.getItem(
                configuracionAuth.claves.venceEn
            )
        );

    if (
        !token ||
        !Number.isFinite(venceEn) ||
        venceEn <= Date.now()
    ) {
        limpiarToken();
        return null;
    }

    return token;
}

// Devuelve el instante absoluto de vencimiento del JWT vigente.
export function obtenerVencimientoToken() {
    const venceEn =
        Number(
            sessionStorage.getItem(
                configuracionAuth.claves.venceEn
            )
        );

    if (!Number.isFinite(venceEn)) {
        return null;
    }

    return venceEn;
}

// Elimina cualquier autoridad JWT guardada en esta pestaña.
export function limpiarToken() {
    sessionStorage.removeItem(
        configuracionAuth.claves.token
    );

    sessionStorage.removeItem(
        configuracionAuth.claves.venceEn
    );
}
