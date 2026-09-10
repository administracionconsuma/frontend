/*
    Elemento específico para administrar un insumo.
    No conoce la API ni la pantalla que lo abre.
*/

let estadoActual = null;
let nombreActual = '';
let focoAnterior = null;

let callbacks = {
    alGuardar: null,
    alCambiarEstado: null
};


// Obtiene un nodo interno del modal.
function obtener(
    elemento,
    selector
) {
    return elemento?.querySelector(
        selector
    ) ?? null;
}


// Controla si el cuerpo del modal necesita mostrarse.
function actualizarVisibilidadContenido(
    modal
) {
    const contenido =
        obtener(
            modal,
            '.modal-insumo__contenido'
        );

    const formulario =
        obtener(
            modal,
            '[data-modal-insumo-formulario]'
        );

    const mensaje =
        obtener(
            modal,
            '[data-modal-insumo-mensaje]'
        );

    if (
        !contenido ||
        !formulario ||
        !mensaje
    ) {
        return;
    }

    contenido.hidden =
        formulario.hidden &&
        mensaje.hidden;
}


// Actualiza el estado visual y el texto de la acción asociada.
function representarEstado(
    modal,
    estado
) {
    const estadoElemento =
        obtener(
            modal,
            '[data-modal-insumo-estado]'
        );

    const accionEstado =
        obtener(
            modal,
            '[data-modal-insumo-estado-accion]'
        );

    estadoActual =
        estado || '';

    estadoElemento.textContent =
        estadoActual;

    estadoElemento.dataset.estado =
        estadoActual;

    accionEstado.textContent =
        estadoActual === 'ACTIVO'
            ? 'Desactivar'
            : 'Activar';
}


// Alterna entre la vista operativa y la edición del nombre.
function establecerModoEdicion(
    modal,
    editando
) {
    const formulario =
        obtener(
            modal,
            '[data-modal-insumo-formulario]'
        );

    const nombre =
        obtener(
            modal,
            '[data-modal-insumo-nombre]'
        );

    const editar =
        obtener(
            modal,
            '[data-modal-insumo-editar]'
        );

    const guardar =
        obtener(
            modal,
            '[data-modal-insumo-guardar]'
        );

    const cancelar =
        obtener(
            modal,
            '[data-modal-insumo-cancelar-edicion]'
        );

    const accionEstado =
        obtener(
            modal,
            '[data-modal-insumo-estado-accion]'
        );

    const cerrarPrincipal =
        obtener(
            modal,
            '[data-modal-insumo-cerrar-principal]'
        );

    formulario.hidden =
        !editando;

    nombre.disabled =
        !editando;

    editar.hidden =
        editando;

    guardar.hidden =
        !editando;

    cancelar.hidden =
        !editando;

    accionEstado.hidden =
        editando;

    /*
        El cierre ya está disponible mediante la X superior.
        No se muestra una segunda acción redundante.
    */
    cerrarPrincipal.hidden =
        true;

    if (editando) {
        nombre.value =
            nombreActual;

        nombre.focus();
        nombre.select();
    }

    actualizarVisibilidadContenido(
        modal
    );
}


// Muestra un mensaje funcional recibido desde el cargador.
export function mostrarMensajeModalInsumo(
    modal,
    mensaje = ''
) {
    const elemento =
        obtener(
            modal,
            '[data-modal-insumo-mensaje]'
        );

    if (!elemento) {
        return;
    }

    elemento.textContent =
        mensaje;

    elemento.hidden =
        !mensaje;

    actualizarVisibilidadContenido(
        modal
    );
}


// Cierra el modal y restaura el foco anterior.
export function cerrarModalInsumo(
    modal
) {
    if (!modal) {
        return;
    }

    modal.hidden =
        true;

    if (
        focoAnterior &&
        focoAnterior.isConnected
    ) {
        focoAnterior.focus();
    }

    focoAnterior =
        null;
}


