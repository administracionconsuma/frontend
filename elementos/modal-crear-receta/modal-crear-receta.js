let modalActivo = null;
let focoAnterior = null;
let configuracionActual = {};


// Obtiene un nodo interno del modal.
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
            '[data-modal-crear-receta-mensaje]'
        );

    if (!elemento) {
        return;
    }

    elemento.textContent =
        mensaje;

    elemento.hidden =
        !mensaje;
}


// Muestra nuevamente el formulario antes de cada apertura.
function mostrarFormulario(
    modal
) {
    const formulario =
        obtener(
            modal,
            '[data-modal-crear-receta-vista-formulario]'
        );

    const exito =
        obtener(
            modal,
            '[data-modal-crear-receta-vista-exito]'
        );

    if (formulario) {
        formulario.hidden = false;
    }

    if (exito) {
        exito.hidden = true;
    }
}


// Sustituye el formulario por la confirmación de creación.
function mostrarExito(
    modal
) {
    const formulario =
        obtener(
            modal,
            '[data-modal-crear-receta-vista-formulario]'
        );

    const exito =
        obtener(
            modal,
            '[data-modal-crear-receta-vista-exito]'
        );

    if (formulario) {
        formulario.hidden = true;
    }

    if (exito) {
        exito.hidden = false;
    }

    obtener(
        modal,
        '[data-modal-crear-receta-exito-cerrar]'
    )?.focus();
}


// Crea una opción reutilizable para cualquier catálogo recibido.
function crearOpcion(
    valor,
    texto
) {
    const opcion =
        document.createElement(
            'option'
        );

    opcion.value =
        String(
            valor
        );

    opcion.textContent =
        texto;

    return opcion;
}


// Carga las categorías recibidas al momento de abrir el modal.
function cargarCategorias(
    modal,
    categorias = [],
    textoOpcionInicial = ''
) {
    const select =
        obtener(
            modal,
            '[data-modal-crear-receta-campo-categoria]'
        );

    select.replaceChildren();

    const inicial =
        crearOpcion(
            '',
            textoOpcionInicial
        );

    inicial.disabled =
        true;

    inicial.selected =
        true;

    select.appendChild(
        inicial
    );

    categorias.forEach(
        (categoria) => {
            select.appendChild(
                crearOpcion(
                    categoria.id,
                    categoria.nombre
                )
            );
        }
    );
}


// Carga los insumos recibidos en una fila sin conocer su origen.
function cargarOpcionesInsumo(
    fila,
    insumos = [],
    textoOpcionInicial = ''
) {
    const select =
        obtener(
            fila,
            '[data-modal-crear-receta-insumo]'
        );

    select.replaceChildren();

    const inicial =
        crearOpcion(
            '',
            textoOpcionInicial
        );

    inicial.disabled =
        true;

    inicial.selected =
        true;

    select.appendChild(
        inicial
    );

    insumos.forEach(
        (insumo) => {
            select.appendChild(
                crearOpcion(
                    insumo.id,
                    insumo.nombre
                )
            );
        }
    );
}


// Aplica únicamente textos y configuración estática recibida desde afuera.
function aplicarConfiguracion(
    modal,
    configuracion = {}
) {
    const asignaciones = [
        [
            '[data-modal-crear-receta-etiqueta]',
            configuracion.etiqueta
        ],
        [
            '[data-modal-crear-receta-titulo]',
            configuracion.titulo
        ],
        [
            '[data-modal-crear-receta-campo-titulo-etiqueta]',
            configuracion.etiquetaTitulo
        ],
        [
            '[data-modal-crear-receta-campo-categoria-etiqueta]',
            configuracion.etiquetaCategoria
        ],
        [
            '[data-modal-crear-receta-campo-preparacion-etiqueta]',
            configuracion.etiquetaPreparacion
        ],
        [
            '[data-modal-crear-receta-insumos-titulo]',
            configuracion.tituloInsumos
        ],
        [
            '[data-modal-crear-receta-insumos-descripcion]',
            configuracion.descripcionInsumos
        ],
        [
            '[data-modal-crear-receta-agregar-insumo]',
            configuracion.textoAgregarInsumo
        ],
        [
            '[data-modal-crear-receta-cancelar]',
            configuracion.textoCancelar
        ],
        [
            '[data-modal-crear-receta-exito-titulo]',
            configuracion.exitoTitulo
        ],
        [
            '[data-modal-crear-receta-exito-texto]',
            configuracion.exitoTexto
        ],
        [
            '[data-modal-crear-receta-exito-cerrar]',
            configuracion.exitoBoton
        ]
    ];

    asignaciones.forEach(
        ([selector, valor]) => {
            const elemento =
                obtener(
                    modal,
                    selector
                );

            if (elemento) {
                elemento.textContent =
                    valor || '';
            }
        }
    );

    const cerrar =
        obtener(
            modal,
            '[data-modal-crear-receta-cerrar]'
        );

    if (
        cerrar &&
        configuracion.ariaCerrar
    ) {
        cerrar.setAttribute(
            'aria-label',
            configuracion.ariaCerrar
        );
    }

    const guardar =
        obtener(
            modal,
            '[data-modal-crear-receta-guardar]'
        );

    guardar.textContent =
        configuracion.textoGuardar || '';

    guardar.dataset.textoNormal =
        configuracion.textoGuardar || '';

    guardar.dataset.textoCargando =
        configuracion.textoGuardando || '';
}


