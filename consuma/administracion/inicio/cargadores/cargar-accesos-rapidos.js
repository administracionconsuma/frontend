import {
    configurarAccesoRapido
} from '../../../../elementos/acceso-rapido/acceso-rapido.js';

import {
    datosAccesosRapidos
} from '../../../../datos/administracion/inicio/datos-accesos-rapidos.js';

import {
    mostrarCrearInsumo
} from './cargar-modal-crear-insumo.js';

import {
    mostrarCrearCategoria
} from './cargar-modal-crear-categoria.js';

import {
    mostrarCrearReceta
} from './cargar-modal-crear-receta.js';

const RUTA_PLANTILLA_ACCESO_RAPIDO =
    new URL(
        '../../../../elementos/acceso-rapido/acceso-rapido.html',
        import.meta.url
    );

let plantillaAccesoRapido = null;


// Obtiene una sola vez la plantilla reutilizable del acceso rápido.
async function obtenerPlantillaAccesoRapido() {
    if (plantillaAccesoRapido) {
        return plantillaAccesoRapido;
    }

    const respuesta =
        await fetch(
            RUTA_PLANTILLA_ACCESO_RAPIDO
        );

    if (!respuesta.ok) {
        throw new Error(
            `No fue posible cargar acceso-rapido.html. HTTP ${respuesta.status}.`
        );
    }

    plantillaAccesoRapido =
        await respuesta.text();

    return plantillaAccesoRapido;
}


// Crea una instancia DOM nueva a partir de la plantilla reutilizable.
function crearElementoAccesoRapido(
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
            'La plantilla acceso-rapido.html no contiene un elemento válido.'
        );
    }

    return elemento;
}


// Resuelve la acción correspondiente a cada acceso definido en datos.
function obtenerAccionAcceso(
    id
) {
    const acciones = {
        'nuevo-insumo':
        mostrarCrearInsumo,

        'nueva-categoria':
        mostrarCrearCategoria,

        'nueva-receta':
        mostrarCrearReceta
    };

    return acciones[id] || null;
}


// Crea todos los accesos definidos actualmente en datos.
export async function cargarAccesosRapidos() {
    const html =
        await obtenerPlantillaAccesoRapido();

    return datosAccesosRapidos.map(
        (datos) => {
            const elemento =
                crearElementoAccesoRapido(
                    html
                );

            const accion =
                obtenerAccionAcceso(
                    datos.id
                );

            configurarAccesoRapido(
                elemento,
                {
                    ...datos,

                    alSeleccionar:
                        accion
                            ? () =>
                                accion({
                                    origen:
                                    elemento
                                })
                            : null
                }
            );

            return elemento;
        }
    );
}