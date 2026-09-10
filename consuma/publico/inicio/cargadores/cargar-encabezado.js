// Datos estáticos correspondientes al encabezado público.
import {
    datosEncabezado
} from '../../../../datos/publico/datos-encabezado.js';

// Configura el elemento reutilizable del encabezado.
import {
    configurarEncabezado
} from '../../../../elementos/encabezado/encabezado.js';

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


// Adapta exclusivamente los datos visuales de la vista pública.
function construirConfiguracionEncabezado() {
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
        datosEncabezado.navegacion
    };
}


// Configura el sector derecho del encabezado público como acceso administrativo.
function configurarAccesoAdministracion(
    encabezado
) {
    const contenedor =
        encabezado.querySelector(
            '.encabezado-usuario'
        );

    if (!contenedor) {
        return;
    }

    contenedor.hidden =
        false;

    contenedor.style.removeProperty(
        'display'
    );

    const enlace =
        document.createElement(
            'a'
        );

    enlace.className =
        'encabezado-usuario-boton';

    enlace.href =
        '/acceso/';

    enlace.setAttribute(
        'aria-label',
        'Acceder al área administrativa'
    );

    const icono =
        document.createElement(
            'span'
        );

    icono.className =
        'encabezado-avatar';

    icono.setAttribute(
        'aria-hidden',
        'true'
    );

    icono.textContent =
        'A';

    const texto =
        document.createElement(
            'span'
        );

    texto.className =
        'encabezado-usuario-nombre';

    texto.textContent =
        'Administración';

    enlace.append(
        icono,
        texto
    );

    contenedor.replaceChildren(
        enlace
    );
}


// Carga y configura el encabezado público dentro de su punto de anclaje.
async function cargarEncabezado() {
    const anclaje =
        document.getElementById(
            'encabezado'
        );

    if (!anclaje) {
        return;
    }

    const htmlEncabezado =
        await obtenerHtmlEncabezado();

    anclaje.innerHTML =
        htmlEncabezado;

    configurarEncabezado(
        anclaje,
        construirConfiguracionEncabezado()
    );

    configurarAccesoAdministracion(
        anclaje
    );
}


// El cargador se autoejecuta al ser importado por el principal público.
cargarEncabezado().catch(
    (error) => {
        console.error(
            'No fue posible cargar el encabezado público:',
            error
        );
    }
);