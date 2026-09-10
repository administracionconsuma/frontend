/*
    Elemento reutilizable para representar el detalle de cualquier registro.

    No conoce Recetas, Insumos, pantallas ni API.
    Cada cargador adapta su dominio y entrega únicamente información visual
    y callbacks mediante abrirModalVerDetalle().
*/

let modalActivo = null;
let focoAnterior = null;


// Obtiene un nodo interno del elemento sin repetir consultas directas.
function obtener(
    elemento,
    selector
) {
    return elemento?.querySelector(
        selector
    ) ?? null;
}


// Normaliza valores ausentes para no representar null o undefined.
function obtenerTexto(
    valor,
    valorVacio = 'Sin información'
) {
    if (
        valor === null ||
        valor === undefined ||
        valor === ''
    ) {
        return valorVacio;
    }

    return String(
        valor
    );
}


// Actualiza un texto opcional y controla automáticamente su visibilidad.
function actualizarTextoOpcional(
    elemento,
    valor
) {
    if (!elemento) {
        return;
    }

    const texto =
        valor === null ||
        valor === undefined
            ? ''
            : String(valor).trim();

    elemento.textContent =
        texto;

    elemento.hidden =
        !texto;
}


// Construye un campo visual de solo lectura a partir de información ya adaptada.
function crearCampo(
    campo
) {
    const contenedor =
        document.createElement(
            'div'
        );

    contenedor.className =
        'modal-ver-detalle__campo';

    if (campo?.anchoCompleto) {
        contenedor.classList.add(
            'modal-ver-detalle__campo--ancho'
        );
    }

    const etiqueta =
        document.createElement(
            'span'
        );

    etiqueta.className =
        'modal-ver-detalle__campo-etiqueta';

    etiqueta.textContent =
        obtenerTexto(
            campo?.etiqueta,
            'Dato'
        );

    const valor =
        document.createElement(
            'p'
        );

    valor.className =
        'modal-ver-detalle__campo-valor';

    valor.textContent =
        obtenerTexto(
            campo?.valor,
            campo?.valorVacio ??
                'Sin información'
        );

    contenedor.append(
        etiqueta,
        valor
    );

    return contenedor;
}


// Construye una sección con cualquier cantidad de campos recibidos.
function crearSeccion(
    seccion
) {
    const contenedor =
        document.createElement(
            'section'
        );

    contenedor.className =
        'modal-ver-detalle__seccion';

    const titulo =
        seccion?.titulo === null ||
        seccion?.titulo === undefined
            ? ''
            : String(
                seccion.titulo
            ).trim();

    if (titulo) {
        const encabezado =
            document.createElement(
                'h3'
            );

        encabezado.className =
            'modal-ver-detalle__seccion-titulo';

        encabezado.textContent =
            titulo;

        contenedor.appendChild(
            encabezado
        );
    }

    const campos =
        document.createElement(
            'div'
        );

    campos.className =
        'modal-ver-detalle__campos';

    const registros =
        Array.isArray(
            seccion?.campos
        )
            ? seccion.campos
            : [];

    registros.forEach(
        (campo) => {
            campos.appendChild(
                crearCampo(
                    campo
                )
            );
        }
    );

    contenedor.appendChild(
        campos
    );

    return contenedor;
}


// Construye las acciones recibidas sin conocer su finalidad de negocio.
function representarAcciones(
    modal,
    acciones = []
) {
    const contenedor =
        obtener(
            modal,
            '[data-modal-ver-detalle-acciones]'
        );

    if (!contenedor) {
        return;
    }

    contenedor.replaceChildren();

    acciones.forEach(
        (accion) => {
            if (
                !accion ||
                typeof accion.alSeleccionar !==
                    'function'
            ) {
                return;
            }

            const boton =
                document.createElement(
                    'button'
                );

            boton.type =
                'button';

            boton.className =
                'modal-ver-detalle__boton';

            const variante =
                accion.variante ===
                    'peligro'
                    ? 'peligro'
                    : 'secundario';

            boton.classList.add(
                `modal-ver-detalle__boton--${variante}`
            );

            boton.textContent =
                obtenerTexto(
                    accion.texto,
                    'Acción'
                );

            boton.addEventListener(
                'click',
                () => {
                    accion.alSeleccionar({
                        modal,
                        origen:
                            focoAnterior
                    });
                }
            );

            contenedor.appendChild(
                boton
            );
        }
    );

    contenedor.hidden =
        contenedor.children.length ===
        0;
}


