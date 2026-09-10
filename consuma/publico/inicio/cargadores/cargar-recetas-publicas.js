// Consulta exclusivamente las recetas visibles desde la API pública.
import {
    listarRecetasPublicas
} from '../../../../cliente-api/publico/recetas-api.js';

// Obtiene los textos estáticos del buscador público.
import {
    datosBuscadorRecetas
} from '../../../../datos/publico/datos-buscador-recetas.js';

// Obtiene los textos estáticos de los resultados públicos.
import {
    datosResultadosRecetas
} from '../../../../datos/publico/datos-resultados-recetas.js';

// Configura el elemento reutilizable del buscador.
import {
    configurarBuscadorRecetas
} from '../../../../elementos/buscador-recetas/buscador-recetas.js';

// Configura el elemento reutilizable de resultados.
import {
    configurarResultadosRecetas
} from '../../../../elementos/resultados-recetas/resultados-recetas.js';

// Abre el detalle público de la receta seleccionada.
import {
    mostrarVerReceta
} from './cargar-ver-receta.js';


const RUTA_BUSCADOR =
    new URL(
        '../../../../elementos/buscador-recetas/buscador-recetas.html',
        import.meta.url
    );

const RUTA_RESULTADOS =
    new URL(
        '../../../../elementos/resultados-recetas/resultados-recetas.html',
        import.meta.url
    );

const LIMITE_RESULTADOS =
    10;

let controladorConsulta =
    null;

let temporizadorBusqueda =
    null;


// Obtiene una plantilla HTML reutilizable.
async function obtenerPlantilla(
    ruta,
    nombre
) {
    const respuesta =
        await fetch(
            ruta
        );

    if (!respuesta.ok) {
        throw new Error(
            `No fue posible cargar ${nombre}. HTTP ${respuesta.status}.`
        );
    }

    return respuesta.text();
}


// Crea una instancia DOM a partir de una plantilla HTML.
function crearElemento(
    html,
    nombre
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
            `La plantilla ${nombre} no contiene un elemento válido.`
        );
    }

    return elemento;
}


// Adapta una receta pública al contrato visual del elemento de resultados.
function transformarReceta(
    receta
) {
    return {
        titulo:
            receta.titulo || '',

        categoria:
            receta.categoriaNombre || '',

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


// Consulta como máximo diez recetas utilizando búsqueda server-side.
async function consultarRecetas(
    termino,
    elementoResultados
) {
    controladorConsulta?.abort();

    controladorConsulta =
        new AbortController();

    try {
        const respuesta =
            await listarRecetasPublicas({
                page:
                    0,

                size:
                LIMITE_RESULTADOS,

                buscar:
                termino,

                signal:
                controladorConsulta.signal
            });

        const recetas =
            respuesta.contenido || [];

        configurarResultadosRecetas(
            elementoResultados,
            {
                items:
                    recetas.map(
                        transformarReceta
                    ),

                mensajeVacio:
                datosResultadosRecetas.mensajeVacio
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


// Coordina la búsqueda sin consultar el backend en cada pulsación inmediata.
function programarBusqueda(
    termino,
    elementoResultados
) {
    clearTimeout(
        temporizadorBusqueda
    );

    temporizadorBusqueda =
        setTimeout(
            () => {
                consultarRecetas(
                    termino,
                    elementoResultados
                ).catch(
                    (error) => {
                        console.error(
                            'No fue posible buscar recetas públicas:',
                            error
                        );
                    }
                );
            },
            250
        );
}


// Carga y conecta el buscador con los resultados públicos.
async function cargarRecetasPublicas() {
    const anclajeBuscador =
        document.getElementById(
            'buscador-recetas'
        );

    const anclajeResultados =
        document.getElementById(
            'resultados-recetas'
        );

    if (
        !anclajeBuscador ||
        !anclajeResultados
    ) {
        throw new Error(
            'No existen los puntos de anclaje del buscador y resultados de recetas.'
        );
    }

    const [
        htmlBuscador,
        htmlResultados
    ] =
        await Promise.all([
            obtenerPlantilla(
                RUTA_BUSCADOR,
                'buscador-recetas.html'
            ),

            obtenerPlantilla(
                RUTA_RESULTADOS,
                'resultados-recetas.html'
            )
        ]);

    const buscador =
        crearElemento(
            htmlBuscador,
            'buscador-recetas.html'
        );

    const resultados =
        crearElemento(
            htmlResultados,
            'resultados-recetas.html'
        );

    configurarBuscadorRecetas(
        buscador,
        {
            placeholder:
            datosBuscadorRecetas.placeholder,

            alBuscar:
                ({ termino }) => {
                    programarBusqueda(
                        termino,
                        resultados
                    );
                }
        }
    );

    configurarResultadosRecetas(
        resultados,
        {
            items: [],

            mensajeVacio:
            datosResultadosRecetas.mensajeVacio
        }
    );

    anclajeBuscador.replaceChildren(
        buscador
    );

    anclajeResultados.replaceChildren(
        resultados
    );

    await consultarRecetas(
        '',
        resultados
    );
}


// El cargador se autoejecuta cuando la página pública lo importa.
cargarRecetasPublicas().catch(
    (error) => {
        console.error(
            'No fue posible cargar las recetas públicas:',
            error
        );
    }
);