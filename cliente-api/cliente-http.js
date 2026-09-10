import { urlBaseBackend } from '../entorno/index.js';
import { ErrorApi, crearErrorApiDesdeRespuesta } from './error-api.js';

// Cliente HTTP central. La URL del backend proviene exclusivamente del entorno activo.
let proveedorToken = () => null;
let manejadorNoAutenticado = null;

// Configura únicamente las dependencias de autenticación del cliente HTTP.
export function configurarClienteHttp({
    obtenerToken = () => null,
    alNoAutenticado = null
} = {}) {
    if (typeof obtenerToken !== 'function') {
        throw new TypeError('obtenerToken debe ser una función.');
    }

    if (alNoAutenticado !== null && typeof alNoAutenticado !== 'function') {
        throw new TypeError('alNoAutenticado debe ser una función o null.');
    }

    proveedorToken = obtenerToken;
    manejadorNoAutenticado = alNoAutenticado;
}

// Ejecuta una petición HTTP contra el backend configurado para el entorno activo.
export async function clienteHttp(ruta, opciones = {}) {
    const {
        method = 'GET',
        body,
        headers = {},
        requiereAutenticacion = false,
        signal
    } = opciones;

    const headersFinales = new Headers(headers);
    headersFinales.set('Accept', 'application/json');

    if (debeEnviarJson(body) && !headersFinales.has('Content-Type')) {
        headersFinales.set('Content-Type', 'application/json');
    }

    if (requiereAutenticacion) {
        const token = await proveedorToken();

        if (!token) {
            const error = new ErrorApi({
                mensaje: 'Se requiere autenticación.',
                status: 401,
                error: 'Autenticación requerida',
                path: ruta
            });

            if (manejadorNoAutenticado) {
                await manejadorNoAutenticado(error);
            }

            throw error;
        }

        headersFinales.set('Authorization', `Bearer ${token}`);
    }

    let respuesta;

    try {
        respuesta = await fetch(construirUrl(ruta), {
            method,
            headers: headersFinales,
            body: serializarBody(body),
            signal
        });
    } catch (causa) {
        throw new ErrorApi({
            mensaje: 'No fue posible comunicarse con el servidor.',
            error: 'Error de red',
            causa
        });
    }

    const cuerpo = await leerCuerpo(respuesta);

    if (!respuesta.ok) {
        const error = crearErrorApiDesdeRespuesta(respuesta.status, cuerpo);

        if (respuesta.status === 401 && requiereAutenticacion && manejadorNoAutenticado) {
            await manejadorNoAutenticado(error);
        }

        throw error;
    }

    return cuerpo;
}

// Construye la URL final sin permitir URLs del backend dispersas por el proyecto.
function construirUrl(ruta) {
    if (typeof urlBaseBackend !== 'string' || !urlBaseBackend.trim()) {
        throw new Error('El entorno activo no tiene configurada la URL del backend.');
    }

    if (typeof ruta !== 'string' || !ruta.startsWith('/')) {
        throw new TypeError('La ruta de API debe comenzar con "/".');
    }

    return `${urlBaseBackend.replace(/\/+$/, '')}${ruta}`;
}

// Determina si el body debe serializarse como JSON.
function debeEnviarJson(body) {
    return body !== undefined
        && body !== null
        && !(body instanceof FormData)
        && !(body instanceof Blob)
        && typeof body !== 'string';
}

// Serializa bodies JSON sin alterar FormData, Blob o texto.
function serializarBody(body) {
    if (body === undefined || body === null) {
        return undefined;
    }

    if (body instanceof FormData || body instanceof Blob || typeof body === 'string') {
        return body;
    }

    return JSON.stringify(body);
}

// Lee de forma uniforme respuestas JSON, texto o respuestas sin contenido.
async function leerCuerpo(respuesta) {
    if (respuesta.status === 204) {
        return null;
    }

    const texto = await respuesta.text();

    if (!texto) {
        return null;
    }

    const tipoContenido = respuesta.headers.get('content-type') || '';

    if (tipoContenido.includes('application/json')) {
        try {
            return JSON.parse(texto);
        } catch {
            return texto;
        }
    }

    return texto;
}
