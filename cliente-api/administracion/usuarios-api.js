import { clienteHttp } from '../cliente-http.js';
import { RUTAS_API } from '../rutas-api.js';
import {
    construirQuery,
    validarId,
    validarObjeto,
    validarPaginacion
} from '../utilidades-api.js';

// GET /api/v1/administracion/usuarios
export function listarUsuarios({
    page = 0,
    size = 20,
    buscar = '',
    signal
} = {}) {
    const paginacion = validarPaginacion(page, size);

    const query = construirQuery({
        ...paginacion,
        buscar
    });

    return clienteHttp(`${RUTAS_API.administracion.usuarios}${query}`, {
        requiereAutenticacion: true,
        signal
    });
}

// GET /api/v1/administracion/usuarios/{id}
export function obtenerUsuario(id, opciones = {}) {
    const usuarioId = validarId(id, 'usuarioId');

    return clienteHttp(RUTAS_API.administracion.usuarioPorId(usuarioId), {
        requiereAutenticacion: true,
        signal: opciones.signal
    });
}

// POST /api/v1/administracion/usuarios
export function crearUsuario(datos, opciones = {}) {
    validarObjeto(datos);

    return clienteHttp(RUTAS_API.administracion.usuarios, {
        method: 'POST',
        body: datos,
        requiereAutenticacion: true,
        signal: opciones.signal
    });
}

// PUT /api/v1/administracion/usuarios/{id}
export function actualizarUsuario(id, datos, opciones = {}) {
    const usuarioId = validarId(id, 'usuarioId');
    validarObjeto(datos);

    return clienteHttp(RUTAS_API.administracion.usuarioPorId(usuarioId), {
        method: 'PUT',
        body: datos,
        requiereAutenticacion: true,
        signal: opciones.signal
    });
}

// PATCH /api/v1/administracion/usuarios/{id}/estado
export function cambiarEstadoUsuario(id, estado, opciones = {}) {
    const usuarioId = validarId(id, 'usuarioId');

    return clienteHttp(RUTAS_API.administracion.estadoUsuario(usuarioId), {
        method: 'PATCH',
        body: { estado },
        requiereAutenticacion: true,
        signal: opciones.signal
    });
}
