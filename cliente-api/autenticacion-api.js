import { clienteHttp } from './cliente-http.js';
import { RUTAS_API } from './rutas-api.js';
import { validarObjeto } from './utilidades-api.js';

// POST /api/v1/autenticacion/login
export function iniciarSesion(credenciales, opciones = {}) {
    validarObjeto(credenciales, 'credenciales');

    return clienteHttp(RUTAS_API.autenticacion.login, {
        method: 'POST',
        body: credenciales,
        signal: opciones.signal
    });
}

// GET /api/v1/autenticacion/usuario-actual
export function obtenerUsuarioActual(opciones = {}) {
    return clienteHttp(RUTAS_API.autenticacion.usuarioActual, {
        requiereAutenticacion: true,
        signal: opciones.signal
    });
}
