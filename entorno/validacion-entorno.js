import { configuracionEntorno } from './configuracion.js';

// Valida la configuración mínima antes de iniciar la aplicación.
export function validarEntorno() {
    const errores = [];

    if (!configuracionEntorno?.frontend?.urlBase) {
        errores.push('Falta frontend.urlBase.');
    }

    if (!configuracionEntorno?.backend?.urlBase) {
        errores.push('Falta backend.urlBase.');
    }

    if (errores.length > 0) {
        throw new Error(`Configuración de entorno inválida: ${errores.join(' ')}`);
    }

    return true;
}
