// Configura un acceso rápido sin conocer su finalidad de negocio.
export function configurarAccesoRapido(
    elemento,
    {
        titulo = '',
        descripcion = '',
        icono = '',
        alSeleccionar = null
    } = {}
) {
    if (!elemento) {
        throw new Error('No se recibió el elemento acceso-rapido.');
    }

    const iconoElemento = elemento.querySelector(
        '[data-acceso-rapido-icono]'
    );

    const tituloElemento = elemento.querySelector(
        '[data-acceso-rapido-titulo]'
    );

    const descripcionElemento = elemento.querySelector(
        '[data-acceso-rapido-descripcion]'
    );

    if (
        !iconoElemento ||
        !tituloElemento ||
        !descripcionElemento
    ) {
        throw new Error(
            'La estructura de acceso-rapido está incompleta.'
        );
    }

    iconoElemento.innerHTML = icono;
    tituloElemento.textContent = titulo;
    descripcionElemento.textContent = descripcion;

    if (typeof alSeleccionar === 'function') {
        elemento.addEventListener(
            'click',
            alSeleccionar
        );
    }

    return elemento;
}
