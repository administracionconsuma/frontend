/*
    Elemento reutilizable para representar resultados de recetas.
    No conoce API, buscador, límite de resultados ni origen de los datos.
*/

// Crea una nueva fila a partir de la plantilla interna.
function crearItem(
    elemento
) {
    const plantilla =
        elemento.querySelector(
            '[data-resultados-recetas-plantilla-item]'
        );

    if (!plantilla) {
        throw new Error(
            'La estructura de resultados-recetas no contiene la plantilla de item.'
        );
    }

    return plantilla.content.firstElementChild.cloneNode(
        true
    );
}


// Configura una receta sin conocer su procedencia.
function configurarItem(
    item,
    {
        titulo = '',
        categoria = '',
        alSeleccionar = null
    } = {}
) {
    const tituloElemento =
        item.querySelector(
            '[data-resultados-recetas-item-titulo]'
        );

    const categoriaElemento =
        item.querySelector(
            '[data-resultados-recetas-item-categoria]'
        );

    tituloElemento.textContent =
        titulo;

    categoriaElemento.textContent =
        categoria;

    categoriaElemento.hidden =
        !categoria;

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
                    evento.key === 'Enter' ||
                    evento.key === ' '
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


// Configura una instancia con cualquier colección de recetas recibida.
export function configurarResultadosRecetas(
    elemento,
    {
        items = [],
        mensajeVacio = ''
    } = {}
) {
    if (!elemento) {
        throw new Error(
            'No se recibió el elemento resultados-recetas.'
        );
    }

    const lista =
        elemento.querySelector(
            '[data-resultados-recetas-lista]'
        );

    const vacio =
        elemento.querySelector(
            '[data-resultados-recetas-vacio]'
        );

    if (
        !lista ||
        !vacio
    ) {
        throw new Error(
            'La estructura de resultados-recetas está incompleta.'
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
