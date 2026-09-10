import { configuracionAuth } from './configuracionAuth.js';

// Indica si el backend confirmó un Usuario ACTIVO.
export function esUsuarioActivo(usuario) {
    return usuario?.estado === configuracionAuth.estados.activo;
}

// Indica si el backend confirmó un Usuario ADMINISTRADOR.
export function esAdministrador(usuario) {
    return usuario?.rol === configuracionAuth.roles.administrador;
}

// El área pública siempre admite navegación.
export function puedeNavegarPublico() {
    return true;
}

// Administración exige un Usuario ACTIVO con rol ADMINISTRADOR.
export function puedeEntrarAdministracion(usuario) {
    return esUsuarioActivo(usuario) && esAdministrador(usuario);
}
