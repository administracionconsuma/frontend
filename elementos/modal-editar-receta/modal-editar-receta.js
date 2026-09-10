/*
    Elemento específico para editar una receta completa.

    No conoce API, endpoints, backend ni cargadores.
    Recibe receta, catálogos y callbacks desde afuera.
*/

let modalActivo = null;
let focoAnterior = null;


// Obtiene un nodo interno del modal.
function obtener(
    elemento,
    selector
) {
    return elemento?.querySelector(
        selector
    ) ?? null;
}


// Crea una opción para select sin conocer el origen del catálogo.
function crearOpcion({
    valor = '',
    etiqueta = '',
    deshabilitada = false
} = {}) {
    const opcion =
        document.createElement(
            'option'
        );

    opcion.value =
        String(
            valor
        );

    opcion.textContent =
        etiqueta;

    opcion.disabled =
        deshabilitada;

    return opcion;
}


// Carga un conjunto de opciones dentro de un select.
function cargarOpciones(
    selector,
    opciones = [],
    valorActual = ''
) {
    selector.replaceChildren();

    opciones.forEach(
        (opcion) => {
            selector.appendChild(
                crearOpcion(
                    opcion
                )
            );
        }
    );

    selector.value =
        String(
            valorActual ?? ''
        );
}


// Crea una fila visual de composición a partir de la plantilla interna.
function crearFilaInsumo(
    modal
) {
    const plantilla =
        obtener(
            modal,
            '[data-modal-editar-receta-plantilla-insumo]'
        );

    if (!plantilla) {
        throw new Error(
            'La estructura de modal-editar-receta no contiene la plantilla de insumo.'
        );
    }

    return plantilla.content.firstElementChild.cloneNode(
        true
    );
}


// Actualiza el estado vacío del bloque de composición.
function actualizarEstadoVacio(
    modal
) {
    const contenedor =
        obtener(
            modal,
            '[data-modal-editar-receta-insumos]'
        );

    const vacio =
        obtener(
            modal,
            '[data-modal-editar-receta-insumos-vacio]'
        );

    if (
        !contenedor ||
        !vacio
    ) {
        return;
    }

    vacio.hidden =
        contenedor.children.length >
        0;
}


// Configura una fila de composición con datos y catálogo externos.
function configurarFilaInsumo(
    modal,
    fila,
    {
        insumoId = '',
        cantidad = '',
        unidad = ''
    } = {},
    opcionesInsumos = [],
    textos = {}
) {
    const selector =
        obtener(
            fila,
            '[data-modal-editar-receta-insumo-selector]'
        );

    const cantidadElemento =
        obtener(
            fila,
            '[data-modal-editar-receta-cantidad]'
        );

    const unidadElemento =
        obtener(
            fila,
            '[data-modal-editar-receta-unidad]'
        );

    const quitar =
        obtener(
            fila,
            '[data-modal-editar-receta-quitar-insumo]'
        );

    const etiquetaInsumo =
        obtener(
            fila,
            '[data-modal-editar-receta-insumo-etiqueta]'
        );

    const etiquetaCantidad =
        obtener(
            fila,
            '[data-modal-editar-receta-cantidad-etiqueta]'
        );

    const etiquetaUnidad =
        obtener(
            fila,
            '[data-modal-editar-receta-unidad-etiqueta]'
        );

    if (
        !selector ||
        !cantidadElemento ||
        !unidadElemento ||
        !quitar ||
        !etiquetaInsumo ||
        !etiquetaCantidad ||
        !etiquetaUnidad
    ) {
        throw new Error(
            'La fila de insumo de modal-editar-receta está incompleta.'
        );
    }

    etiquetaInsumo.textContent =
        textos.etiquetaInsumo || '';

    etiquetaCantidad.textContent =
        textos.etiquetaCantidad || '';

    etiquetaUnidad.textContent =
        textos.etiquetaUnidad || '';

    quitar.textContent =
        textos.textoQuitar || '';

    cargarOpciones(
        selector,
        opcionesInsumos,
        insumoId
    );

    cantidadElemento.value =
        cantidad;

    unidadElemento.value =
        unidad;

    quitar.addEventListener(
        'click',
        () => {
            fila.remove();

            actualizarEstadoVacio(
                modal
            );
        }
    );

    return fila;
}


// Agrega una nueva fila de composición.
function agregarFilaInsumo(
    modal,
    datos,
    opcionesInsumos,
    textos
) {
    const contenedor =
        obtener(
            modal,
            '[data-modal-editar-receta-insumos]'
        );

    if (!contenedor) {
        throw new Error(
            'No existe el contenedor de insumos de modal-editar-receta.'
        );
    }

    const fila =
        configurarFilaInsumo(
            modal,
            crearFilaInsumo(
                modal
            ),
            datos,
            opcionesInsumos,
            textos
        );

    contenedor.appendChild(
        fila
    );

    actualizarEstadoVacio(
        modal
    );
}