// Abre el modal con los datos actuales del insumo.
export function abrirModalInsumo({
                                     modal,
                                     origen = null,
                                     insumo
                                 }) {
    if (
        !modal ||
        !insumo
    ) {
        throw new Error(
            'No se recibió modal o insumo para abrir modal-insumo.'
        );
    }

    focoAnterior =
        origen ||
        document.activeElement;

    const titulo =
        obtener(
            modal,
            '[data-modal-insumo-titulo]'
        );

    const nombre =
        obtener(
            modal,
            '[data-modal-insumo-nombre]'
        );

    nombreActual =
        insumo.nombre || '';

    titulo.textContent =
        nombreActual;

    nombre.value =
        nombreActual;

    representarEstado(
        modal,
        insumo.estado
    );

    mostrarMensajeModalInsumo(
        modal
    );

    establecerModoEdicion(
        modal,
        false
    );

    modal.hidden =
        false;

    obtener(
        modal,
        '[data-modal-insumo-panel]'
    )?.focus();
}


// Configura una instancia del modal con callbacks externos.
export function configurarModalInsumo(
    modal,
    {
        alGuardar = null,
        alCambiarEstado = null
    } = {}
) {
    if (!modal) {
        throw new Error(
            'No se recibió modal-insumo.'
        );
    }

    callbacks = {
        alGuardar,
        alCambiarEstado
    };

    const nombre =
        obtener(
            modal,
            '[data-modal-insumo-nombre]'
        );

    const formulario =
        obtener(
            modal,
            '[data-modal-insumo-formulario]'
        );

    const editar =
        obtener(
            modal,
            '[data-modal-insumo-editar]'
        );

    const guardar =
        obtener(
            modal,
            '[data-modal-insumo-guardar]'
        );

    const cancelar =
        obtener(
            modal,
            '[data-modal-insumo-cancelar-edicion]'
        );

    const accionEstado =
        obtener(
            modal,
            '[data-modal-insumo-estado-accion]'
        );

    const cerrar =
        obtener(
            modal,
            '[data-modal-insumo-cerrar]'
        );

    const cerrarPrincipal =
        obtener(
            modal,
            '[data-modal-insumo-cerrar-principal]'
        );

    const fondo =
        obtener(
            modal,
            '[data-modal-insumo-fondo]'
        );

    if (
        !nombre ||
        !formulario ||
        !editar ||
        !guardar ||
        !cancelar ||
        !accionEstado ||
        !cerrar ||
        !cerrarPrincipal ||
        !fondo
    ) {
        throw new Error(
            'La estructura de modal-insumo está incompleta.'
        );
    }

    editar.addEventListener(
        'click',
        () => {
            mostrarMensajeModalInsumo(
                modal
            );

            establecerModoEdicion(
                modal,
                true
            );
        }
    );

    cancelar.addEventListener(
        'click',
        () => {
            nombre.value =
                nombreActual;

            mostrarMensajeModalInsumo(
                modal
            );

            establecerModoEdicion(
                modal,
                false
            );
        }
    );

    formulario.addEventListener(
        'submit',
        async (evento) => {
            evento.preventDefault();

            if (
                typeof callbacks.alGuardar !==
                'function'
            ) {
                return;
            }

            await callbacks.alGuardar({
                nombre:
                    nombre.value.trim(),

                modal
            });
        }
    );

    guardar.addEventListener(
        'click',
        () => {
            formulario.requestSubmit();
        }
    );

    accionEstado.addEventListener(
        'click',
        async () => {
            if (
                typeof callbacks.alCambiarEstado !==
                'function'
            ) {
                return;
            }

            const nuevoEstado =
                estadoActual === 'ACTIVO'
                    ? 'INACTIVO'
                    : 'ACTIVO';

            await callbacks.alCambiarEstado({
                estado:
                nuevoEstado,

                modal
            });
        }
    );

    const cerrarModal =
        () => {
            cerrarModalInsumo(
                modal
            );
        };

    cerrar.addEventListener(
        'click',
        cerrarModal
    );

    fondo.addEventListener(
        'click',
        cerrarModal
    );

    modal.addEventListener(
        'keydown',
        (evento) => {
            if (
                evento.key === 'Escape'
            ) {
                cerrarModal();
            }
        }
    );

    return modal;
}