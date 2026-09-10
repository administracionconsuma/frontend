import { verificarAutenticacion } from './guard-autenticacion.js';

// Verifica las condiciones de acceso del área administrativa de Consuma.
export async function requiereAdministrador(opciones = {}) {
    const usuario = await verificarAutenticacion(opciones);

    return Boolean(
        usuario
        && usuario.rol === 'ADMINISTRADOR'
        && usuario.estado === 'ACTIVO'
    );
}
