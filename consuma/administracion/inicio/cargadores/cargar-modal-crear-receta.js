// Crea recetas mediante la API administrativa.
import {
    crearReceta
} from '../../../../cliente-api/administracion/recetas-api.js';

// Consulta las categorías administrativas disponibles.
import {
    listarCategorias
} from '../../../../cliente-api/administracion/categorias-api.js';

// Consulta los insumos administrativos disponibles.
import {
    listarInsumos
} from '../../../../cliente-api/administracion/insumos-api.js';

// Obtiene los textos y configuración estática del modal.
import {
    datosCrearReceta
} from '../../../../datos/administracion/inicio/datos-crear-receta.js';

// Configura y abre el elemento reutilizable para crear recetas.
import {
    configurarModalCrearReceta,
    abrirModalCrearReceta
} from '../../../../elementos/modal-crear-receta/modal-crear-receta.js';

// Resuelve la plantilla reutilizable del modal desde la ubicación real del cargador.
const RUTA_MODAL =
    new URL(
        '../../../../elementos/modal-crear-receta/modal-crear-receta.html',
        import.meta.url
    );

const TAMANO_PAGINA =
    100;

let modalCrearReceta = null;
let plantillaModalCrearReceta = null;


// Obtiene y conserva el HTML reutilizable del modal.
async function obtenerHtmlModalCrearReceta() {
    if (plantillaModalCrearReceta) {
        return plantillaModalCrearReceta;
    }

    const respuesta =
        await fetch(
            RUTA_MODAL
        );

    if (!respuesta.ok) {
        throw new Error(
            `No fue posible cargar modal-crear-receta. HTTP ${respuesta.status}.`
        );
    }

    plantillaModalCrearReceta =
        await respuesta.text();

    return plantillaModalCrearReceta;
}


// Consulta todas las páginas de un catálogo administrativo.
async function listarCatalogoCompleto(
    consultar,
    estado
) {
    const elementos =
        [];

    let pagina =
        0;

    let totalPaginas =
        1;

    while (
        pagina <
        totalPaginas
        ) {
        const respuesta =
            await consultar({
                page:
                pagina,

                size:
                TAMANO_PAGINA,

                estado
            });

        elementos.push(
            ...(
                respuesta.contenido ||
                []
            )
        );

        totalPaginas =
            respuesta.totalPaginas ||
            0;

        pagina +=
            1;
    }

    return elementos;
}


// Obtiene únicamente categorías activas disponibles para nuevas recetas.
async function obtenerCategoriasActivas() {
    return listarCatalogoCompleto(
        listarCategorias,
        'ACTIVA'
    );
}


// Obtiene únicamente insumos activos disponibles para nuevas recetas.
async function obtenerInsumosActivos() {
    return listarCatalogoCompleto(
        listarInsumos,
        'ACTIVO'
    );
}


// Monta una única instancia reutilizable del modal sobre document.body.
async function obtenerModalCrearReceta() {
    if (
        modalCrearReceta &&
        modalCrearReceta.isConnected
    ) {
        return modalCrearReceta;
    }

    const html =
        await obtenerHtmlModalCrearReceta();

    const montaje =
        document.createElement(
            'div'
        );

    montaje.innerHTML =
        html.trim();

    const elemento =
        montaje.firstElementChild;

    if (!elemento) {
        throw new Error(
            'El HTML de modal-crear-receta no contiene el elemento esperado.'
        );
    }

    document.body.appendChild(
        elemento
    );

    modalCrearReceta =
        configurarModalCrearReceta(
            elemento,
            {
                configuracion:
                datosCrearReceta,

                alCrear:
                crearReceta
            }
        );

    return modalCrearReceta;
}


// Abre el modal con categorías e insumos vigentes en cada apertura.
export async function mostrarCrearReceta({
                                             origen = null
                                         } = {}) {
    const modal =
        await obtenerModalCrearReceta();

    const [
        categorias,
        insumos
    ] =
        await Promise.all([
            obtenerCategoriasActivas(),
            obtenerInsumosActivos()
        ]);

    abrirModalCrearReceta({
        modal,
        origen,
        categorias,
        insumos
    });
}