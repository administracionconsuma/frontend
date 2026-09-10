import {
    configurarContenedorAccesosRapidos
} from '../../../../elementos/contenedor-accesos-rapidos/contenedor-accesos-rapidos.js';

import {
    cargarListadoRecetas
} from './cargar-listado-recetas.js';

import {
    cargarListadoInsumos
} from './cargar-listado-insumos.js';

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


// Crea una nueva instancia DOM del contenedor reutilizable.
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
            'La plantilla del contenedor no contiene un elemento válido.'
        );
    }

    return elemento;
}


// Crea el contenedor y carga dentro ambos listados recientes.
async function cargarListadosRecientes() {
    const [
        html,
        listadoRecetas,
        listadoInsumos
    ] =
        await Promise.all([
            obtenerPlantillaContenedor(),
            cargarListadoRecetas(),
            cargarListadoInsumos()
        ]);

    const contenedor =
        crearElementoContenedor(
            html
        );

    configurarContenedorAccesosRapidos(
        contenedor,
        [
            listadoRecetas,
            listadoInsumos
        ]
    );

    return contenedor;
}


// Monta automáticamente el conjunto de listados recientes.
(async () => {
    const puntoAnclaje =
        document.getElementById(
            'listados-recientes'
        );

    if (!puntoAnclaje) {
        throw new Error(
            'No existe el punto de anclaje #listados-recientes.'
        );
    }

    const contenedor =
        await cargarListadosRecientes();

    puntoAnclaje.replaceChildren(
        contenedor
    );
})();