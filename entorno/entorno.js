import { ENTORNO_LOCAL } from './local.js';
import { ENTORNO_PRODUCCION } from './produccion.js';

// Única fuente de verdad para seleccionar el entorno activo.
const ENTORNO_ACTIVO = 'LOCAL';

const ENTORNOS = Object.freeze({
    LOCAL: ENTORNO_LOCAL,
    PRODUCCION: ENTORNO_PRODUCCION
});

const configuracion = ENTORNOS[ENTORNO_ACTIVO];

if (!configuracion) {
    throw new Error(`Entorno no reconocido: ${ENTORNO_ACTIVO}`);
}

if (!configuracion.urlBackend) {
    throw new Error(`El entorno ${ENTORNO_ACTIVO} no tiene configurada la URL del backend.`);
}

export const entorno = Object.freeze({
    ...configuracion
});

export const NOMBRE_ENTORNO_ACTIVO = ENTORNO_ACTIVO;
