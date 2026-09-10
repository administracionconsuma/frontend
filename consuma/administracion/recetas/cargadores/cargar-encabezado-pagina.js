// Obtiene los textos del encabezado administrativo de Recetas.
import {
    datosEncabezadoPagina
} from '../../../../datos/administracion/recetas/datos-encabezado-pagina.js';

// Configura el encabezado de página reutilizable.
import {
    configurarEncabezadoPagina
} from '../../../../elementos/encabezado-pagina/encabezado-pagina.js';

// Reutiliza el flujo de creación de receta que ya funciona en Administración.
import {
    mostrarCrearReceta
} from '../../inicio/cargadores/cargar-modal-crear-receta.js';

const RUTA_PLANTILLA =
    new URL(
        '../../../../elementos/encabezado-pagina/encabezado-pagina.html',
        import.meta.url
    );

let plantillaEncabezadoPagina = null;


// Obtiene una sola vez la plantilla reutilizable.
async function obtenerPlantillaEncabezadoPagina() {
    if (plantillaEncabezadoPagina) {
        return plantillaEncabezadoPagina;
    }

    const respuesta =
        await fetch(
            RUTA_PLANTILLA
        );

    if (!respuesta.ok) {
        throw new Error(
            `No fue posible cargar encabezado-pagina.html. HTTP ${respuesta.status}.`
        );
    }

    plantillaEncabezadoPagina =
        await respuesta.text();

    return plantillaEncabezadoPagina;
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
            'La plantilla encabezado-pagina.html no contiene un elemento válido.'
        );
    }

    return elemento;
}


// Carga y monta el encabezado propio de la página de Recetas.
async function cargarEncabezadoPagina() {
    const anclaje =
        document.getElementById(
            'encabezado-pagina'
        );

    if (!anclaje) {
        throw new Error(
            'No existe el punto de anclaje #encabezado-pagina.'
        );
    }

    const html =
        await obtenerPlantillaEncabezadoPagina();

    const elemento =
        crearElemento(
            html
        );

    configurarEncabezadoPagina(
        elemento,
        {
            titulo:
                datosEncabezadoPagina.titulo,

            descripcion:
                datosEncabezadoPagina.descripcion,

            icono:
                datosEncabezadoPagina.icono,

            textoAccion:
                datosEncabezadoPagina.textoAccion,

            alAccionar:
                ({ origen }) => {
                    mostrarCrearReceta({
                        origen
                    });
                }
        }
    );

    anclaje.replaceChildren(
        elemento
    );
}


// Se autoejecuta cuando principal.js importa este cargador.
cargarEncabezadoPagina().catch(
    (error) => {
        console.error(
            'No fue posible cargar el encabezado de página de Recetas:',
            error
        );
    }
);
