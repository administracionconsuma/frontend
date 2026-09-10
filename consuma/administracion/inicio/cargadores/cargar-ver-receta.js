// Obtiene el detalle real de una receta desde la API administrativa.
import {
    obtenerReceta
} from '../../../../cliente-api/administracion/recetas-api.js';

// Obtiene los textos y etiquetas utilizados para presentar una receta.
import {
    datosVerReceta
} from '../../../../datos/administracion/inicio/datos-ver-receta.js';

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


// Monta una única instancia lazy del modal utilizada para recetas.
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


// Adapta el estado técnico a la presentación visual del encabezado.
function transformarEstado(
    estado
) {
    return {
        texto:
            estado || '',

        variante:
            estado === 'ACTIVA'
                ? 'positivo'
                : 'negativo'
    };
}


// Convierte la composición recibida en campos visuales del modal.
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
                datosVerReceta.secciones.insumos.titulo,

                valor:
                datosVerReceta.secciones.insumos.mensajeVacio,

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


// Adapta el detalle real de una receta al modal reutilizable.
function transformarReceta(
    receta
) {
    return {
        etiqueta:
        datosVerReceta.etiqueta,

        titulo:
            receta.titulo || '',

        estado:
            transformarEstado(
                receta.estado
            ),

        secciones: [
            {
                campos: [
                    {
                        etiqueta:
                        datosVerReceta.secciones.general.campos.categoria,

                        valor:
                            receta.categoriaNombre || ''
                    }
                ]
            },
            {
                titulo:
                datosVerReceta.secciones.insumos.titulo,

                campos:
                    transformarInsumos(
                        receta.insumos
                    )
            },
            {
                titulo:
                datosVerReceta.secciones.preparacion.titulo,

                campos: [
                    {
                        etiqueta:
                        datosVerReceta.secciones.preparacion.campo,

                        valor:
                            receta.preparacion ||
                            datosVerReceta.secciones.preparacion.valorVacio,

                        anchoCompleto:
                            true
                    }
                ]
            }
        ]
    };
}


// Consulta y abre el detalle de una receta desde cualquier origen visual.
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

            obtenerReceta(
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