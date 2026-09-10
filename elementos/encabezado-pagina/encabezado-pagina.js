/*
    Elemento reutilizable para presentar el encabezado de una página.
    No conoce dominio, rutas, API ni pantalla.
*/

// Actualiza un contenido opcional y controla su visibilidad.
function configurarContenidoOpcional(
    elemento,
    valor,
    usarHtml = false
) {
    if (!elemento) {
        return;
    }

    const contenido =
        valor === null ||
        valor === undefined
            ? ''
            : String(valor).trim();

    if (usarHtml) {
        elemento.innerHTML =
            contenido;
    } else {
        elemento.textContent =
            contenido;
    }

    elemento.hidden =
        !contenido;
}


// Configura una instancia del encabezado con datos y acciones externas.
export function configurarEncabezadoPagina(
    elemento,
    {
        titulo = '',
        descripcion = '',
        icono = '',
        textoAccion = '',
        alAccionar = null
    } = {}
) {
    if (!elemento) {
        throw new Error(
            'No se recibió el elemento encabezado-pagina.'
        );
    }

    const tituloElemento =
        elemento.querySelector(
            '[data-encabezado-pagina-titulo]'
        );

    const descripcionElemento =
        elemento.querySelector(
            '[data-encabezado-pagina-descripcion]'
        );

    const iconoElemento =
        elemento.querySelector(
            '[data-encabezado-pagina-icono]'
        );

    const accionElemento =
        elemento.querySelector(
            '[data-encabezado-pagina-accion]'
        );

    if (
        !tituloElemento ||
        !descripcionElemento ||
        !iconoElemento ||
        !accionElemento
    ) {
        throw new Error(
            'La estructura de encabezado-pagina está incompleta.'
        );
    }

    tituloElemento.textContent =
        titulo;

    configurarContenidoOpcional(
        descripcionElemento,
        descripcion
    );

    configurarContenidoOpcional(
        iconoElemento,
        icono,
        true
    );

    const tieneAccion =
        Boolean(
            textoAccion
        ) &&
        typeof alAccionar ===
        'function';

    accionElemento.textContent =
        textoAccion;

    accionElemento.hidden =
        !tieneAccion;

    if (tieneAccion) {
        accionElemento.addEventListener(
            'click',
            () => {
                alAccionar({
                    origen:
                        accionElemento
                });
            }
        );
    }

    return elemento;
}
