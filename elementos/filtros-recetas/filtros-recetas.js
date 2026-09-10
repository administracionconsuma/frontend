/*
    Elemento específico de filtros para recetas.
    No conoce API, backend ni pantalla; recibe opciones y callbacks externos.
*/

// Crea una opción de selector a partir de datos simples.
function crearOpcion(
    {
        valor = '',
        etiqueta = ''
    } = {}
) {
    const opcion =
        document.createElement(
            'option'
        );

    opcion.value =
        valor;

    opcion.textContent =
        etiqueta;

    return opcion;
}


// Carga las opciones recibidas dentro de un selector.
function cargarOpciones(
    selector,
    opciones = []
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
}


// Determina si alguno de los filtros está aplicado.
function hayFiltrosActivos(
    categoria,
    estado
) {
    return Boolean(
        categoria.value ||
        estado.value
    );
}


// Sincroniza la visibilidad de la acción para limpiar filtros.
function actualizarAccionLimpiar(
    boton,
    categoria,
    estado
) {
    boton.hidden =
        !hayFiltrosActivos(
            categoria,
            estado
        );
}


// Configura una instancia de filtros con opciones y callbacks externos.
export function configurarFiltrosRecetas(
    elemento,
    {
        etiquetaCategoria = '',
        etiquetaEstado = '',
        textoLimpiar = '',
        categorias = [],
        estados = [],
        categoriaInicial = '',
        estadoInicial = '',
        alCambiar = null
    } = {}
) {
    if (!elemento) {
        throw new Error(
            'No se recibió el elemento filtros-recetas.'
        );
    }

    const etiquetaCategoriaElemento =
        elemento.querySelector(
            '[data-filtros-recetas-etiqueta-categoria]'
        );

    const etiquetaEstadoElemento =
        elemento.querySelector(
            '[data-filtros-recetas-etiqueta-estado]'
        );

    const categoria =
        elemento.querySelector(
            '[data-filtros-recetas-categoria]'
        );

    const estado =
        elemento.querySelector(
            '[data-filtros-recetas-estado]'
        );

    const limpiar =
        elemento.querySelector(
            '[data-filtros-recetas-limpiar]'
        );

    if (
        !etiquetaCategoriaElemento ||
        !etiquetaEstadoElemento ||
        !categoria ||
        !estado ||
        !limpiar
    ) {
        throw new Error(
            'La estructura de filtros-recetas está incompleta.'
        );
    }

    etiquetaCategoriaElemento.textContent =
        etiquetaCategoria;

    etiquetaEstadoElemento.textContent =
        etiquetaEstado;

    limpiar.textContent =
        textoLimpiar;

    cargarOpciones(
        categoria,
        categorias
    );

    cargarOpciones(
        estado,
        estados
    );

    categoria.value =
        categoriaInicial;

    estado.value =
        estadoInicial;

    const notificarCambio =
        () => {
            actualizarAccionLimpiar(
                limpiar,
                categoria,
                estado
            );

            if (
                typeof alCambiar ===
                'function'
            ) {
                alCambiar({
                    categoriaId:
                        categoria.value,

                    estado:
                        estado.value
                });
            }
        };

    categoria.addEventListener(
        'change',
        notificarCambio
    );

    estado.addEventListener(
        'change',
        notificarCambio
    );

    limpiar.addEventListener(
        'click',
        () => {
            categoria.value =
                '';

            estado.value =
                '';

            notificarCambio();
        }
    );

    actualizarAccionLimpiar(
        limpiar,
        categoria,
        estado
    );

    return elemento;
}
