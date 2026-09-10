// Datos estáticos correspondientes al encabezado del Inicio.
import {
    datosEncabezado
} from '../../../../datos/administracion/inicio/datos-encabezado.js';

// Configura el elemento reutilizable del encabezado.
import {
    configurarEncabezado
} from '../../../../elementos/encabezado/encabezado.js';

// Obtiene la identidad autenticada y permite cerrar la sesión.
import {
    obtenerUsuarioSesion,
    cerrarSesion
} from '../../../../auth/index.js';

// Resuelve la ruta real del HTML reutilizable desde este módulo.
const RUTA_ENCABEZADO =
    new URL(
        '../../../../elementos/encabezado/encabezado.html',
        import.meta.url
    );

// Obtiene la estructura HTML del encabezado.
async function obtenerHtmlEncabezado() {
    const respuesta =
        await fetch(
            RUTA_ENCABEZADO
        );

    if (!respuesta.ok) {
        throw new Error(
            `No fue posible cargar el encabezado. HTTP ${respuesta.status}.`
        );
    }

    return respuesta.text();
}

// Construye el nombre disponible para mostrar en el encabezado.
function obtenerNombreUsuario(usuario) {
    const nombreCompleto =
        [
            usuario?.nombre,
            usuario?.apellido
        ]
            .filter(Boolean)
            .join(' ')
            .trim();

    return nombreCompleto || usuario?.correo || '';
}

// Adapta el usuario autenticado al contrato visual del elemento.
function construirUsuarioEncabezado(usuario) {
    return {
        nombre:
            obtenerNombreUsuario(
                usuario
            )
    };
}

// Adapta los datos disponibles al contrato recibido por el elemento.
function construirConfiguracionEncabezado(usuario) {
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

        usuario:
            construirUsuarioEncabezado(
                usuario
            ),

        alCerrarSesion:
        cerrarSesion
    };
}

// Carga y configura el encabezado dentro de su punto de anclaje.
async function cargarEncabezado() {
    const anclaje =
        document.getElementById(
            'encabezado'
        );

    if (!anclaje) {
        return;
    }

    const [
        htmlEncabezado,
        usuario
    ] =
        await Promise.all([
            obtenerHtmlEncabezado(),
            obtenerUsuarioSesion()
        ]);

    if (!usuario) {
        throw new Error(
            'No existe un usuario autenticado para cargar el encabezado.'
        );
    }

    anclaje.innerHTML =
        htmlEncabezado;

    configurarEncabezado(
        anclaje,
        construirConfiguracionEncabezado(
            usuario
        )
    );
}

// El cargador se autoejecuta al ser importado por el principal de Inicio.
cargarEncabezado().catch(
    (error) => {
        console.error(
            'No fue posible cargar el encabezado:',
            error
        );
    }
);