// Crea categorías mediante la API administrativa.
import {
    crearCategoria
} from '../../../../cliente-api/administracion/categorias-api.js';

// Obtiene los textos y configuración estática del modal.
import {
    datosCrearCategoria
} from '../../../../datos/administracion/inicio/datos-crear-categoria.js';

// Configura y abre el elemento reutilizable para crear categorías.
import {
    configurarModalCrearCategoria,
    abrirModalCrearCategoria
} from '../../../../elementos/modal-crear-categoria/modal-crear-categoria.js';

// Resuelve la plantilla reutilizable del modal.
const RUTA_MODAL =
    new URL(
        '../../../../elementos/modal-crear-categoria/modal-crear-categoria.html',
        import.meta.url
    );

let modalCrearCategoria = null;
let plantillaModalCrearCategoria = null;


// Obtiene y conserva el HTML reutilizable del modal.
async function obtenerHtmlModalCrearCategoria() {
    if (plantillaModalCrearCategoria) {
        return plantillaModalCrearCategoria;
    }

    const respuesta =
        await fetch(
            RUTA_MODAL
        );

    if (!respuesta.ok) {
        throw new Error(
            `No fue posible cargar modal-crear-categoria. HTTP ${respuesta.status}.`
        );
    }

    plantillaModalCrearCategoria =
        await respuesta.text();

    return plantillaModalCrearCategoria;
}


// Monta una única instancia reutilizable del modal sobre document.body.
async function obtenerModalCrearCategoria() {
    if (
        modalCrearCategoria &&
        modalCrearCategoria.isConnected
    ) {
        return modalCrearCategoria;
    }

    const html =
        await obtenerHtmlModalCrearCategoria();

    const montaje =
        document.createElement(
            'div'
        );

    montaje.innerHTML =
        html.trim();

    const elemento =
        montaje.firstElementChild;

    if (!elemento) {
        throw new Error(
            'El HTML de modal-crear-categoria no contiene el elemento esperado.'
        );
    }

    document.body.appendChild(
        elemento
    );

    modalCrearCategoria =
        configurarModalCrearCategoria(
            elemento,
            {
                configuracion:
                datosCrearCategoria,

                alCrear:
                crearCategoria
            }
        );

    return modalCrearCategoria;
}


// Abre el modal desde cualquier origen visual que solicite crear una categoría.
export async function mostrarCrearCategoria({
                                                origen = null
                                            } = {}) {
    const modal =
        await obtenerModalCrearCategoria();

    abrirModalCrearCategoria({
        modal,
        origen
    });
}