// Crea una nueva fila de composición utilizando los catálogos vigentes.
function crearFilaInsumo(
    modal
) {
    const plantilla =
        obtener(
            modal,
            '[data-modal-crear-receta-plantilla-insumo]'
        );

    const fila =
        plantilla.content.firstElementChild.cloneNode(
            true
        );

    obtener(
        fila,
        '[data-modal-crear-receta-insumo-etiqueta]'
    ).textContent =
        configuracionActual.etiquetaInsumo || '';

    obtener(
        fila,
        '[data-modal-crear-receta-cantidad-etiqueta]'
    ).textContent =
        configuracionActual.etiquetaCantidad || '';

    obtener(
        fila,
        '[data-modal-crear-receta-unidad-etiqueta]'
    ).textContent =
        configuracionActual.etiquetaUnidad || '';

    const quitar =
        obtener(
            fila,
            '[data-modal-crear-receta-quitar-insumo]'
        );

    quitar.textContent =
        configuracionActual.textoQuitarInsumo || '';

    cargarOpcionesInsumo(
        fila,
        configuracionActual.insumos,
        configuracionActual.textoSeleccionarInsumo
    );

    quitar.addEventListener(
        'click',
        () => {
            fila.remove();
        }
    );

    return fila;
}


// Agrega una nueva fila de insumo a la composición actual.
function agregarFilaInsumo(
    modal
) {
    const lista =
        obtener(
            modal,
            '[data-modal-crear-receta-lista-insumos]'
        );

    lista.appendChild(
        crearFilaInsumo(
            modal
        )
    );
}


// Extrae la composición actual sin conocer persistencia ni API.
function obtenerInsumos(
    modal
) {
    return Array.from(
        modal.querySelectorAll(
            '.modal-crear-receta__fila-insumo'
        )
    ).map(
        (fila) => ({
            insumoId:
                Number(
                    obtener(
                        fila,
                        '[data-modal-crear-receta-insumo]'
                    ).value
                ),

            cantidad:
                Number(
                    obtener(
                        fila,
                        '[data-modal-crear-receta-cantidad]'
                    ).value
                ),

            unidad:
                obtener(
                    fila,
                    '[data-modal-crear-receta-unidad]'
                ).value.trim()
        })
    );
}


// Construye los datos editados por la persona sin conocer API.
function obtenerDatosFormulario(
    modal,
    formulario
) {
    const datos =
        Object.fromEntries(
            new FormData(
                formulario
            ).entries()
        );

    return {
        titulo:
            typeof datos.titulo ===
            'string'
                ? datos.titulo.trim()
                : '',

        categoriaId:
            Number(
                datos.categoriaId
            ),

        preparacion:
            typeof datos.preparacion ===
            'string'
                ? datos.preparacion.trim()
                : '',

        insumos:
            obtenerInsumos(
                modal
            )
    };
}


