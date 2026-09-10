// Punto único para consumir la capa de autenticación y autorización.

export {
    inicializarAutenticacion,
    autenticar,
    solicitarAutenticacion,
    cerrarSesion
} from './autenticacion.js';

export {
    comprobarSesion,
    obtenerUsuarioSesion,
    registrarActividadSesion,
    olvidarSesionLocal
} from './sesion.js';

export {
    esUsuarioActivo,
    esAdministrador,
    puedeNavegarPublico,
    puedeEntrarAdministracion
} from './autorizacion.js';

export {
    inicializarPaginaPublica,
    protegerAdministracion,
    exigirAutenticacion
} from './guardas.js';

export {
    guardarDestino,
    guardarDestinoActual,
    obtenerDestinoGuardado,
    eliminarDestinoGuardado,
    consumirDestinoGuardado,
    clasificarDestino,
    redirigirA,
    redirigirInicioPublico,
    redirigirAdministracion,
    redirigirAcceso
} from './redireccion.js';

export {
    inicializarPagina,
    obtenerAccesoPagina
} from './inicializadorPagina.js';

export {
    iniciarControlSesion,
    detenerControlSesion
} from './controlSesion.js';

export {
    configuracionAuth
} from './configuracionAuth.js';
