import { validarEntorno } from '../entorno/index.js';
import { inicializarAutenticacion } from '../auth/index.js';

// Inicializa la infraestructura transversal antes de montar cualquier página.
export function inicializarApp() {
    validarEntorno();
    inicializarAutenticacion();
}
