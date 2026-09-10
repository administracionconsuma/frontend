// Obtiene los textos y opciones estáticas de los filtros.
import {
    datosFiltrosRecetas
} from '../../../../datos/administracion/recetas/datos-filtros-recetas.js';

// Configura el elemento específico de filtros de Recetas.
import {
    configurarFiltrosRecetas
} from '../../../../elementos/filtros-recetas/filtros-recetas.js';

const RUTA_PLANTILLA =
    new URL(
        '../../../../elementos/filtros-recetas/filtros-recetas.html',
        import.meta.url
    );

let plantillaFiltros = null;


// Obtiene una sola vez la plantilla reutilizable.
async function obtenerPlantillaFiltros() {
    if (plantillaFiltros) {
        return plantillaFiltros;
    }

    const respuesta =
        await fetch(
            RUTA_PLANTILLA
        );

    if (!respuesta.ok) {
        throw new Error(
            `No fue posible cargar filtros-recetas.html. HTTP ${respuesta.status}.`
        );
    }

    plantillaFiltros =
        await respuesta.text();

    return plantillaFiltros;
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
            'La plantilla filtros-recetas.html no contiene un elemento válido.'
        );
    }

    return elemento;
}


// Adapta las categorías reales al contrato simple del selector.
function construirOpcionesCategorias(
    categorias
) {
    return [
        datosFiltrosRecetas.opcionesCategoria.todas,

        ...categorias.map(
            (categoria) => ({
                valor:
                    String(
                        categoria.id
                    ),

                etiqueta:
                    categoria.nombre || ''
            })
        )
    ];
}


// Crea y configura una instancia de filtros con las categorías recibidas.
export async function cargarFiltrosRecetas({
    categorias = [],
    alCambiar = null
} = {}) {
    const html =
        await obtenerPlantillaFiltros();

    const elemento =
        crearElemento(
            html
        );

    configurarFiltrosRecetas(
        elemento,
        {
            etiquetaCategoria:
                datosFiltrosRecetas.etiquetaCategoria,

            etiquetaEstado:
                datosFiltrosRecetas.etiquetaEstado,

            textoLimpiar:
                datosFiltrosRecetas.textoLimpiar,

            categorias:
                construirOpcionesCategorias(
                    categorias
                ),

            estados:
                datosFiltrosRecetas.estados,

            alCambiar
        }
    );

    return elemento;
}