// Obtiene la composición completa representada actualmente en el formulario.
function obtenerInsumos(
    modal
) {
    return Array.from(
        modal.querySelectorAll(
            '[data-modal-editar-receta-insumo]'
        )
    ).map(
        (fila) => ({
            insumoId:
                Number(
                    obtener(
                        fila,
                        '[data-modal-editar-receta-insumo-selector]'
                    )?.value
                ),

            cantidad:
                Number(
                    obtener(
                        fila,
                        '[data-modal-editar-receta-cantidad]'
                    )?.value
                ),

            unidad:
                obtener(
                    fila,
                    '[data-modal-editar-receta-unidad]'
                )?.value.trim() ||
                ''
        })
    );
}


// Extrae el estado final del formulario para entregarlo al cargador.
function obtenerDatosFormulario(
    modal
) {
    return {
        titulo:
            obtener(
                modal,
                '[data-modal-editar-receta-campo-titulo]'
            )?.value.trim() ||
            '',

        categoriaId:
            Number(
                obtener(
                    modal,
                    '[data-modal-editar-receta-categoria]'
                )?.value
            ),

        preparacion:
            obtener(
                modal,
                '[data-modal-editar-receta-preparacion]'
            )?.value.trim() ||
            '',

        insumos:
            obtenerInsumos(
                modal
            )
    };
}


// Muestra un mensaje funcional entregado desde afuera.
export function mostrarMensajeModalEditarReceta(
    modal,
    mensaje = ''
) {
    const elemento =
        obtener(
            modal,
            '[data-modal-editar-receta-mensaje]'
        );

    if (!elemento) {
        return;
    }

    elemento.textContent =
        mensaje;

    elemento.hidden =
        !mensaje;
}


