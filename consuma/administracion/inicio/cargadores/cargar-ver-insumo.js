// Obtiene y administra insumos mediante la API administrativa.
import {
    obtenerInsumo,
    actualizarInsumo,
    cambiarEstadoInsumo
} from '../../../../cliente-api/administracion/insumos-api.js';

// Obtiene los textos definidos para la administración de insumos.
import {
    datosVerInsumo
} from '../../../../datos/administracion/inicio/datos-ver-insumo.js';

// Configura y abre el modal específico de Insumo.
import {
    configurarModalInsumo,
    abrirModalInsumo,
    mostrarMensajeModalInsumo
} from '../../../../elementos/modal-insumo/modal-insumo.js';

const RUTA_MODAL =
    new URL(
        '../../../../elementos/modal-insumo/modal-insumo.html',
        import.meta.url
    );

let modalInsumo = null;
let plantillaModalInsumo = null;

let insumoActualId = null;
let origenActual = null;


// Obtiene una sola vez la plantilla reutilizable del modal de Insumo.
async function obtenerHtmlModalInsumo() {
    if (plantillaModalInsumo) {
        return plantillaModalInsumo;
    }

    const respuesta =
        await fetch(
            RUTA_MODAL
        );

    if (!respuesta.ok) {
        throw new Error(
            `No fue posible cargar modal-insumo.html. HTTP ${respuesta.status}.`
        );
    }

    plantillaModalInsumo =
        await respuesta.text();

    return plantillaModalInsumo;
}


// Actualiza los textos configurables del modal utilizando el archivo de datos.
function configurarTextosModal(
    modal
) {
    const etiquetaNombre =
        modal.querySelector(
            '.modal-insumo__campo-etiqueta'
        );

    const editar =
        modal.querySelector(
            '[data-modal-insumo-editar]'
        );

    const cerrar =
        modal.querySelector(
            '[data-modal-insumo-cerrar-principal]'
        );

    const cerrarSuperior =
        modal.querySelector(
            '[data-modal-insumo-cerrar]'
        );

    if (etiquetaNombre) {
        etiquetaNombre.textContent =
            datosVerInsumo.secciones.general.campos.nombre;
    }

    if (editar) {
        editar.textContent =
            datosVerInsumo.acciones.editar;
    }

    if (cerrar) {
        cerrar.textContent =
            datosVerInsumo.textoCerrar;
    }

    if (cerrarSuperior) {
        cerrarSuperior.setAttribute(
            'aria-label',
            datosVerInsumo.ariaCerrar
        );
    }
}


// Obtiene nuevamente el insumo actual y refresca el modal.
async function refrescarInsumoActual() {
    if (!insumoActualId) {
        return;
    }

    const insumo =
        await obtenerInsumo(
            insumoActualId
        );

    abrirModalInsumo({
        modal:
        modalInsumo,

        origen:
        origenActual,

        insumo
    });
}


// Guarda el nuevo nombre del insumo y refresca su estado visual.
async function guardarInsumo({
                                 nombre,
                                 modal
                             }) {
    if (!insumoActualId) {
        return;
    }

    if (!nombre) {
        mostrarMensajeModalInsumo(
            modal,
            'Ingresá un nombre para el insumo.'
        );

        return;
    }

    try {
        mostrarMensajeModalInsumo(
            modal
        );

        await actualizarInsumo(
            insumoActualId,
            {
                nombre
            }
        );

        await refrescarInsumoActual();
    } catch (error) {
        mostrarMensajeModalInsumo(
            modal,
            error?.message ||
            'No fue posible actualizar el insumo.'
        );
    }
}


// Cambia ACTIVO ↔ INACTIVO y refresca el modal con el resultado real.
async function cambiarEstado({
                                 estado,
                                 modal
                             }) {
    if (!insumoActualId) {
        return;
    }

    try {
        mostrarMensajeModalInsumo(
            modal
        );

        await cambiarEstadoInsumo(
            insumoActualId,
            estado
        );

        await refrescarInsumoActual();
    } catch (error) {
        mostrarMensajeModalInsumo(
            modal,
            error?.message ||
            'No fue posible cambiar el estado del insumo.'
        );
    }
}


// Monta una única instancia lazy del modal específico de Insumo.
async function obtenerModalInsumo() {
    if (
        modalInsumo &&
        modalInsumo.isConnected
    ) {
        return modalInsumo;
    }

    const html =
        await obtenerHtmlModalInsumo();

    const plantilla =
        document.createElement(
            'template'
        );

    plantilla.innerHTML =
        html.trim();

    const elemento =
        plantilla.content.firstElementChild;

    if (!elemento) {
        throw new Error(
            'La plantilla modal-insumo.html no contiene un elemento válido.'
        );
    }

    document.body.appendChild(
        elemento
    );

    configurarTextosModal(
        elemento
    );

    modalInsumo =
        configurarModalInsumo(
            elemento,
            {
                alGuardar:
                guardarInsumo,

                alCambiarEstado:
                cambiarEstado
            }
        );

    return modalInsumo;
}


// Consulta y abre la administración del insumo seleccionado.
export async function mostrarVerInsumo({
                                           id,
                                           origen = null
                                       } = {}) {
    insumoActualId =
        id;

    origenActual =
        origen;

    const [
        modal,
        insumo
    ] =
        await Promise.all([
            obtenerModalInsumo(),

            obtenerInsumo(
                id
            )
        ]);

    abrirModalInsumo({
        modal,
        origen,
        insumo
    });
}