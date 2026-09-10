// Obtiene el detalle real de una receta desde la API pública.
import {
    obtenerRecetaPublica
} from '../../../../cliente-api/publico/recetas-api.js';

// Obtiene los textos utilizados por el detalle público de receta.
import {
    datosVerReceta
} from '../../../../datos/publico/datos-ver-receta.js';

// Configura y abre el modal reutilizable de detalle.
import {
    configurarModalVerDetalle,
    abrirModalVerDetalle
} from '../../../../elementos/modal-ver-detalle/modal-ver-detalle.js';


const RUTA_MODAL =
    new URL(
        '../../../../elementos/modal-ver-detalle/modal-ver-detalle.html',
        import.meta.url
    );

let modalVerReceta = null;
let plantillaModalVerDetalle = null;


// Obtiene una sola vez la plantilla reutilizable del modal.
async function obtenerHtmlModalVerDetalle() {
    if (plantillaModalVerDetalle) {
        return plantillaModalVerDetalle;
    }

    const respuesta =
        await fetch(
            RUTA_MODAL
        );

    if (!respuesta.ok) {
        throw new Error(
            `No fue posible cargar modal-ver-detalle.html. HTTP ${respuesta.status}.`
        );
    }

    plantillaModalVerDetalle =
        await respuesta.text();

    return plantillaModalVerDetalle;
}


// Monta una única instancia lazy del modal para el detalle público.
async function obtenerModalVerReceta() {
    if (
        modalVerReceta &&
        modalVerReceta.isConnected
    ) {
        return modalVerReceta;
    }

    const html =
        await obtenerHtmlModalVerDetalle();

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
            'La plantilla modal-ver-detalle.html no contiene un elemento válido.'
        );
    }

    document.body.appendChild(
        elemento
    );

    modalVerReceta =
        configurarModalVerDetalle(
            elemento,
            {
                textoCerrar:
                datosVerReceta.textoCerrar,

                ariaCerrar:
                datosVerReceta.ariaCerrar
            }
        );

    return modalVerReceta;
}


// Adapta los insumos públicos al contrato visual del modal.
function transformarInsumos(
    insumos = []
) {
    if (
        !Array.isArray(
            insumos
        ) ||
        insumos.length === 0
    ) {
        return [
            {
                etiqueta:
                datosVerReceta.insumos.etiquetaVacia,

                valor:
                datosVerReceta.insumos.mensajeVacio,

                anchoCompleto:
                    true
            }
        ];
    }

    return insumos.map(
        (insumo) => ({
            etiqueta:
                insumo.nombre || '',

            valor:
                `${insumo.cantidad} ${insumo.unidad}`.trim()
        })
    );
}


// Adapta la receta pública al contrato del modal reutilizable.
function transformarReceta(
    receta
) {
    return {
        etiqueta:
        datosVerReceta.etiqueta,

        titulo:
            receta.titulo || '',

        secciones: [
            {
                campos: [
                    {
                        etiqueta:
                        datosVerReceta.categoria,

                        valor:
                            receta.categoriaNombre || ''
                    }
                ]
            },

            {
                titulo:
                datosVerReceta.insumos.titulo,

                campos:
                    transformarInsumos(
                        receta.insumos
                    )
            },

            {
                titulo:
                datosVerReceta.preparacion.titulo,

                campos: [
                    {
                        etiqueta:
                        datosVerReceta.preparacion.etiqueta,

                        valor:
                            receta.preparacion ||
                            datosVerReceta.preparacion.valorVacio,

                        anchoCompleto:
                            true
                    }
                ]
            }
        ]
    };
}


// Consulta y abre el detalle público de la receta seleccionada.
export async function mostrarVerReceta({
                                           id,
                                           origen = null
                                       } = {}) {
    const [
        modal,
        receta
    ] =
        await Promise.all([
            obtenerModalVerReceta(),

            obtenerRecetaPublica(
                id
            )
        ]);

    abrirModalVerDetalle({
        modal,
        origen,

        detalle:
            transformarReceta(
                receta
            )
    });
}