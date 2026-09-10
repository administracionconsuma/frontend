import { clienteHttp } from '../cliente-http.js';
import { RUTAS_API } from '../rutas-api.js';
import {
    construirQuery,
    validarId,
    validarPaginacion
} from '../utilidades-api.js';

// GET /api/v1/publico/recetas
export function listarRecetasPublicas({
    page = 0,
    size = 20,
    buscar = '',
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
        categoriaId: categoria
    });

    return clienteHttp(`${RUTAS_API.publico.recetas}${query}`, {
        signal
    });
}

// GET /api/v1/publico/recetas/{id}
export function obtenerRecetaPublica(id, opciones = {}) {
    const recetaId = validarId(id, 'recetaId');

    return clienteHttp(RUTAS_API.publico.recetaPorId(recetaId), {
        signal: opciones.signal
    });
}
