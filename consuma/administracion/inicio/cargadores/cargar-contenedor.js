import {
    configurarContenedorAccesosRapidos
} from '../../../../elementos/contenedor-accesos-rapidos/contenedor-accesos-rapidos.js';

import {
    cargarAccesosRapidos
} from './cargar-accesos-rapidos.js';

const RUTA_PLANTILLA_CONTENEDOR =
    new URL(
        '../../../../elementos/contenedor-accesos-rapidos/contenedor-accesos-rapidos.html',
        import.meta.url
    );

let plantillaContenedor = null;


// Obtiene una sola vez la plantilla reutilizable del contenedor.
async function obtenerPlantillaContenedor() {
    if (plantillaContenedor) {
        return plantillaContenedor;
    }

    const respuesta =
        await fetch(
            RUTA_PLANTILLA_CONTENEDOR
        );

    if (!respuesta.ok) {
        throw new Error(
            `No fue posible cargar contenedor-accesos-rapidos.html. HTTP ${respuesta.status}.`
        );
    }

    plantillaContenedor =
        await respuesta.text();

    return plantillaContenedor;
}


// Crea una instancia DOM nueva a partir de la plantilla del contenedor.
function crearElementoContenedor(
    html
) {
    const plantilla =
        document.createElement(
            'template'
        );

    plantilla.innerHTML =
        html.trim();

    const elemento =
        plantilla.content.firstElementChild;

    if (!elemento) {
        throw new Error(
            'La plantilla contenedor-accesos-rapidos.html no contiene un elemento válido.'
        );
    }

    return elemento;
}


// Crea el contenedor y carga dentro todos los accesos rápidos disponibles.
async function cargarContenedorAccesosRapidos() {
    const html =
        await obtenerPlantillaContenedor();

    const contenedor =
        crearElementoContenedor(
            html
        );

    const accesos =
        await cargarAccesosRapidos();

    configurarContenedorAccesosRapidos(
        contenedor,
        accesos
    );

    return contenedor;
}


// Monta automáticamente el contenedor al importar este cargador.
(async () => {
    const puntoAnclaje =
        document.getElementById(
            'contenedor-accesos-rapidos'
        );

    if (!puntoAnclaje) {
        throw new Error(
            'No existe el punto de anclaje #contenedor-accesos-rapidos.'
        );
    }

    const contenedor =
        await cargarContenedorAccesosRapidos();

    puntoAnclaje.replaceChildren(
        contenedor
    );
})();