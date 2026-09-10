import { configuracionLocal } from './local.js';
import { configuracionProduccion } from './produccion.js';

// Entornos permitidos por el frontend.
export const ENTORNOS = Object.freeze({
    LOCAL: 'LOCAL',
    PRODUCCION: 'PRODUCCION'
});

// Única fuente de verdad para seleccionar el entorno activo.
const ENTORNO_ACTIVO = ENTORNOS.PRODUCCION;

// Resuelve la configuración correspondiente al entorno seleccionado.
function resolverEntornoActual() {
    switch (ENTORNO_ACTIVO) {
        case ENTORNOS.LOCAL:
            return configuracionLocal;

        case ENTORNOS.PRODUCCION:
            return configuracionProduccion;

        default:
            throw new Error(`Entorno no reconocido: ${ENTORNO_ACTIVO}`);
    }
}

export const configuracionEntorno = resolverEntornoActual();
export const nombreEntorno = configuracionEntorno.nombre;
export const urlBaseFrontend = configuracionEntorno.frontend.urlBase;
export const urlBaseBackend = configuracionEntorno.backend.urlBase;
