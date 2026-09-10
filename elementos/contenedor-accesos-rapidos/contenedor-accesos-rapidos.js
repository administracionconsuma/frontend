// Reemplaza el contenido del contenedor con cualquier cantidad de elementos recibidos.
export function configurarContenedorAccesosRapidos(
    elemento,
    accesos = []
) {
    if (!elemento) {
        throw new Error(
            'No se recibió el contenedor de accesos rápidos.'
        );
    }

    elemento.replaceChildren(
        ...accesos
    );

    return elemento;
}
