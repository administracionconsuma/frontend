// Obtiene los datos estáticos del encabezado de Recetas.
import {
    datosEncabezado
} from '../../../../datos/administracion/recetas/datos-encabezado.js';

// Configura el elemento reutilizable del encabezado.
import {
    configurarEncabezado
} from '../../../../elementos/encabezado/encabezado.js';

// Obtiene la sesión actual y permite cerrar sesión.
import {
    obtenerUsuarioSesion,
    cerrarSesion
} from '../../../../auth/index.js';

const RUTA_ENCABEZADO =
    new URL(
        '../../../../elementos/encabezado/encabezado.html',
        import.meta.url
    );


// Obtiene la estructura HTML reutilizable del encabezado.
async function obtenerHtmlEncabezado() {
    const respuesta =
        await fetch(
            RUTA_ENCABEZADO
        );

    if (!respuesta.ok) {
        throw new Error(
            `No fue posible cargar encabezado.html. HTTP ${respuesta.status}.`
        );
    }

    return respuesta.text();
}


// Obtiene el usuario autenticado que se mostrará en el encabezado.
async function obtenerUsuarioActual() {
    const usuario =
        await obtenerUsuarioSesion();

    if (!usuario) {
        throw new Error(
            'No existe un usuario autenticado para cargar el encabezado de Recetas.'
        );
    }

    return usuario;
}


// Adapta los datos de Recetas al contrato del encabezado reutilizable.
function construirConfiguracionEncabezado(
    usuario
) {
    return {
        logo: {
            src:
            datosEncabezado.marca.logo,

            alt:
            datosEncabezado.marca.nombre
        },

        nombre:
        datosEncabezado.marca.nombre,

        subtitulo:
        datosEncabezado.marca.subtitulo,

        navegacion:
        datosEncabezado.navegacion,

        usuario,

        alCerrarSesion:
        cerrarSesion
    };
}


// Carga y configura el encabezado de la página administrativa de Recetas.
async function cargarEncabezado() {
    const anclaje =
        document.getElementById(
            'encabezado'
        );

    if (!anclaje) {
        throw new Error(
            'No existe el punto de anclaje #encabezado.'
        );
    }

    const [
        htmlEncabezado,
        usuario
    ] =
        await Promise.all([
            obtenerHtmlEncabezado(),
            obtenerUsuarioActual()
        ]);

    anclaje.innerHTML =
        htmlEncabezado;

    configurarEncabezado(
        anclaje,
        construirConfiguracionEncabezado(
            usuario
        )
    );
}


// Se ejecuta automáticamente cuando principal.js lo importa.
cargarEncabezado().catch(
    (error) => {
        console.error(
            'No fue posible cargar el encabezado de Recetas:',
            error
        );
    }
);