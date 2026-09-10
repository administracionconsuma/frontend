import { clienteHttp } from '../cliente-http.js';
import { RUTAS_API } from '../rutas-api.js';
import {
    construirQuery,
    validarId,
    validarObjeto,
    validarPaginacion
} from '../utilidades-api.js';

// GET /api/v1/administracion/insumos
export function listarInsumos({
    page = 0,
    size = 20,
    buscar = '',
    estado,
    signal
} = {}) {
    const paginacion = validarPaginacion(page, size);

    const query = construirQuery({
        ...paginacion,
        buscar,
        estado
    });

    return clienteHttp(`${RUTAS_API.administracion.insumos}${query}`, {
        requiereAutenticacion: true,
        signal
    });
}

// GET /api/v1/administracion/insumos/{id}
export function obtenerInsumo(id, opciones = {}) {
    const insumoId = validarId(id, 'insumoId');

    return clienteHttp(RUTAS_API.administracion.insumoPorId(insumoId), {
        requiereAutenticacion: true,
        signal: opciones.signal
    });
}

// POST /api/v1/administracion/insumos
export function crearInsumo(datos, opciones = {}) {
    validarObjeto(datos);

    return clienteHttp(RUTAS_API.administracion.insumos, {
        method: 'POST',
        body: datos,
        requiereAutenticacion: true,
        signal: opciones.signal
    });
}

// PUT /api/v1/administracion/insumos/{id}
export function actualizarInsumo(id, datos, opciones = {}) {
    const insumoId = validarId(id, 'insumoId');
    validarObjeto(datos);

    return clienteHttp(RUTAS_API.administracion.insumoPorId(insumoId), {
        method: 'PUT',
        body: datos,
        requiereAutenticacion: true,
        signal: opciones.signal
    });
}

// PATCH /api/v1/administracion/insumos/{id}/estado
export function cambiarEstadoInsumo(id, estado, opciones = {}) {
    const insumoId = validarId(id, 'insumoId');

    return clienteHttp(RUTAS_API.administracion.estadoInsumo(insumoId), {
        method: 'PATCH',
        body: { estado },
        requiereAutenticacion: true,
        signal: opciones.signal
    });
}
