import {
    obtenerEstadoAutenticacion,
    obtenerUsuarioAutenticado
} from './estado-autenticacion.js';

import {
    refrescarUsuarioAutenticado,
    restaurarAutenticacion
} from './servicio-autenticacion.js';

// Verifica que exista una identidad autenticada válida antes de montar un área protegida.
export async function verificarAutenticacion({ revalidar = false, signal } = {}) {
    const estado = obtenerEstadoAutenticacion();

    if (!estado.comprobada) {
        await restaurarAutenticacion({ signal });
    }

    if (revalidar && obtenerEstadoAutenticacion().autenticado) {
        await refrescarUsuarioAutenticado({ signal });
    }

    return obtenerUsuarioAutenticado();
}

export async function requiereAutenticacion(opciones = {}) {
    const usuario = await verificarAutenticacion(opciones);

    if (!usuario) {
        return false;
    }

    return true;
}
