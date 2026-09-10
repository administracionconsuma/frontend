// Consulta y modifica recetas mediante la API administrativa.
import {
    listarRecetas,
    cambiarEstadoReceta
} from '../../../../cliente-api/administracion/recetas-api.js';

// Consulta las categorías reales para construir el filtro.
import {
    listarCategorias
} from '../../../../cliente-api/administracion/categorias-api.js';

// Obtiene los textos del listado administrativo.
import {
    datosListadoRecetas
} from '../../../../datos/administracion/recetas/datos-listado-recetas.js';

// Configura el listado administrativo de recetas.
import {
    configurarListadoRecetasAdministracion
} from '../../../../elementos/listado-recetas-administracion/listado-recetas-administracion.js';

// Crea el buscador y los filtros utilizando sus cargadores específicos.
import {
    cargarBuscadorRecetas
} from './cargar-buscador-recetas.js';

import {
    cargarFiltrosRecetas
} from './cargar-filtros-recetas.js';

// Reutiliza el detalle administrativo de receta ya existente.
import {
    mostrarVerReceta
} from '../../inicio/cargadores/cargar-ver-receta.js';

// Abre el flujo específico de edición de receta.
import {
    mostrarEditarReceta
} from './cargar-modal-editar-receta.js';

const RUTA_PLANTILLA_LISTADO =
    new URL(
        '../../../../elementos/listado-recetas-administracion/listado-recetas-administracion.html',
        import.meta.url
    );

const TAMANIO_PAGINA =
    20;

const RETRASO_BUSQUEDA =
    250;

let plantillaListado = null;
let controladorConsulta = null;
let temporizadorBusqueda = null;

let terminoActual = '';
let categoriaActual = '';
let estadoActual = '';

let elementoListado = null;


// Obtiene una sola vez la plantilla del listado administrativo.
async function obtenerPlantillaListado() {
    if (plantillaListado) {
        return plantillaListado;
    }

    const respuesta =
        await fetch(
            RUTA_PLANTILLA_LISTADO
        );

    if (!respuesta.ok) {
        throw new Error(
            `No fue posible cargar listado-recetas-administracion.html. HTTP ${respuesta.status}.`
        );
    }

    plantillaListado =
        await respuesta.text();

    return plantillaListado;
}


// Crea una instancia DOM nueva del listado.
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
            'La plantilla listado-recetas-administracion.html no contiene un elemento válido.'
        );
    }

    return elemento;
}


// Obtiene todas las categorías para construir el filtro administrativo.
async function obtenerCategorias() {
    const categorias =
        [];

    let page =
        0;

    let totalPaginas =
        1;

    do {
        const respuesta =
            await listarCategorias({
                page,
                size:
                    100
            });

        categorias.push(
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

    return categorias;
}


// Resuelve el texto de cambio de estado según el estado actual.
function obtenerTextoCambiarEstado(
    estado
) {
    return estado === 'ACTIVA'
        ? datosListadoRecetas.acciones.cambiarEstadoActivo
        : datosListadoRecetas.acciones.cambiarEstadoInactivo;
}


// Adapta una receta del backend al contrato visual del listado.
function transformarReceta(
    receta
) {
    return {
        titulo:
            receta.titulo || '',

        categoria:
            receta.categoriaNombre || '',

        estado:
            receta.estado || '',

        textoVer:
            datosListadoRecetas.acciones.ver,

        textoEditar:
            datosListadoRecetas.acciones.editar,

        textoCambiarEstado:
            obtenerTextoCambiarEstado(
                receta.estado
            ),

        alVer:
            ({ origen }) => {
                mostrarVerReceta({
                    id:
                        receta.id,

                    origen
                });
            },

        alEditar:
            ({ origen }) => {
                mostrarEditarReceta({
                    id:
                        receta.id,

                    origen,

                    alActualizada:
                        cargarPaginaActual
                });
            },

        alCambiarEstado:
            async () => {
                const nuevoEstado =
                    receta.estado === 'ACTIVA'
                        ? 'INACTIVA'
                        : 'ACTIVA';

                await cambiarEstadoReceta(
                    receta.id,
                    nuevoEstado
                );

                await cargarPaginaActual();
            }
    };
}


// Consulta la página vigente aplicando búsqueda y filtros reales.
async function cargarPaginaActual() {
    controladorConsulta?.abort();

    controladorConsulta =
        new AbortController();

    try {
        const respuesta =
            await listarRecetas({
                page:
                    0,

                size:
                    TAMANIO_PAGINA,

                buscar:
                    terminoActual,

                estado:
                    estadoActual || undefined,

                categoriaId:
                    categoriaActual || undefined,

                signal:
                    controladorConsulta.signal
            });

        configurarListadoRecetasAdministracion(
            elementoListado,
            {
                items:
                    (
                        respuesta.contenido ||
                        []
                    ).map(
                        transformarReceta
                    ),

                mensajeVacio:
                    datosListadoRecetas.mensajeVacio
            }
        );
    } catch (error) {
        if (
            error?.name ===
            'AbortError'
        ) {
            return;
        }

        throw error;
    }
}


// Retrasa brevemente la consulta mientras se escribe en el buscador.
function programarBusqueda(
    termino
) {
    terminoActual =
        termino;

    clearTimeout(
        temporizadorBusqueda
    );

    temporizadorBusqueda =
        setTimeout(
            () => {
                cargarPaginaActual().catch(
                    (error) => {
                        console.error(
                            'No fue posible buscar recetas administrativas:',
                            error
                        );
                    }
                );
            },
            RETRASO_BUSQUEDA
        );
}


// Carga buscador, filtros y listado administrativo dentro de sus anclajes.
async function cargarGestionRecetas() {
    const anclajeBuscador =
        document.getElementById(
            'buscador-recetas'
        );

    const anclajeFiltros =
        document.getElementById(
            'filtros-recetas'
        );

    const anclajeListado =
        document.getElementById(
            'listado-recetas'
        );

    if (
        !anclajeBuscador ||
        !anclajeFiltros ||
        !anclajeListado
    ) {
        throw new Error(
            'No existen todos los puntos de anclaje de la gestión de recetas.'
        );
    }

    const [
        htmlListado,
        categorias,
        buscador
    ] =
        await Promise.all([
            obtenerPlantillaListado(),
            obtenerCategorias(),
            cargarBuscadorRecetas({
                alBuscar:
                    ({ termino }) => {
                        programarBusqueda(
                            termino
                        );
                    }
            })
        ]);

    const filtros =
        await cargarFiltrosRecetas({
            categorias,

            alCambiar:
                ({
                    categoriaId,
                    estado
                }) => {
                    categoriaActual =
                        categoriaId;

                    estadoActual =
                        estado;

                    cargarPaginaActual().catch(
                        (error) => {
                            console.error(
                                'No fue posible filtrar recetas administrativas:',
                                error
                            );
                        }
                    );
                }
        });

    elementoListado =
        crearElemento(
            htmlListado
        );

    configurarListadoRecetasAdministracion(
        elementoListado,
        {
            items: [],

            mensajeVacio:
                datosListadoRecetas.mensajeVacio
        }
    );

    anclajeBuscador.replaceChildren(
        buscador
    );

    anclajeFiltros.replaceChildren(
        filtros
    );

    anclajeListado.replaceChildren(
        elementoListado
    );

    await cargarPaginaActual();
}


// Se autoejecuta cuando principal.js importa este cargador.
cargarGestionRecetas().catch(
    (error) => {
        console.error(
            'No fue posible cargar la gestión administrativa de Recetas:',
            error
        );
    }
);
