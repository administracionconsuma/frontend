// Representa de forma uniforme un error devuelto por la API.

export class ErrorApi extends Error {
    constructor({
        mensaje,
        status = 0,
        error = 'Error de API',
        path = '',
        timestamp = null,
        erroresValidacion = [],
        causa = null
    }) {
        super(mensaje || 'Ocurrió un error al comunicarse con el servidor.', { cause: causa });

        this.name = 'ErrorApi';
        this.status = status;
        this.error = error;
        this.path = path;
        this.timestamp = timestamp;
        this.erroresValidacion = Array.isArray(erroresValidacion) ? erroresValidacion : [];
    }

    es(status) {
        return this.status === status;
    }
}

export function crearErrorApiDesdeRespuesta(status, cuerpo, causa = null) {
    const datos = cuerpo && typeof cuerpo === 'object' ? cuerpo : {};

    return new ErrorApi({
        mensaje: datos.mensaje || datos.message || `La API respondió con estado ${status}.`,
        status: Number.isInteger(datos.status) ? datos.status : status,
        error: datos.error || 'Error de API',
        path: datos.path || '',
        timestamp: datos.timestamp || null,
        erroresValidacion: datos.erroresValidacion || [],
        causa
    });
}