// Realiza validaciones visuales antes de delegar la creación.
function validarComposicion(
    modal
) {
    const insumos =
        obtenerInsumos(
            modal
        );

    if (
        insumos.length ===
        0
    ) {
        mostrarMensaje(
            modal,
            configuracionActual.mensajeSinInsumos || ''
        );

        return false;
    }

    const cantidadesValidas =
        insumos.every(
            (item) =>
                Number.isFinite(
                    item.cantidad
                ) &&
                item.cantidad >
                0
        );

    if (!cantidadesValidas) {
        mostrarMensaje(
            modal,
            configuracionActual.mensajeCantidadInvalida || ''
        );

        return false;
    }

    const ids =
        insumos.map(
            (item) =>
                item.insumoId
        );

    const repetidos =
        ids.length !==
        new Set(
            ids
        ).size;

    if (repetidos) {
        mostrarMensaje(
            modal,
            configuracionActual.mensajeInsumoRepetido || ''
        );

        return false;
    }

    return true;
}


// Cierra la instancia actualmente abierta y restaura el foco previo.
export function cerrarModalCrearReceta() {
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


// Abre el modal utilizando los catálogos vigentes recibidos desde el cargador.
export function abrirModalCrearReceta({
                                          modal,
                                          origen = null,
                                          categorias = [],
                                          insumos = []
                                      }) {
    if (!modal) {
        throw new Error(
            'No se recibió modal-crear-receta.'
        );
    }

    if (modalActivo) {
        return;
    }

    configuracionActual = {
        ...configuracionActual,
        categorias,
        insumos
    };

    cargarCategorias(
        modal,
        categorias,
        configuracionActual.textoSeleccionarCategoria
    );

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
            '[data-modal-crear-receta-formulario]'
        );

    formulario.reset();

    const lista =
        obtener(
            modal,
            '[data-modal-crear-receta-lista-insumos]'
        );

    lista.replaceChildren();

    agregarFilaInsumo(
        modal
    );

    mostrarMensaje(
        modal
    );

    const guardar =
        obtener(
            modal,
            '[data-modal-crear-receta-guardar]'
        );

    guardar.disabled =
        false;

    guardar.textContent =
        guardar.dataset.textoNormal ||
        '';

    modal.hidden =
        false;

    obtener(
        modal,
        '[data-modal-crear-receta-panel]'
    )?.focus();

    obtener(
        modal,
        '[data-modal-crear-receta-campo-titulo]'
    )?.focus();
}


// Configura una sola vez el comportamiento y los textos estáticos del modal.
export function configurarModalCrearReceta(
    elemento,
    {
        configuracion = {},
        alCrear
    } = {}
) {
    if (!elemento) {
        throw new Error(
            'No se recibió el elemento modal-crear-receta.'
        );
    }

    const formulario =
        obtener(
            elemento,
            '[data-modal-crear-receta-formulario]'
        );

    const fondo =
        obtener(
            elemento,
            '[data-modal-crear-receta-fondo]'
        );

    const cerrar =
        obtener(
            elemento,
            '[data-modal-crear-receta-cerrar]'
        );

    const cancelar =
        obtener(
            elemento,
            '[data-modal-crear-receta-cancelar]'
        );

    const cerrarExito =
        obtener(
            elemento,
            '[data-modal-crear-receta-exito-cerrar]'
        );

    const agregar =
        obtener(
            elemento,
            '[data-modal-crear-receta-agregar-insumo]'
        );

    const guardar =
        obtener(
            elemento,
            '[data-modal-crear-receta-guardar]'
        );

    if (
        !formulario ||
        !fondo ||
        !cerrar ||
        !cancelar ||
        !cerrarExito ||
        !agregar ||
        !guardar
    ) {
        throw new Error(
            'La estructura de modal-crear-receta está incompleta.'
        );
    }

    configuracionActual = {
        ...configuracion
    };

    aplicarConfiguracion(
        elemento,
        configuracionActual
    );

    fondo.addEventListener(
        'click',
        cerrarModalCrearReceta
    );

    cerrar.addEventListener(
        'click',
        cerrarModalCrearReceta
    );

    cancelar.addEventListener(
        'click',
        cerrarModalCrearReceta
    );

    cerrarExito.addEventListener(
        'click',
        cerrarModalCrearReceta
    );

    agregar.addEventListener(
        'click',
        () => {
            agregarFilaInsumo(
                elemento
            );
        }
    );

    elemento.addEventListener(
        'keydown',
        (evento) => {
            if (
                evento.key ===
                'Escape'
            ) {
                cerrarModalCrearReceta();
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
                !validarComposicion(
                    elemento
                )
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
                    elemento,
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