// Consulta las recetas administrativas.
import {
    listarRecetas
} from '../../../../cliente-api/administracion/recetas-api.js';

// Obtiene los textos y configuración visual del listado de recetas.
import {
    datosListadoRecetas
} from '../../../../datos/administracion/inicio/datos-listado-recetas.js';

// Configura el elemento reutilizable de listado reciente.
import {
    configurarListadoReciente
} from '../../../../elementos/listado-reciente/listado-reciente.js';

// Abre el detalle administrativo de la receta seleccionada.
import {
    mostrarVerReceta
} from './cargar-ver-receta.js';

const RUTA_PLANTILLA_LISTADO =
    new URL(
        '../../../../elementos/listado-reciente/listado-reciente.html',
        import.meta.url
    );

let plantillaListadoReciente = null;


// Obtiene una sola vez la plantilla reutilizable del listado reciente.
async function obtenerPlantillaListadoReciente() {
    if (plantillaListadoReciente) {
        return plantillaListadoReciente;
    }

    const respuesta =
        await fetch(
            RUTA_PLANTILLA_LISTADO
        );

    if (!respuesta.ok) {
        throw new Error(
            `No fue posible cargar listado-reciente.html. HTTP ${respuesta.status}.`
        );
    }

    plantillaListadoReciente =
        await respuesta.text();

    return plantillaListadoReciente;
}


// Crea una nueva instancia DOM de la plantilla reutilizable.
function crearElementoListado(
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
            'La plantilla listado-reciente.html no contiene un elemento válido.'
        );
    }

    return elemento;
}


// Convierte una fecha técnica en una fecha legible para la interfaz.
function formatearFecha(
    fecha
) {
    if (!fecha) {
        return '';
    }

    return new Intl.DateTimeFormat(
        'es-AR',
        {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        }
    ).format(
        new Date(
            fecha
        )
    );
}


// Transforma una receta del backend al contrato visual del listado.
function transformarReceta(
    receta
) {
    return {
        titulo:
        receta.titulo,

        subtitulo:
            receta.categoriaNombre || '',

        fecha:
            formatearFecha(
                receta.fechaCreacion
            ),

        fechaIso:
            receta.fechaCreacion || '',

        icono:
        datosListadoRecetas.iconoItem,

        alSeleccionar:
            ({ origen }) => {
                mostrarVerReceta({
                    id:
                    receta.id,

                    origen
                });
            }
    };
}


// Crea una instancia con hasta cinco recetas activas obtenidas del backend.
export async function cargarListadoRecetas() {
    const [
        html,
        respuesta
    ] =
        await Promise.all([
            obtenerPlantillaListadoReciente(),

            listarRecetas({
                page: 0,
                size: 5,
                estado: 'ACTIVA'
            })
        ]);

    const elemento =
        crearElementoListado(
            html
        );

    const recetas =
        respuesta.contenido || [];

    configurarListadoReciente(
        elemento,
        {
            titulo:
            datosListadoRecetas.titulo,

            icono:
            datosListadoRecetas.icono,

            mensajeVacio:
            datosListadoRecetas.mensajeVacio,

            items:
                recetas.map(
                    transformarReceta
                )
        }
    );

    return elemento;
}