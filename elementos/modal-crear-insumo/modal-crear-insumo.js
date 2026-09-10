let modalActivo = null;
let focoAnterior = null;


// Obtiene un elemento interno obligatorio del modal.
function obtener(
    modal,
    selector
) {
    return modal.querySelector(
        selector
    );
}


// Muestra u oculta el mensaje transversal del formulario.
function mostrarMensaje(
    modal,
    mensaje = ''
) {
    const elemento =
        obtener(
            modal,
            '[data-modal-crear-insumo-mensaje]'
        );

    if (!elemento) {
        return;
    }

    elemento.textContent =
        mensaje;

    elemento.hidden =
        !mensaje;
}


// Restablece la vista principal antes de cada apertura.
function mostrarFormulario(
    modal
) {
    const formulario =
        obtener(
            modal,
            '[data-modal-crear-insumo-vista-formulario]'
        );

    const exito =
        obtener(
            modal,
            '[data-modal-crear-insumo-vista-exito]'
        );

    if (formulario) {
        formulario.hidden = false;
    }

    if (exito) {
        exito.hidden = true;
    }
}


// Cambia el formulario por la confirmación de creación.
function mostrarExito(
    modal
) {
    const formulario =
        obtener(
            modal,
            '[data-modal-crear-insumo-vista-formulario]'
        );

    const exito =
        obtener(
            modal,
            '[data-modal-crear-insumo-vista-exito]'
        );

    if (formulario) {
        formulario.hidden = true;
    }

    if (exito) {
        exito.hidden = false;
    }

    obtener(
        modal,
        '[data-modal-crear-insumo-exito-cerrar]'
    )?.focus();
}


// Aplica los textos y configuración visual recibidos desde afuera.
function aplicarConfiguracion(
    modal,
    {
        etiqueta = '',
        titulo = '',
        etiquetaNombre = '',
        textoCancelar = '',
        textoGuardar = '',
        textoGuardando = '',
        ariaCerrar = '',
        exitoTitulo = '',
        exitoTexto = '',
        exitoBoton = '',
        longitudMaximaNombre = null
    } = {}
) {
    obtener(
        modal,
        '[data-modal-crear-insumo-etiqueta]'
    ).textContent = etiqueta;

    obtener(
        modal,
        '[data-modal-crear-insumo-titulo]'
    ).textContent = titulo;

    obtener(
        modal,
        '[data-modal-crear-insumo-campo-nombre-etiqueta]'
    ).textContent = etiquetaNombre;

    obtener(
        modal,
        '[data-modal-crear-insumo-cancelar]'
    ).textContent = textoCancelar;

    const guardar =
        obtener(
            modal,
            '[data-modal-crear-insumo-guardar]'
        );

    guardar.textContent =
        textoGuardar;

    guardar.dataset.textoNormal =
        textoGuardar;

    guardar.dataset.textoCargando =
        textoGuardando;

    const cerrar =
        obtener(
            modal,
            '[data-modal-crear-insumo-cerrar]'
        );

    if (ariaCerrar) {
        cerrar.setAttribute(
            'aria-label',
            ariaCerrar
        );
    }

    obtener(
        modal,
        '[data-modal-crear-insumo-exito-titulo]'
    ).textContent = exitoTitulo;

    obtener(
        modal,
        '[data-modal-crear-insumo-exito-texto]'
    ).textContent = exitoTexto;

    obtener(
        modal,
        '[data-modal-crear-insumo-exito-cerrar]'
    ).textContent = exitoBoton;

    const nombre =
        obtener(
            modal,
            '[data-modal-crear-insumo-campo-nombre]'
        );

    if (
        Number.isInteger(
            longitudMaximaNombre
        ) &&
        longitudMaximaNombre > 0
    ) {
        nombre.maxLength =
            longitudMaximaNombre;
    } else {
        nombre.removeAttribute(
            'maxlength'
        );
    }
}


// Construye los datos del formulario sin conocer persistencia ni API.
function obtenerDatosFormulario(
    formulario
) {
    const datos =
        Object.fromEntries(
            new FormData(
                formulario
            ).entries()
        );

    if (
        typeof datos.nombre ===
        'string'
    ) {
        datos.nombre =
            datos.nombre.trim();
    }

    return datos;
}


