import { clienteHttp } from '../cliente-http.js';
import { RUTAS_API } from '../rutas-api.js';

// GET /api/v1/publico/categorias
export function listarCategoriasPublicas(opciones = {}) {
    return clienteHttp(RUTAS_API.publico.categorias, {
        signal: opciones.signal
    });
}