// Representa toda la información preparada por el cargador del dominio.
function representarDetalle(
    modal,
    detalle = {}
) {
    const etiqueta =
        obtener(
            modal,
            '[data-modal-ver-detalle-etiqueta]'
        );

    const titulo =
        obtener(
            modal,
            '[data-modal-ver-detalle-titulo]'
        );

    const descripcion =
        obtener(
            modal,
            '[data-modal-ver-detalle-descripcion]'
        );

    const estado =
        obtener(
            modal,
            '[data-modal-ver-detalle-estado]'
        );

    const contenido =
        obtener(
            modal,
            '[data-modal-ver-detalle-contenido]'
        );

    actualizarTextoOpcional(
        etiqueta,
        detalle.etiqueta
    );

    if (titulo) {
        titulo.textContent =
            obtenerTexto(
                detalle.titulo,
                'Detalle'
            );
    }

    actualizarTextoOpcional(
        descripcion,
        detalle.descripcion
    );

    if (estado) {
        const textoEstado =
            detalle?.estado?.texto ??
            detalle?.estado;

        actualizarTextoOpcional(
            estado,
            textoEstado
        );

        const variante =
            detalle?.estado &&
            typeof detalle.estado ===
                'object'
                ? detalle.estado.variante
                : null;

        if (variante) {
            estado.dataset.estadoVariante =
                variante;
        } else {
            delete estado.dataset.estadoVariante;
        }
    }

    if (contenido) {
        contenido.replaceChildren();

        const secciones =
            Array.isArray(
                detalle.secciones
            )
                ? detalle.secciones
                : [];

        secciones.forEach(
            (seccion) => {
                contenido.appendChild(
                    crearSeccion(
                        seccion
                    )
                );
            }
        );
    }

    representarAcciones(
        modal,
        Array.isArray(
            detalle.acciones
        )
            ? detalle.acciones
            : []
    );
}


// Muestra un mensaje externo sin interpretar errores de ningún dominio.
export function mostrarMensajeModalVerDetalle(
    modal,
    mensaje = ''
) {
    const elemento =
        obtener(
            modal,
            '[data-modal-ver-detalle-mensaje]'
        );

    actualizarTextoOpcional(
        elemento,
        mensaje
    );
}


// Cierra la instancia activa y devuelve el foco al origen.
export function cerrarModalVerDetalle() {
    if (!modalActivo) {
        return;
    }

    modalActivo.hidden =
        true;

    if (
        focoAnterior &&
        focoAnterior.isConnected
    ) {
        focoAnterior.focus();
    }

    modalActivo =
        null;

    focoAnterior =
        null;
}


// Abre el modal utilizando únicamente información ya adaptada desde afuera.
export function abrirModalVerDetalle({
    modal,
    origen = null,
    detalle = {}
}) {
    if (!modal) {
        throw new Error(
            'No se recibió modal-ver-detalle.'
        );
    }

    if (modalActivo) {
        return;
    }

    modalActivo =
        modal;

    focoAnterior =
        origen ||
        document.activeElement;

    representarDetalle(
        modal,
        detalle
    );

    mostrarMensajeModalVerDetalle(
        modal
    );

    modal.hidden =
        false;

    obtener(
        modal,
        '[data-modal-ver-detalle-panel]'
    )?.focus();
}


// Configura las interacciones internas y los textos propios del elemento.
export function configurarModalVerDetalle(
    elemento,
    {
        textoCerrar = 'Cerrar',
        ariaCerrar = 'Cerrar detalle'
    } = {}
) {
    if (!elemento) {
        throw new Error(
            'No se recibió el elemento modal-ver-detalle.'
        );
    }

    const fondo =
        obtener(
            elemento,
            '[data-modal-ver-detalle-fondo]'
        );

    const panel =
        obtener(
            elemento,
            '[data-modal-ver-detalle-panel]'
        );

    const cerrar =
        obtener(
            elemento,
            '[data-modal-ver-detalle-cerrar]'
        );

    const cerrarPrincipal =
        obtener(
            elemento,
            '[data-modal-ver-detalle-cerrar-principal]'
        );

    const contenido =
        obtener(
            elemento,
            '[data-modal-ver-detalle-contenido]'
        );

    if (
        !fondo ||
        !panel ||
        !cerrar ||
        !cerrarPrincipal ||
        !contenido
    ) {
        throw new Error(
            'La estructura de modal-ver-detalle está incompleta.'
        );
    }

    cerrar.setAttribute(
        'aria-label',
        ariaCerrar
    );

    cerrarPrincipal.textContent =
        textoCerrar;

    fondo.addEventListener(
        'click',
        cerrarModalVerDetalle
    );

    cerrar.addEventListener(
        'click',
        cerrarModalVerDetalle
    );

    cerrarPrincipal.addEventListener(
        'click',
        cerrarModalVerDetalle
    );

    elemento.addEventListener(
        'keydown',
        (evento) => {
            if (
                evento.key ===
                'Escape'
            ) {
                cerrarModalVerDetalle();
            }
        }
    );

    return elemento;
}