// Cierra el modal y devuelve el foco al elemento que originó la apertura.
export function cerrarModalCrearInsumo() {
    if (!modalActivo) {
        return;
    }

    modalActivo.hidden =
        true;

    if (
        focoAnterior &&
        focoAnterior.isConnected
    ) {
        focoAnterior.focus();
    }

    modalActivo =
        null;

    focoAnterior =
        null;
}


// Abre una instancia ya configurada y prepara el formulario.
export function abrirModalCrearInsumo({
    modal,
    origen = null
}) {
    if (!modal) {
        throw new Error(
            'No se recibió modal-crear-insumo.'
        );
    }

    if (modalActivo) {
        return;
    }

    modalActivo =
        modal;

    focoAnterior =
        origen ||
        document.activeElement;

    mostrarFormulario(
        modal
    );

    const formulario =
        obtener(
            modal,
            '[data-modal-crear-insumo-formulario]'
        );

    formulario?.reset();

    const guardar =
        obtener(
            modal,
            '[data-modal-crear-insumo-guardar]'
        );

    if (guardar) {
        guardar.disabled =
            false;

        guardar.textContent =
            guardar.dataset.textoNormal ||
            '';
    }

    mostrarMensaje(
        modal
    );

    modal.hidden =
        false;

    obtener(
        modal,
        '[data-modal-crear-insumo-panel]'
    )?.focus();

    obtener(
        modal,
        '[data-modal-crear-insumo-campo-nombre]'
    )?.focus();
}


// Configura comportamiento y callbacks sin conocer datos externos ni API.
export function configurarModalCrearInsumo(
    elemento,
    {
        configuracion = {},
        alCrear
    } = {}
) {
    if (!elemento) {
        throw new Error(
            'No se recibió el elemento modal-crear-insumo.'
        );
    }

    const formulario =
        obtener(
            elemento,
            '[data-modal-crear-insumo-formulario]'
        );

    const fondo =
        obtener(
            elemento,
            '[data-modal-crear-insumo-fondo]'
        );

    const cerrar =
        obtener(
            elemento,
            '[data-modal-crear-insumo-cerrar]'
        );

    const cancelar =
        obtener(
            elemento,
            '[data-modal-crear-insumo-cancelar]'
        );

    const cerrarExito =
        obtener(
            elemento,
            '[data-modal-crear-insumo-exito-cerrar]'
        );

    const guardar =
        obtener(
            elemento,
            '[data-modal-crear-insumo-guardar]'
        );

    if (
        !formulario ||
        !fondo ||
        !cerrar ||
        !cancelar ||
        !cerrarExito ||
        !guardar
    ) {
        throw new Error(
            'La estructura de modal-crear-insumo está incompleta.'
        );
    }

    aplicarConfiguracion(
        elemento,
        configuracion
    );

    fondo.addEventListener(
        'click',
        cerrarModalCrearInsumo
    );

    cerrar.addEventListener(
        'click',
        cerrarModalCrearInsumo
    );

    cancelar.addEventListener(
        'click',
        cerrarModalCrearInsumo
    );

    cerrarExito.addEventListener(
        'click',
        cerrarModalCrearInsumo
    );

    elemento.addEventListener(
        'keydown',
        (evento) => {
            if (
                evento.key ===
                'Escape'
            ) {
                cerrarModalCrearInsumo();
            }
        }
    );

    formulario.addEventListener(
        'submit',
        async (evento) => {
            evento.preventDefault();

            mostrarMensaje(
                elemento
            );

            if (
                !formulario.reportValidity()
            ) {
                return;
            }

            const datos =
                obtenerDatosFormulario(
                    formulario
                );

            if (
                typeof alCrear !==
                'function'
            ) {
                return;
            }

            guardar.disabled =
                true;

            guardar.textContent =
                guardar.dataset.textoCargando ||
                guardar.dataset.textoNormal ||
                '';

            try {
                await alCrear(
                    datos
                );

                mostrarExito(
                    elemento
                );
            } catch (error) {
                mostrarMensaje(
                    elemento,
                    error?.message || ''
                );
            } finally {
                guardar.disabled =
                    false;

                guardar.textContent =
                    guardar.dataset.textoNormal ||
                    '';
            }
        }
    );

    return elemento;
}
