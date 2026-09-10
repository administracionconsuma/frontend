// Persiste únicamente el token de acceso y su vencimiento durante la sesión del navegador.

const CLAVE_TOKEN = 'consuma.auth.access-token';
const CLAVE_VENCIMIENTO = 'consuma.auth.vence-en';

export function guardarSesionPersistida({ token, venceEn }) {
    if (typeof token !== 'string' || !token.trim()) {
        throw new TypeError('El token de acceso es obligatorio.');
    }

    if (!Number.isFinite(venceEn) || venceEn <= Date.now()) {
        throw new TypeError('El vencimiento de la sesión debe ser una fecha futura válida.');
    }

    sessionStorage.setItem(CLAVE_TOKEN, token);
    sessionStorage.setItem(CLAVE_VENCIMIENTO, String(venceEn));
}

export function obtenerSesionPersistida() {
    const token = sessionStorage.getItem(CLAVE_TOKEN);
    const venceEn = Number(sessionStorage.getItem(CLAVE_VENCIMIENTO));

    if (!token || !Number.isFinite(venceEn)) {
        return null;
    }

    if (venceEn <= Date.now()) {
        limpiarSesionPersistida();
        return null;
    }

    return {
        token,
        venceEn
    };
}

export function limpiarSesionPersistida() {
    sessionStorage.removeItem(CLAVE_TOKEN);
    sessionStorage.removeItem(CLAVE_VENCIMIENTO);
}
