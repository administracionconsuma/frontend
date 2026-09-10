// Crea una representación visual nueva a partir de la plantilla interna.
function crearItemDesdePlantilla(
    elemento
) {
    const plantilla =
        elemento.querySelector(
            '[data-listado-reciente-plantilla-item]'
        );

    if (!plantilla) {
        throw new Error(
            'La estructura de listado-reciente no contiene la plantilla de item.'
        );
    }

    return plantilla.content.firstElementChild.cloneNode(
        true
    );
}


// Configura un registro sin conocer su dominio ni procedencia.
function configurarItem(
    item,
    {
        titulo = '',
        subtitulo = '',
        fecha = '',
        fechaIso = '',
        icono = '',
        alSeleccionar = null
    } = {}
) {
    const iconoElemento =
        item.querySelector(
            '[data-listado-reciente-item-icono]'
        );

    const tituloElemento =
        item.querySelector(
            '[data-listado-reciente-item-titulo]'
        );

    const subtituloElemento =
        item.querySelector(
            '[data-listado-reciente-item-subtitulo]'
        );

    const fechaElemento =
        item.querySelector(
            '[data-listado-reciente-item-fecha]'
        );

    iconoElemento.innerHTML =
        icono;

    tituloElemento.textContent =
        titulo;

    subtituloElemento.textContent =
        subtitulo;

    subtituloElemento.hidden =
        !subtitulo;

    fechaElemento.textContent =
        fecha;

    fechaElemento.hidden =
        !fecha;

    if (
        fecha &&
        fechaIso
    ) {
        fechaElemento.dateTime =
            fechaIso;
    } else {
        fechaElemento.removeAttribute(
            'datetime'
        );
    }

    /*
        Convierte el registro en una acción accesible únicamente
        cuando el cargador proporciona un callback.
    */
    if (
        typeof alSeleccionar ===
        'function'
    ) {
        item.setAttribute(
            'role',
            'button'
        );

        item.tabIndex =
            0;

        item.addEventListener(
            'click',
            () => {
                alSeleccionar({
                    origen:
                    item
                });
            }
        );

        item.addEventListener(
            'keydown',
            (evento) => {
                if (
                    evento.key ===
                    'Enter' ||
                    evento.key ===
                    ' '
                ) {
                    evento.preventDefault();

                    alSeleccionar({
                        origen:
                        item
                    });
                }
            }
        );
    }

    return item;
}


// Configura una instancia reutilizable con cualquier colección recibida.
export function configurarListadoReciente(
    elemento,
    {
        titulo = '',
        icono = '',
        textoVerTodos = '',
        mensajeVacio = '',
        items = [],
        alVerTodos = null
    } = {}
) {
    if (!elemento) {
        throw new Error(
            'No se recibió el elemento listado-reciente.'
        );
    }

    const tituloElemento =
        elemento.querySelector(
            '[data-listado-reciente-titulo]'
        );

    const iconoElemento =
        elemento.querySelector(
            '[data-listado-reciente-icono]'
        );

    const verTodos =
        elemento.querySelector(
            '[data-listado-reciente-ver-todos]'
        );

    const lista =
        elemento.querySelector(
            '[data-listado-reciente-lista]'
        );

    const vacio =
        elemento.querySelector(
            '[data-listado-reciente-vacio]'
        );

    if (
        !tituloElemento ||
        !iconoElemento ||
        !verTodos ||
        !lista ||
        !vacio
    ) {
        throw new Error(
            'La estructura de listado-reciente está incompleta.'
        );
    }

    tituloElemento.textContent =
        titulo;

    iconoElemento.innerHTML =
        icono;

    lista.replaceChildren();

    items.forEach(
        (datosItem) => {
            const item =
                configurarItem(
                    crearItemDesdePlantilla(
                        elemento
                    ),
                    datosItem
                );

            lista.appendChild(
                item
            );
        }
    );

    const tieneItems =
        items.length >
        0;

    lista.hidden =
        !tieneItems;

    vacio.textContent =
        mensajeVacio;

    vacio.hidden =
        tieneItems;

    const puedeVerTodos =
        Boolean(
            textoVerTodos
        ) &&
        typeof alVerTodos ===
        'function';

    verTodos.textContent =
        textoVerTodos;

    verTodos.hidden =
        !puedeVerTodos;

    if (puedeVerTodos) {
        verTodos.addEventListener(
            'click',
            alVerTodos,
            {
                once: true
            }
        );
    }

    return elemento;
}