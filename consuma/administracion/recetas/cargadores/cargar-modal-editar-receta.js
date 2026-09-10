// Consulta y actualiza recetas mediante la API administrativa.
import {
    obtenerReceta,
    actualizarReceta
} from '../../../../cliente-api/administracion/recetas-api.js';

// Obtiene los catálogos reales necesarios para editar una receta.
import {
    listarCategorias
} from '../../../../cliente-api/administracion/categorias-api.js';

import {
    listarInsumos
} from '../../../../cliente-api/administracion/insumos-api.js';

// Obtiene los textos específicos del flujo de edición.
import {
    datosEditarReceta
} from '../../../../datos/administracion/recetas/datos-editar-receta.js';

// Configura el elemento específico de edición de Receta.
import {
    configurarModalEditarReceta,
    prepararCatalogoModalEditarReceta,
    abrirModalEditarReceta,
    cerrarModalEditarReceta,
    mostrarMensajeModalEditarReceta
} from '../../../../elementos/modal-editar-receta/modal-editar-receta.js';

const RUTA_MODAL =
    new URL(
        '../../../../elementos/modal-editar-receta/modal-editar-receta.html',
        import.meta.url
    );

let plantillaModal = null;
let modalEditarReceta = null;
let recetaActualId = null;
let alActualizadaActual = null;


// Obtiene una sola vez la plantilla del modal.
async function obtenerPlantillaModal() {
    if (plantillaModal) {
        return plantillaModal;
    }

    const respuesta =
        await fetch(
            RUTA_MODAL
        );

    if (!respuesta.ok) {
        throw new Error(
            `No fue posible cargar modal-editar-receta.html. HTTP ${respuesta.status}.`
        );
    }

    plantillaModal =
        await respuesta.text();

    return plantillaModal;
}


// Crea una instancia DOM nueva del modal.
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
            'La plantilla modal-editar-receta.html no contiene un elemento válido.'
        );
    }

    return elemento;
}


// Construye el objeto de textos esperado por modal-editar-receta.
function construirTextos() {
    return {
        etiqueta:
            datosEditarReceta.etiqueta,

        titulo:
            datosEditarReceta.titulo,

        etiquetaTitulo:
            datosEditarReceta.etiquetaTitulo,

        etiquetaCategoria:
            datosEditarReceta.etiquetaCategoria,

        tituloInsumos:
            datosEditarReceta.tituloInsumos,

        descripcionInsumos:
            datosEditarReceta.descripcionInsumos,

        etiquetaPreparacion:
            datosEditarReceta.etiquetaPreparacion,

        mensajeInsumosVacio:
            datosEditarReceta.mensajeInsumosVacio,

        textoAgregarInsumo:
            datosEditarReceta.textoAgregarInsumo,

        textoQuitar:
            datosEditarReceta.textoQuitar,

        etiquetaInsumo:
            datosEditarReceta.etiquetaInsumo,

        etiquetaCantidad:
            datosEditarReceta.etiquetaCantidad,

        etiquetaUnidad:
            datosEditarReceta.etiquetaUnidad,

        textoCancelar:
            datosEditarReceta.textoCancelar,

        textoGuardar:
            datosEditarReceta.textoGuardar,

        ariaCerrar:
            datosEditarReceta.ariaCerrar,

        mensajeInsumosRequeridos:
            datosEditarReceta.mensajeInsumosRequeridos,

        mensajeInsumoDuplicado:
            datosEditarReceta.mensajeInsumoDuplicado
    };
}


// Obtiene todas las páginas de un catálogo administrativo.
async function listarTodo(
    funcionListar
) {
    const contenido =
        [];

    let page =
        0;

    let totalPaginas =
        1;

    do {
        const respuesta =
            await funcionListar({
                page,
                size:
                    100
            });

        contenido.push(
            ...(
                respuesta.contenido ||
                []
            )
        );

        totalPaginas =
            respuesta.totalPaginas ||
            0;

        page +=
            1;
    } while (
        page <
        totalPaginas
    );

    return contenido;
}


// Adapta categorías al contrato de opciones del modal.
function transformarCategorias(
    categorias
) {
    return categorias.map(
        (categoria) => ({
            valor:
                categoria.id,

            etiqueta:
                categoria.nombre || ''
        })
    );
}


// Adapta insumos al contrato de opciones del modal.
function transformarInsumos(
    insumos
) {
    return insumos.map(
        (insumo) => ({
            valor:
                insumo.id,

            etiqueta:
                insumo.nombre || ''
        })
    );
}


// Guarda la receta actual utilizando el contrato real del backend.
async function guardarReceta(
    datos
) {
    if (!recetaActualId) {
        return;
    }

    try {
        const recetaActualizada =
            await actualizarReceta(
                recetaActualId,
                datos
            );

        cerrarModalEditarReceta();

        if (
            typeof alActualizadaActual ===
            'function'
        ) {
            await alActualizadaActual(
                recetaActualizada
            );
        }
    } catch (error) {
        mostrarMensajeModalEditarReceta(
            modalEditarReceta,
            error?.message ||
            datosEditarReceta.mensajeError
        );
    }
}


// Monta una única instancia lazy del modal.
async function obtenerModalEditarReceta() {
    if (
        modalEditarReceta &&
        modalEditarReceta.isConnected
    ) {
        return modalEditarReceta;
    }

    const html =
        await obtenerPlantillaModal();

    const elemento =
        crearElemento(
            html
        );

    document.body.appendChild(
        elemento
    );

    modalEditarReceta =
        configurarModalEditarReceta(
            elemento,
            {
                textos:
                    construirTextos(),

                alGuardar:
                    guardarReceta
            }
        );

    return modalEditarReceta;
}


// Consulta el estado real y abre la edición de la receta seleccionada.
export async function mostrarEditarReceta({
    id,
    origen = null,
    alActualizada = null
} = {}) {
    recetaActualId =
        id;

    alActualizadaActual =
        alActualizada;

    const [
        modal,
        receta,
        categorias,
        insumos
    ] =
        await Promise.all([
            obtenerModalEditarReceta(),
            obtenerReceta(
                id
            ),
            listarTodo(
                listarCategorias
            ),
            listarTodo(
                listarInsumos
            )
        ]);

    const opcionesCategorias =
        transformarCategorias(
            categorias
        );

    const opcionesInsumos =
        transformarInsumos(
            insumos
        );

    const textos =
        construirTextos();

    prepararCatalogoModalEditarReceta(
        modal,
        {
            insumos:
                opcionesInsumos,

            textosFila:
                textos
        }
    );

    abrirModalEditarReceta({
        modal,
        origen,
        receta,

        categorias:
            opcionesCategorias,

        insumos:
            opcionesInsumos,

        textos
    });
}
