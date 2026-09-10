import { clienteHttp } from '../cliente-http.js';
import { RUTAS_API } from '../rutas-api.js';
import {
    construirQuery,
    validarId,
    validarObjeto,
    validarPaginacion
} from '../utilidades-api.js';

// GET /api/v1/administracion/recetas
export function listarRecetas({
    page = 0,
    size = 20,
    buscar = '',
    estado,
    categoriaId,
    signal
} = {}) {
    const paginacion = validarPaginacion(page, size);

    const categoria = categoriaId === undefined || categoriaId === null || categoriaId === ''
        ? undefined
        : validarId(categoriaId, 'categoriaId');

    const query = construirQuery({
        ...paginacion,
        buscar,
        estado,
        categoriaId: categoria
    });

    return clienteHttp(`${RUTAS_API.administracion.recetas}${query}`, {
        requiereAutenticacion: true,
        signal
    });
}

// GET /api/v1/administracion/recetas/{id}
export function obtenerReceta(id, opciones = {}) {
    const recetaId = validarId(id, 'recetaId');

    return clienteHttp(RUTAS_API.administracion.recetaPorId(recetaId), {
        requiereAutenticacion: true,
        signal: opciones.signal
    });
}

// POST /api/v1/administracion/recetas
export function crearReceta(datos, opciones = {}) {
    validarObjeto(datos);

    return clienteHttp(RUTAS_API.administracion.recetas, {
        method: 'POST',
        body: datos,
        requiereAutenticacion: true,
        signal: opciones.signal
    });
}

// PUT /api/v1/administracion/recetas/{id}
export function actualizarReceta(id, datos, opciones = {}) {
    const recetaId = validarId(id, 'recetaId');
    validarObjeto(datos);

    return clienteHttp(RUTAS_API.administracion.recetaPorId(recetaId), {
        method: 'PUT',
        body: datos,
        requiereAutenticacion: true,
        signal: opciones.signal
    });
}

// PATCH /api/v1/administracion/recetas/{id}/estado
export function cambiarEstadoReceta(id, estado, opciones = {}) {
    const recetaId = validarId(id, 'recetaId');

    return clienteHttp(RUTAS_API.administracion.estadoReceta(recetaId), {
        method: 'PATCH',
        body: { estado },
        requiereAutenticacion: true,
        signal: opciones.signal
    });
}
