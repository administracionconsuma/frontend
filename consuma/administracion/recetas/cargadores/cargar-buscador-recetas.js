// Obtiene los textos del buscador administrativo.
import {
    datosBuscadorRecetas
} from '../../../../datos/administracion/recetas/datos-buscador-recetas.js';

// Configura el buscador reutilizable.
import {
    configurarBuscadorRecetas
} from '../../../../elementos/buscador-recetas/buscador-recetas.js';

const RUTA_PLANTILLA =
    new URL(
        '../../../../elementos/buscador-recetas/buscador-recetas.html',
        import.meta.url
    );

let plantillaBuscador = null;


// Obtiene una sola vez la plantilla reutilizable.
async function obtenerPlantillaBuscador() {
    if (plantillaBuscador) {
        return plantillaBuscador;
    }

    const respuesta =
        await fetch(
            RUTA_PLANTILLA
        );

    if (!respuesta.ok) {
        throw new Error(
            `No fue posible cargar buscador-recetas.html. HTTP ${respuesta.status}.`
        );
    }

    plantillaBuscador =
        await respuesta.text();

    return plantillaBuscador;
}


// Crea una instancia DOM nueva de la plantilla.
function crearElemento(
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
            'La plantilla buscador-recetas.html no contiene un elemento válido.'
        );
    }

    return elemento;
}


// Crea y configura una instancia administrativa del buscador.
export async function cargarBuscadorRecetas({
    alBuscar = null
} = {}) {
    const html =
        await obtenerPlantillaBuscador();

    const elemento =
        crearElemento(
            html
        );

    configurarBuscadorRecetas(
        elemento,
        {
            placeholder:
                datosBuscadorRecetas.placeholder,

            alBuscar
        }
    );

    return elemento;
}
