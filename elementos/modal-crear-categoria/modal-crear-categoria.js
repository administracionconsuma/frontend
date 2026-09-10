let modalActivo = null;
let focoAnterior = null;


// Obtiene un elemento interno del modal.
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
            '[data-modal-crear-categoria-mensaje]'
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
            '[data-modal-crear-categoria-vista-formulario]'
        );

    const exito =
        obtener(
            modal,
            '[data-modal-crear-categoria-vista-exito]'
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
            '[data-modal-crear-categoria-vista-formulario]'
        );

    const exito =
        obtener(
            modal,
            '[data-modal-crear-categoria-vista-exito]'
        );

    if (formulario) {
        formulario.hidden = true;
    }

    if (exito) {
        exito.hidden = false;
    }

    obtener(
        modal,
        '[data-modal-crear-categoria-exito-cerrar]'
    )?.focus();
}


// Aplica textos y configuración visual recibidos desde afuera.
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
        '[data-modal-crear-categoria-etiqueta]'
    ).textContent = etiqueta;

    obtener(
        modal,
        '[data-modal-crear-categoria-titulo]'
    ).textContent = titulo;

    obtener(
        modal,
        '[data-modal-crear-categoria-campo-nombre-etiqueta]'
    ).textContent = etiquetaNombre;

    obtener(
        modal,
        '[data-modal-crear-categoria-cancelar]'
    ).textContent = textoCancelar;

    const guardar =
        obtener(
            modal,
            '[data-modal-crear-categoria-guardar]'
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
            '[data-modal-crear-categoria-cerrar]'
        );

    if (ariaCerrar) {
        cerrar.setAttribute(
            'aria-label',
            ariaCerrar
        );
    }

    obtener(
        modal,
        '[data-modal-crear-categoria-exito-titulo]'
    ).textContent = exitoTitulo;

    obtener(
        modal,
        '[data-modal-crear-categoria-exito-texto]'
    ).textContent = exitoTexto;

    obtener(
        modal,
        '[data-modal-crear-categoria-exito-cerrar]'
    ).textContent = exitoBoton;

    const nombre =
        obtener(
            modal,
            '[data-modal-crear-categoria-campo-nombre]'
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
export function cerrarModalCrearCategoria() {
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
export function abrirModalCrearCategoria({
    modal,
    origen = null
}) {
    if (!modal) {
        throw new Error(
            'No se recibió modal-crear-categoria.'
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
            '[data-modal-crear-categoria-formulario]'
        );

    formulario?.reset();

    const guardar =
        obtener(
            modal,
            '[data-modal-crear-categoria-guardar]'
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
        '[data-modal-crear-categoria-panel]'
    )?.focus();

    obtener(
        modal,
        '[data-modal-crear-categoria-campo-nombre]'
    )?.focus();
}


// Configura comportamiento y callbacks sin conocer datos externos ni API.
export function configurarModalCrearCategoria(
    elemento,
    {
        configuracion = {},
        alCrear
    } = {}
) {
    if (!elemento) {
        throw new Error(
            'No se recibió el elemento modal-crear-categoria.'
        );
    }

    const formulario =
        obtener(
            elemento,
            '[data-modal-crear-categoria-formulario]'
        );

    const fondo =
        obtener(
            elemento,
            '[data-modal-crear-categoria-fondo]'
        );

    const cerrar =
        obtener(
            elemento,
            '[data-modal-crear-categoria-cerrar]'
        );

    const cancelar =
        obtener(
            elemento,
            '[data-modal-crear-categoria-cancelar]'
        );

    const cerrarExito =
        obtener(
            elemento,
            '[data-modal-crear-categoria-exito-cerrar]'
        );

    const guardar =
        obtener(
            elemento,
            '[data-modal-crear-categoria-guardar]'
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
            'La estructura de modal-crear-categoria está incompleta.'
        );
    }

    aplicarConfiguracion(
        elemento,
        configuracion
    );

    fondo.addEventListener(
        'click',
        cerrarModalCrearCategoria
    );

    cerrar.addEventListener(
        'click',
        cerrarModalCrearCategoria
    );

    cancelar.addEventListener(
        'click',
        cerrarModalCrearCategoria
    );

    cerrarExito.addEventListener(
        'click',
        cerrarModalCrearCategoria
    );

    elemento.addEventListener(
        'keydown',
        (evento) => {
            if (
                evento.key ===
                'Escape'
            ) {
                cerrarModalCrearCategoria();
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

            if (
                typeof alCrear !==
                'function'
            ) {
                return;
            }

            const datos =
                obtenerDatosFormulario(
                    formulario
                );

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
