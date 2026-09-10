import { clienteHttp } from '../cliente-http.js';
import { RUTAS_API } from '../rutas-api.js';
import {
    construirQuery,
    validarId,
    validarObjeto,
    validarPaginacion
} from '../utilidades-api.js';

// GET /api/v1/administracion/categorias
export function listarCategorias({
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

    return clienteHttp(`${RUTAS_API.administracion.categorias}${query}`, {
        requiereAutenticacion: true,
        signal
    });
}

// GET /api/v1/administracion/categorias/{id}
export function obtenerCategoria(id, opciones = {}) {
    const categoriaId = validarId(id, 'categoriaId');

    return clienteHttp(RUTAS_API.administracion.categoriaPorId(categoriaId), {
        requiereAutenticacion: true,
        signal: opciones.signal
    });
}

// POST /api/v1/administracion/categorias
export function crearCategoria(datos, opciones = {}) {
    validarObjeto(datos);

    return clienteHttp(RUTAS_API.administracion.categorias, {
        method: 'POST',
        body: datos,
        requiereAutenticacion: true,
        signal: opciones.signal
    });
}

// PUT /api/v1/administracion/categorias/{id}
export function actualizarCategoria(id, datos, opciones = {}) {
    const categoriaId = validarId(id, 'categoriaId');
    validarObjeto(datos);

    return clienteHttp(RUTAS_API.administracion.categoriaPorId(categoriaId), {
        method: 'PUT',
        body: datos,
        requiereAutenticacion: true,
        signal: opciones.signal
    });
}

// PATCH /api/v1/administracion/categorias/{id}/estado
export function cambiarEstadoCategoria(id, estado, opciones = {}) {
    const categoriaId = validarId(id, 'categoriaId');

    return clienteHttp(RUTAS_API.administracion.estadoCategoria(categoriaId), {
        method: 'PATCH',
        body: { estado },
        requiereAutenticacion: true,
        signal: opciones.signal
    });
}
