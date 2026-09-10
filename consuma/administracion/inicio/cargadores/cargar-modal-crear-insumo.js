// Crea insumos mediante la API administrativa.
import {
    crearInsumo
} from '../../../../cliente-api/administracion/insumos-api.js';

// Obtiene los textos y configuración estática del modal.
import {
    datosCrearInsumo
} from '../../../../datos/administracion/inicio/datos-crear-insumo.js';

// Configura y abre el elemento reutilizable para crear insumos.
import {
    configurarModalCrearInsumo,
    abrirModalCrearInsumo
} from '../../../../elementos/modal-crear-insumo/modal-crear-insumo.js';

// Resuelve la plantilla reutilizable del modal desde la ubicación real del cargador.
const RUTA_MODAL =
    new URL(
        '../../../../elementos/modal-crear-insumo/modal-crear-insumo.html',
        import.meta.url
    );

let modalCrearInsumo = null;
let plantillaModalCrearInsumo = null;


// Obtiene y conserva el HTML reutilizable del modal.
async function obtenerHtmlModalCrearInsumo() {
    if (plantillaModalCrearInsumo) {
        return plantillaModalCrearInsumo;
    }

    const respuesta =
        await fetch(
            RUTA_MODAL
        );

    if (!respuesta.ok) {
        throw new Error(
            `No fue posible cargar modal-crear-insumo. HTTP ${respuesta.status}.`
        );
    }

    plantillaModalCrearInsumo =
        await respuesta.text();

    return plantillaModalCrearInsumo;
}


// Monta una única instancia reutilizable del modal sobre document.body.
async function obtenerModalCrearInsumo() {
    if (
        modalCrearInsumo &&
        modalCrearInsumo.isConnected
    ) {
        return modalCrearInsumo;
    }

    const html =
        await obtenerHtmlModalCrearInsumo();

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
            'El HTML de modal-crear-insumo no contiene el elemento esperado.'
        );
    }

    document.body.appendChild(
        elemento
    );

    modalCrearInsumo =
        configurarModalCrearInsumo(
            elemento,
            {
                configuracion:
                datosCrearInsumo,

                alCrear:
                crearInsumo
            }
        );

    return modalCrearInsumo;
}


// Abre el modal desde cualquier origen visual que solicite crear un insumo.
export async function mostrarCrearInsumo({
                                             origen = null
                                         } = {}) {
    const modal =
        await obtenerModalCrearInsumo();

    abrirModalCrearInsumo({
        modal,
        origen
    });
}