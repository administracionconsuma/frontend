// Punto único de acceso a la infraestructura de autenticación.

export {
    autenticar,
    cerrarSesion,
    inicializarAutenticacion,
    refrescarUsuarioAutenticado,
    restaurarAutenticacion,
    usuarioActual
} from './servicio-autenticacion.js';

export {
    estaAutenticado,
    obtenerEstadoAutenticacion,
    obtenerTokenAcceso,
    obtenerUsuarioAutenticado,
    suscribirAutenticacion
} from './estado-autenticacion.js';

export {
    requiereAutenticacion,
    verificarAutenticacion
} from './guard-autenticacion.js';

export { requiereAdministrador } from './guard-administracion.js';