// Cierra el modal y restaura el foco anterior.
export function cerrarModalEditarReceta() {
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


// Abre el modal con el estado real recibido de una receta.
export function abrirModalEditarReceta({
    modal,
    origen = null,
    receta,
    categorias = [],
    insumos = [],
    textos = {}
}) {
    if (
        !modal ||
        !receta
    ) {
        throw new Error(
            'No se recibió modal o receta para abrir modal-editar-receta.'
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

    const titulo =
        obtener(
            modal,
            '[data-modal-editar-receta-campo-titulo]'
        );

    const categoria =
        obtener(
            modal,
            '[data-modal-editar-receta-categoria]'
        );

    const preparacion =
        obtener(
            modal,
            '[data-modal-editar-receta-preparacion]'
        );

    const contenedorInsumos =
        obtener(
            modal,
            '[data-modal-editar-receta-insumos]'
        );

    if (
        !titulo ||
        !categoria ||
        !preparacion ||
        !contenedorInsumos
    ) {
        throw new Error(
            'La estructura editable de modal-editar-receta está incompleta.'
        );
    }

    titulo.value =
        receta.titulo ||
        '';

    preparacion.value =
        receta.preparacion ||
        '';

    cargarOpciones(
        categoria,
        categorias,
        receta.categoriaId
    );

    contenedorInsumos.replaceChildren();

    const composicion =
        Array.isArray(
            receta.insumos
        )
            ? receta.insumos
            : [];

    composicion.forEach(
        (item) => {
            agregarFilaInsumo(
                modal,
                item,
                insumos,
                textos
            );
        }
    );

    actualizarEstadoVacio(
        modal
    );

    mostrarMensajeModalEditarReceta(
        modal
    );

    modal.hidden =
        false;

    obtener(
        modal,
        '[data-modal-editar-receta-panel]'
    )?.focus();
}


// Configura textos visuales y callbacks externos de la instancia.
export function configurarModalEditarReceta(
    modal,
    {
        textos = {},
        alGuardar = null
    } = {}
) {
    if (!modal) {
        throw new Error(
            'No se recibió modal-editar-receta.'
        );
    }

    const formulario =
        obtener(
            modal,
            '[data-modal-editar-receta-formulario]'
        );

    const cerrar =
        obtener(
            modal,
            '[data-modal-editar-receta-cerrar]'
        );

    const cancelar =
        obtener(
            modal,
            '[data-modal-editar-receta-cancelar]'
        );

    const guardar =
        obtener(
            modal,
            '[data-modal-editar-receta-guardar]'
        );

    const fondo =
        obtener(
            modal,
            '[data-modal-editar-receta-fondo]'
        );

    const agregarInsumo =
        obtener(
            modal,
            '[data-modal-editar-receta-agregar-insumo]'
        );

    if (
        !formulario ||
        !cerrar ||
        !cancelar ||
        !guardar ||
        !fondo ||
        !agregarInsumo
    ) {
        throw new Error(
            'La estructura de modal-editar-receta está incompleta.'
        );
    }

    obtener(
        modal,
        '[data-modal-editar-receta-etiqueta]'
    ).textContent =
        textos.etiqueta || '';

    obtener(
        modal,
        '[data-modal-editar-receta-titulo]'
    ).textContent =
        textos.titulo || '';

    obtener(
        modal,
        '[data-modal-editar-receta-etiqueta-titulo]'
    ).textContent =
        textos.etiquetaTitulo || '';

    obtener(
        modal,
        '[data-modal-editar-receta-etiqueta-categoria]'
    ).textContent =
        textos.etiquetaCategoria || '';

    obtener(
        modal,
        '[data-modal-editar-receta-titulo-insumos]'
    ).textContent =
        textos.tituloInsumos || '';

    const descripcionInsumos =
        obtener(
            modal,
            '[data-modal-editar-receta-descripcion-insumos]'
        );

    descripcionInsumos.textContent =
        textos.descripcionInsumos || '';

    descripcionInsumos.hidden =
        !textos.descripcionInsumos;

    obtener(
        modal,
        '[data-modal-editar-receta-etiqueta-preparacion]'
    ).textContent =
        textos.etiquetaPreparacion || '';

    obtener(
        modal,
        '[data-modal-editar-receta-insumos-vacio]'
    ).textContent =
        textos.mensajeInsumosVacio || '';

    agregarInsumo.textContent =
        textos.textoAgregarInsumo || '';

    cancelar.textContent =
        textos.textoCancelar || '';

    guardar.textContent =
        textos.textoGuardar || '';

    cerrar.setAttribute(
        'aria-label',
        textos.ariaCerrar ||
        'Cerrar edición'
    );

    /*
        El catálogo de insumos vigente se actualiza en cada apertura.
        Se guarda únicamente en la instancia visual actual.
    */
    let opcionesInsumosActuales =
        [];

    let textosFilaActuales =
        {};

    const abrirOriginal =
        abrirModalEditarReceta;

    modal.__configurarAperturaEditarReceta =
        (
            opcionesInsumos,
            textosFila
        ) => {
            opcionesInsumosActuales =
                opcionesInsumos;

            textosFilaActuales =
                textosFila;
        };

    agregarInsumo.addEventListener(
        'click',
        () => {
            agregarFilaInsumo(
                modal,
                {},
                opcionesInsumosActuales,
                textosFilaActuales
            );
        }
    );

    const cerrarModal =
        () => {
            cerrarModalEditarReceta();
        };

    cerrar.addEventListener(
        'click',
        cerrarModal
    );

    cancelar.addEventListener(
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
                evento.key ===
                'Escape'
            ) {
                cerrarModal();
            }
        }
    );

    formulario.addEventListener(
        'submit',
        async (evento) => {
            evento.preventDefault();

            mostrarMensajeModalEditarReceta(
                modal
            );

            if (
                !formulario.reportValidity()
            ) {
                return;
            }

            const datos =
                obtenerDatosFormulario(
                    modal
                );

            if (
                datos.insumos.length ===
                0
            ) {
                mostrarMensajeModalEditarReceta(
                    modal,
                    textos.mensajeInsumosRequeridos ||
                    ''
                );

                return;
            }

            const ids =
                datos.insumos.map(
                    (item) =>
                        item.insumoId
                );

            if (
                new Set(
                    ids
                ).size !==
                ids.length
            ) {
                mostrarMensajeModalEditarReceta(
                    modal,
                    textos.mensajeInsumoDuplicado ||
                    ''
                );

                return;
            }

            if (
                typeof alGuardar !==
                'function'
            ) {
                return;
            }

            guardar.disabled =
                true;

            try {
                await alGuardar(
                    datos
                );
            } finally {
                guardar.disabled =
                    false;
            }
        }
    );

    return modal;
}


// Actualiza el catálogo de insumos utilizado por nuevas filas antes de abrir.
export function prepararCatalogoModalEditarReceta(
    modal,
    {
        insumos = [],
        textosFila = {}
    } = {}
) {
    if (
        typeof modal?.__configurarAperturaEditarReceta !==
        'function'
    ) {
        throw new Error(
            'modal-editar-receta todavía no fue configurado.'
        );
    }

    modal.__configurarAperturaEditarReceta(
        insumos,
        textosFila
    );
}
