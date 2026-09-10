/*
    Elemento reutilizable para capturar criterios de búsqueda.
    No conoce recetas, API, backend ni resultados.
*/

// Configura el buscador con textos y callbacks externos.
export function configurarBuscadorRecetas(
    elemento,
    {
        placeholder = '',
        valorInicial = '',
        alBuscar = null
    } = {}
) {
    if (!elemento) {
        throw new Error(
            'No se recibió el elemento buscador-recetas.'
        );
    }

    const entrada =
        elemento.querySelector(
            '[data-buscador-recetas-entrada]'
        );

    if (!entrada) {
        throw new Error(
            'La estructura de buscador-recetas está incompleta.'
        );
    }

    entrada.placeholder =
        placeholder;

    entrada.value =
        valorInicial;

    entrada.addEventListener(
        'input',
        () => {
            if (
                typeof alBuscar !==
                'function'
            ) {
                return;
            }

            alBuscar({
                termino:
                    entrada.value.trim(),
                entrada
            });
        }
    );

    return elemento;
}
