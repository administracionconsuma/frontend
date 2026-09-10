/*
    Elemento específico para representar recetas administrativas.
    No conoce API, backend, cargadores ni pantalla.
*/

// Crea una instancia nueva de receta desde la plantilla interna.
function crearItem(
    elemento
) {
    const plantilla =
        elemento.querySelector(
            '[data-listado-recetas-administracion-plantilla-item]'
        );

    if (!plantilla) {
        throw new Error(
            'La estructura de listado-recetas-administracion no contiene la plantilla de item.'
        );
    }

    return plantilla.content.firstElementChild.cloneNode(
        true
    );
}


// Configura una receta y sus acciones sin conocer su procedencia.
function configurarItem(
    item,
    {
        titulo = '',
        categoria = '',
        estado = '',
        textoVer = '',
        textoEditar = '',
        textoCambiarEstado = '',
        alVer = null,
        alEditar = null,
        alCambiarEstado = null
    } = {}
) {
    const tituloElemento =
        item.querySelector(
            '[data-listado-recetas-administracion-titulo]'
        );

    const categoriaElemento =
        item.querySelector(
            '[data-listado-recetas-administracion-categoria]'
        );

    const estadoElemento =
        item.querySelector(
            '[data-listado-recetas-administracion-estado]'
        );

    const botonVer =
        item.querySelector(
            '[data-listado-recetas-administracion-ver]'
        );

    const botonEditar =
        item.querySelector(
            '[data-listado-recetas-administracion-editar]'
        );

    const botonCambiarEstado =
        item.querySelector(
            '[data-listado-recetas-administracion-cambiar-estado]'
        );

    if (
        !tituloElemento ||
        !categoriaElemento ||
        !estadoElemento ||
        !botonVer ||
        !botonEditar ||
        !botonCambiarEstado
    ) {
        throw new Error(
            'La estructura del item de listado-recetas-administracion está incompleta.'
        );
    }

    tituloElemento.textContent =
        titulo;

    categoriaElemento.textContent =
        categoria;

    categoriaElemento.hidden =
        !categoria;

    estadoElemento.textContent =
        estado;

    estadoElemento.dataset.estado =
        estado;

    const configurarAccion =
        (
            boton,
            texto,
            callback
        ) => {
            boton.textContent =
                texto;

            const disponible =
                Boolean(
                    texto
                ) &&
                typeof callback ===
                    'function';

            boton.hidden =
                !disponible;

            if (!disponible) {
                return;
            }

            boton.addEventListener(
                'click',
                () => {
                    callback({
                        origen:
                            boton
                    });
                }
            );
        };

    configurarAccion(
        botonVer,
        textoVer,
        alVer
    );

    configurarAccion(
        botonEditar,
        textoEditar,
        alEditar
    );

    configurarAccion(
        botonCambiarEstado,
        textoCambiarEstado,
        alCambiarEstado
    );

    return item;
}


// Configura una instancia completa del listado con cualquier colección recibida.
export function configurarListadoRecetasAdministracion(
    elemento,
    {
        items = [],
        mensajeVacio = ''
    } = {}
) {
    if (!elemento) {
        throw new Error(
            'No se recibió el elemento listado-recetas-administracion.'
        );
    }

    const lista =
        elemento.querySelector(
            '[data-listado-recetas-administracion-lista]'
        );

    const vacio =
        elemento.querySelector(
            '[data-listado-recetas-administracion-vacio]'
        );

    if (
        !lista ||
        !vacio
    ) {
        throw new Error(
            'La estructura de listado-recetas-administracion está incompleta.'
        );
    }

    lista.replaceChildren();

    items.forEach(
        (datosItem) => {
            lista.appendChild(
                configurarItem(
                    crearItem(
                        elemento
                    ),
                    datosItem
                )
            );
        }
    );

    const tieneResultados =
        items.length > 0;

    lista.hidden =
        !tieneResultados;

    vacio.textContent =
        mensajeVacio;

    vacio.hidden =
        tieneResultados;

    return elemento;
}
