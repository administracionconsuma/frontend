// Consulta los insumos administrativos.
import {
    listarInsumos
} from '../../../../cliente-api/administracion/insumos-api.js';

// Obtiene los textos y configuración visual del listado de insumos.
import {
    datosListadoInsumos
} from '../../../../datos/administracion/inicio/datos-listado-insumos.js';

// Configura el elemento reutilizable de listado reciente.
import {
    configurarListadoReciente
} from '../../../../elementos/listado-reciente/listado-reciente.js';

// Abre el detalle administrativo del insumo seleccionado.
import {
    mostrarVerInsumo
} from './cargar-ver-insumo.js';

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


// Transforma un insumo del backend al contrato visual del listado.
function transformarInsumo(
    insumo
) {
    return {
        titulo:
        insumo.nombre,

        subtitulo:
            '',

        fecha:
            formatearFecha(
                insumo.fechaCreacion
            ),

        fechaIso:
            insumo.fechaCreacion || '',

        icono:
        datosListadoInsumos.iconoItem,

        alSeleccionar:
            ({ origen }) => {
                mostrarVerInsumo({
                    id:
                    insumo.id,

                    origen
                });
            }
    };
}


// Crea una instancia con hasta cinco insumos activos obtenidos del backend.
export async function cargarListadoInsumos() {
    const [
        html,
        respuesta
    ] =
        await Promise.all([
            obtenerPlantillaListadoReciente(),

            listarInsumos({
                page: 0,
                size: 5,
                estado: 'ACTIVO'
            })
        ]);

    const elemento =
        crearElementoListado(
            html
        );

    const insumos =
        respuesta.contenido || [];

    configurarListadoReciente(
        elemento,
        {
            titulo:
            datosListadoInsumos.titulo,

            icono:
            datosListadoInsumos.icono,

            mensajeVacio:
            datosListadoInsumos.mensajeVacio,

            items:
                insumos.map(
                    transformarInsumo
                )
        }
    );

    return elemento;
}